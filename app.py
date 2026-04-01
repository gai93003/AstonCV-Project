from datetime import datetime, timedelta
import os
import sqlite3
import threading
import time

from flask import Flask, redirect, render_template, request, url_for

from whatsapp_sender import check_whatsapp_provider_health, send_whatsapp_message

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "scheduler.db")
DB_LOCK = threading.Lock()
SCHEDULER_STATE = {"started": False}
REPEAT_INTERVALS = {
    "hourly": timedelta(hours=1),
    "daily": timedelta(days=1),
}


def _get_db_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, check_same_thread=False)
    connection.row_factory = sqlite3.Row
    return connection


def _init_db() -> None:
    with _get_db_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mobile TEXT NOT NULL,
                message TEXT NOT NULL,
                schedule_mode TEXT NOT NULL,
                delay_amount INTEGER,
                delay_unit TEXT,
                exact_time TEXT,
                repeat_mode TEXT NOT NULL,
                status TEXT NOT NULL,
                next_run TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                last_sent TEXT,
                error TEXT,
                active INTEGER NOT NULL DEFAULT 1
            )
            """
        )
        connection.commit()


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _format_dt(value: datetime) -> str:
    return value.isoformat(timespec="seconds")


def _compute_first_run(schedule_mode: str, delay_amount_raw: str, delay_unit: str, exact_time_raw: str) -> datetime:
    now = datetime.now()

    if schedule_mode == "delay":
        if not delay_amount_raw:
            raise ValueError("Delay amount is required for delay-based scheduling.")
        delay_amount = int(delay_amount_raw)
        if delay_amount < 1:
            raise ValueError("Delay amount must be at least 1.")
        if delay_unit == "minutes":
            return now + timedelta(minutes=delay_amount)
        if delay_unit == "hours":
            return now + timedelta(hours=delay_amount)
        raise ValueError("Delay unit must be minutes or hours.")

    if schedule_mode == "exact":
        if not exact_time_raw:
            raise ValueError("Exact date and time is required for exact scheduling.")
        scheduled = datetime.strptime(exact_time_raw, "%Y-%m-%dT%H:%M")
        if scheduled <= now:
            raise ValueError("Exact schedule time must be in the future.")
        return scheduled

    raise ValueError("Schedule mode must be delay or exact.")


def _create_job(row: dict) -> None:
    first_run = _compute_first_run(
        row["schedule_mode"],
        row["delay_amount"],
        row["delay_unit"],
        row["exact_time"],
    )
    now = datetime.now()
    with DB_LOCK:
        with _get_db_connection() as connection:
            connection.execute(
                """
                INSERT INTO jobs (
                    mobile, message, schedule_mode, delay_amount, delay_unit, exact_time,
                    repeat_mode, status, next_run, created_at, updated_at, active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (
                    row["mobile"],
                    row["message"],
                    row["schedule_mode"],
                    int(row["delay_amount"]) if row["delay_amount"] else None,
                    row["delay_unit"],
                    row["exact_time"] or None,
                    row["repeat"],
                    "scheduled",
                    _format_dt(first_run),
                    _format_dt(now),
                    _format_dt(now),
                ),
            )
            connection.commit()


def _list_jobs():
    with DB_LOCK:
        with _get_db_connection() as connection:
            rows = connection.execute(
                "SELECT * FROM jobs ORDER BY id DESC"
            ).fetchall()
    return rows


def _get_job(job_id: int):
    with DB_LOCK:
        with _get_db_connection() as connection:
            row = connection.execute(
                "SELECT * FROM jobs WHERE id = ?",
                (job_id,),
            ).fetchone()
    return row


def _cancel_job(job_id: int) -> bool:
    now = _format_dt(datetime.now())
    with DB_LOCK:
        with _get_db_connection() as connection:
            result = connection.execute(
                """
                UPDATE jobs
                SET status = 'cancelled', active = 0, updated_at = ?, error = NULL
                WHERE id = ? AND active = 1
                """,
                (now, job_id),
            )
            connection.commit()
    return result.rowcount > 0


def _update_job(job_id: int, payload: dict) -> None:
    first_run = _compute_first_run(
        payload["schedule_mode"],
        payload["delay_amount"],
        payload["delay_unit"],
        payload["exact_time"],
    )
    now = _format_dt(datetime.now())
    with DB_LOCK:
        with _get_db_connection() as connection:
            result = connection.execute(
                """
                UPDATE jobs
                SET mobile = ?, message = ?, schedule_mode = ?, delay_amount = ?, delay_unit = ?,
                    exact_time = ?, repeat_mode = ?, status = 'scheduled', next_run = ?,
                    updated_at = ?, error = NULL, active = 1
                WHERE id = ?
                """,
                (
                    payload["mobile"],
                    payload["message"],
                    payload["schedule_mode"],
                    int(payload["delay_amount"]) if payload["delay_amount"] else None,
                    payload["delay_unit"],
                    payload["exact_time"] or None,
                    payload["repeat"],
                    _format_dt(first_run),
                    now,
                    job_id,
                ),
            )
            connection.commit()
    if result.rowcount == 0:
        raise ValueError("Job not found.")


def _process_due_job(job_id: int) -> None:
    job = _get_job(job_id)
    if not job:
        return

    try:
        send_whatsapp_message(job["mobile"], job["message"])
        send_error = None
    except (RuntimeError, ValueError, OSError) as exc:
        send_error = str(exc)

    now = datetime.now()
    with DB_LOCK:
        with _get_db_connection() as connection:
            current = connection.execute(
                "SELECT * FROM jobs WHERE id = ?",
                (job_id,),
            ).fetchone()
            if not current:
                return
        if send_error:
            connection.execute(
                """
                UPDATE jobs
                SET status = 'failed', error = ?, updated_at = ?
                WHERE id = ?
                """,
                (send_error, _format_dt(now), job_id),
            )
            connection.commit()
            return

        repeat = current["repeat_mode"]
        if repeat == "none":
            connection.execute(
                """
                UPDATE jobs
                SET status = 'completed', active = 0, last_sent = ?, updated_at = ?, error = NULL
                WHERE id = ?
                """,
                (_format_dt(now), _format_dt(now), job_id),
            )
            connection.commit()
            return

        interval = REPEAT_INTERVALS[repeat]
        next_run = _parse_dt(current["next_run"]) + interval
        while next_run <= now:
            next_run += interval

        connection.execute(
            """
            UPDATE jobs
            SET status = 'scheduled', next_run = ?, last_sent = ?, updated_at = ?, error = NULL
            WHERE id = ?
            """,
            (_format_dt(next_run), _format_dt(now), _format_dt(now), job_id),
        )
        connection.commit()


def _scheduler_loop() -> None:
    while True:
        now = _format_dt(datetime.now())
        due_job_ids = []

        with DB_LOCK:
            with _get_db_connection() as connection:
                updated = connection.execute(
                    """
                    UPDATE jobs
                    SET status = 'sending', updated_at = ?
                    WHERE id IN (
                        SELECT id FROM jobs
                        WHERE active = 1 AND status = 'scheduled' AND next_run <= ?
                        ORDER BY next_run ASC
                    )
                    RETURNING id
                    """,
                    (_format_dt(datetime.now()), now),
                ).fetchall()
                due_job_ids = [row["id"] for row in updated]
                connection.commit()

        for job_id in due_job_ids:
            thread = threading.Thread(target=_process_due_job, args=(job_id,), daemon=True)
            thread.start()

        time.sleep(1)


def _serialize_job(job: dict) -> dict:
    return {
        "id": job["id"],
        "mobile": job["mobile"],
        "message": job["message"],
        "schedule_mode": job["schedule_mode"],
        "repeat": job["repeat_mode"],
        "status": job["status"],
        "next_run": _parse_dt(job["next_run"]).strftime("%Y-%m-%d %H:%M:%S") if job["next_run"] else "-",
        "created_at": _parse_dt(job["created_at"]).strftime("%Y-%m-%d %H:%M:%S"),
        "last_sent": _parse_dt(job["last_sent"]).strftime("%Y-%m-%d %H:%M:%S") if job["last_sent"] else "-",
        "error": job["error"] or "-",
        "active": bool(job["active"]),
    }


def _ensure_scheduler_running() -> None:
    if SCHEDULER_STATE["started"]:
        return
    scheduler = threading.Thread(target=_scheduler_loop, daemon=True)
    scheduler.start()
    SCHEDULER_STATE["started"] = True


def _build_default_row() -> dict:
    return {
        "mobile": "",
        "message": "",
        "schedule_mode": "delay",
        "delay_amount": "5",
        "delay_unit": "minutes",
        "exact_time": "",
        "repeat": "none",
    }


def _get_provider_name() -> str:
    return os.getenv("WHATSAPP_PROVIDER", "meta").strip().lower()


@app.route("/", methods=["GET", "POST"])
def index():
    _ensure_scheduler_running()
    context = {
        "status": request.args.get("status"),
        "error": request.args.get("error"),
        "provider": _get_provider_name(),
        "rows": [_build_default_row()],
        "jobs": [],
        "editing_job": None,
    }

    edit_id = request.args.get("edit_id", type=int)
    if edit_id:
        job = _get_job(edit_id)
        if job:
            exact_time = ""
            if job["exact_time"]:
                exact_time = _parse_dt(job["exact_time"]).strftime("%Y-%m-%dT%H:%M")
            context["editing_job"] = {
                "id": job["id"],
                "mobile": job["mobile"],
                "message": job["message"],
                "schedule_mode": job["schedule_mode"],
                "delay_amount": job["delay_amount"] if job["delay_amount"] is not None else "",
                "delay_unit": job["delay_unit"] or "minutes",
                "exact_time": exact_time,
                "repeat": job["repeat_mode"],
                "status": job["status"],
            }

    if request.method == "POST":
        mobiles = request.form.getlist("mobile[]")
        messages = request.form.getlist("message[]")
        schedule_modes = request.form.getlist("schedule_mode[]")
        delay_amounts = request.form.getlist("delay_amount[]")
        delay_units = request.form.getlist("delay_unit[]")
        exact_times = request.form.getlist("exact_time[]")
        repeats = request.form.getlist("repeat[]")

        rows = []
        row_count = max(
            len(mobiles),
            len(messages),
            len(schedule_modes),
            len(delay_amounts),
            len(delay_units),
            len(exact_times),
            len(repeats),
        )

        for idx in range(row_count):
            row = {
                "mobile": mobiles[idx].strip() if idx < len(mobiles) else "",
                "message": messages[idx].strip() if idx < len(messages) else "",
                "schedule_mode": schedule_modes[idx].strip() if idx < len(schedule_modes) else "delay",
                "delay_amount": delay_amounts[idx].strip() if idx < len(delay_amounts) else "",
                "delay_unit": delay_units[idx].strip() if idx < len(delay_units) else "minutes",
                "exact_time": exact_times[idx].strip() if idx < len(exact_times) else "",
                "repeat": repeats[idx].strip() if idx < len(repeats) else "none",
            }

            if any([row["mobile"], row["message"], row["delay_amount"], row["exact_time"]]):
                rows.append(row)

        if rows:
            context["rows"] = rows

        try:
            if not rows:
                raise ValueError("Add at least one recipient schedule row.")

            created_count = 0
            for row in rows:
                if not row["mobile"]:
                    raise ValueError("Each row requires a mobile number.")
                if not row["message"]:
                    raise ValueError("Each row requires a message.")

                repeat = row["repeat"]
                if repeat not in ("none", "hourly", "daily"):
                    raise ValueError("Repeat must be none, hourly, or daily.")

                _create_job(row)
                created_count += 1

            context["status"] = f"Scheduled {created_count} job(s) successfully."
            context["rows"] = [_build_default_row()]
        except ValueError as exc:
            context["error"] = str(exc)
        except RuntimeError as exc:
            context["error"] = f"Failed to schedule message: {exc}"

    context["jobs"] = [_serialize_job(job) for job in _list_jobs()]

    return render_template("index.html", **context)


@app.post("/jobs/<int:job_id>/cancel")
def cancel_job(job_id: int):
    _ensure_scheduler_running()
    success = _cancel_job(job_id)
    if not success:
        return redirect(url_for("index", error="Unable to cancel job."))
    return redirect(url_for("index", status=f"Job {job_id} cancelled."))


@app.route("/provider/health", methods=["POST"], endpoint="check_provider_health")
def check_provider_health_route():
    _ensure_scheduler_running()
    try:
        message = check_whatsapp_provider_health()
        return redirect(url_for("index", status=message))
    except RuntimeError as exc:
        return redirect(url_for("index", error=str(exc)))


@app.post("/jobs/<int:job_id>/edit")
def edit_job(job_id: int):
    _ensure_scheduler_running()
    payload = {
        "mobile": request.form.get("mobile", "").strip(),
        "message": request.form.get("message", "").strip(),
        "schedule_mode": request.form.get("schedule_mode", "delay").strip(),
        "delay_amount": request.form.get("delay_amount", "").strip(),
        "delay_unit": request.form.get("delay_unit", "minutes").strip(),
        "exact_time": request.form.get("exact_time", "").strip(),
        "repeat": request.form.get("repeat", "none").strip(),
    }

    try:
        if not payload["mobile"]:
            raise ValueError("Mobile number is required.")
        if not payload["message"]:
            raise ValueError("Message is required.")
        if payload["repeat"] not in ("none", "hourly", "daily"):
            raise ValueError("Repeat must be none, hourly, or daily.")

        _update_job(job_id, payload)
        return redirect(url_for("index", status=f"Job {job_id} updated."))
    except (ValueError, RuntimeError) as exc:
        return redirect(url_for("index", error=str(exc), edit_id=job_id))


_init_db()


if __name__ == "__main__":
    _ensure_scheduler_running()
    app.run(debug=True, use_reloader=False)

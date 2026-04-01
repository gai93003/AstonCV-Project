# WhatsApp Scheduler Bot

A Flask-based WhatsApp scheduler that supports:

1. Multiple recipients in one submission
2. Different schedule rules per recipient
3. Recurring jobs (hourly/daily)
4. Persistent storage with SQLite
5. Edit and cancel actions per job

## Features

1. One-time scheduling:
	1. Send after X minutes or X hours
	2. Send at an exact date/time
2. Recurring scheduling:
	1. Every hour
	2. Every day
3. Job management:
	1. View queued/sent/failed jobs
	2. Edit existing jobs
	3. Cancel active jobs
4. Provider health check button in the UI

## Project Files

1. `app.py`: Flask app, scheduler loop, SQLite job management
2. `whatsapp_sender.py`: Provider integrations (Meta/Twilio/pywhatkit)
3. `templates/index.html`: Web UI
4. `scheduler.db`: SQLite database (created automatically)
5. `.env.example`: environment variable template

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirement.txt
```

3. Copy environment template and configure it:

```bash
cp .env.example .env
```

4. Run the web app:

```bash
python app.py
```

5. Open:

`http://127.0.0.1:5000`

## Provider Modes

Set `WHATSAPP_PROVIDER` in `.env`.

### 1) Meta Cloud API (default, automatic)

Use this for fully automatic sending without browser prompts.

Required variables:

1. `WHATSAPP_PROVIDER=meta`
2. `META_WHATSAPP_TOKEN`
3. `META_WHATSAPP_PHONE_NUMBER_ID`
4. Optional: `META_WHATSAPP_API_VERSION` (default `v20.0`)

### 2) pywhatkit (localhost free mode)

Required variables:

1. `WHATSAPP_PROVIDER=pywhatkit`

Notes:

1. Uses browser automation
2. WhatsApp Web must be logged in
3. Browser/PC must remain available while jobs run

### 3) Twilio (alternative API provider)

Required variables:

1. `WHATSAPP_PROVIDER=twilio`
2. `TWILIO_ACCOUNT_SID`
3. `TWILIO_AUTH_TOKEN`
4. `TWILIO_WHATSAPP_FROM`

## Using the Scheduler

1. Add one or more recipient rows.
2. Choose schedule mode per row (`delay` or `exact`).
3. Choose repeat rule (`none`, `hourly`, `daily`).
4. Submit to create independent jobs.
5. Use `Edit` or `Cancel` in the jobs table as needed.
6. Click `Check Provider Health` before scheduling to verify credentials/config.

## Persistence

Jobs are stored in `scheduler.db`, so schedules survive app restarts.

## Deployment Note

For production deployment, run one scheduler process/instance to avoid duplicate sends for recurring jobs.
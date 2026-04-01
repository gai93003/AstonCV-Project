import os

try:
    from dotenv import load_dotenv
except ImportError:  # Optional for localhost usage without .env support.
    load_dotenv = None

if load_dotenv:
    load_dotenv()


def _normalize_meta_number(number: str) -> str:
    stripped = number.strip()
    if stripped.startswith("whatsapp:"):
        stripped = stripped.split("whatsapp:", 1)[1]
    digits = "".join(ch for ch in stripped if ch.isdigit())
    if not digits:
        raise ValueError("Invalid mobile number for Meta Cloud API.")
    return digits


def _normalize_whatsapp_number(number: str) -> str:
    stripped = number.strip()
    if stripped.startswith("whatsapp:"):
        return stripped
    return f"whatsapp:{stripped}"


def _send_via_twilio(mobile: str, message: str) -> str:
    from twilio.rest import Client

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")

    if not account_sid or not auth_token or not whatsapp_from:
        raise RuntimeError(
            "Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM."
        )

    client = Client(account_sid, auth_token)
    response = client.messages.create(
        from_=_normalize_whatsapp_number(whatsapp_from),
        to=_normalize_whatsapp_number(mobile),
        body=message,
    )
    return response.sid


def _send_via_meta_cloud_api(mobile: str, message: str) -> str:
    try:
        import requests
    except ImportError as exc:
        raise RuntimeError("Missing 'requests' package. Install dependencies from requirement.txt.") from exc

    api_token = os.getenv("META_WHATSAPP_TOKEN")
    phone_number_id = os.getenv("META_WHATSAPP_PHONE_NUMBER_ID")
    api_version = os.getenv("META_WHATSAPP_API_VERSION", "v20.0")

    if not api_token or not phone_number_id:
        raise RuntimeError(
            "Missing Meta Cloud API credentials. Set META_WHATSAPP_TOKEN and META_WHATSAPP_PHONE_NUMBER_ID."
        )

    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": _normalize_meta_number(mobile),
        "type": "text",
        "text": {"preview_url": False, "body": message},
    }
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    data = response.json()

    if not response.ok:
        error_message = data.get("error", {}).get("message", "Unknown Meta API error")
        raise RuntimeError(f"Meta Cloud API send failed: {error_message}")

    message_id = data.get("messages", [{}])[0].get("id")
    if not message_id:
        raise RuntimeError("Meta Cloud API response missing message id.")

    return message_id


def _check_meta_health() -> str:
    try:
        import requests
    except ImportError as exc:
        raise RuntimeError("Missing 'requests' package. Install dependencies from requirement.txt.") from exc

    api_token = os.getenv("META_WHATSAPP_TOKEN")
    phone_number_id = os.getenv("META_WHATSAPP_PHONE_NUMBER_ID")
    api_version = os.getenv("META_WHATSAPP_API_VERSION", "v20.0")

    if not api_token or not phone_number_id:
        raise RuntimeError(
            "Missing Meta Cloud API credentials. Set META_WHATSAPP_TOKEN and META_WHATSAPP_PHONE_NUMBER_ID."
        )

    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}"
    headers = {"Authorization": f"Bearer {api_token}"}
    params = {"fields": "id,display_phone_number,verified_name"}

    response = requests.get(url, headers=headers, params=params, timeout=30)
    data = response.json()

    if not response.ok:
        error_message = data.get("error", {}).get("message", "Unknown Meta API error")
        raise RuntimeError(f"Meta Cloud API health check failed: {error_message}")

    display_phone = data.get("display_phone_number", "unknown")
    verified_name = data.get("verified_name", "unknown")
    return f"Meta OK (phone {display_phone}, name {verified_name})"


def _check_twilio_health() -> str:
    from twilio.rest import Client

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")

    if not account_sid or not auth_token or not whatsapp_from:
        raise RuntimeError(
            "Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM."
        )

    client = Client(account_sid, auth_token)
    account = client.api.accounts(account_sid).fetch()
    return f"Twilio OK (account status: {account.status})"


def _check_pywhatkit_health() -> str:
    try:
        import importlib.util

        module_spec = importlib.util.find_spec("pywhatkit")
        if module_spec is None:
            raise ImportError("pywhatkit not found")
    except ImportError as exc:
        raise RuntimeError("pywhatkit is not installed. Install dependencies from requirement.txt.") from exc
    return "pywhatkit OK (local browser automation mode)"


def _send_via_pywhatkit(mobile: str, message: str) -> str:
    import pywhatkit

    pywhatkit.sendwhatmsg_instantly(
        mobile,
        message,
        wait_time=15,
        tab_close=True,
        close_time=3,
    )
    return "pywhatkit-local"


def send_whatsapp_message(mobile: str, message: str) -> str:
    """Send via configured provider. Defaults to meta for automatic API sending."""
    provider = os.getenv("WHATSAPP_PROVIDER", "meta").strip().lower()

    if provider == "meta":
        return _send_via_meta_cloud_api(mobile, message)

    if provider == "twilio":
        return _send_via_twilio(mobile, message)
    if provider == "pywhatkit":
        return _send_via_pywhatkit(mobile, message)

    raise RuntimeError("Unsupported WHATSAPP_PROVIDER. Use 'meta', 'pywhatkit', or 'twilio'.")


def check_whatsapp_provider_health() -> str:
    provider = os.getenv("WHATSAPP_PROVIDER", "meta").strip().lower()

    if provider == "meta":
        return _check_meta_health()
    if provider == "twilio":
        return _check_twilio_health()
    if provider == "pywhatkit":
        return _check_pywhatkit_health()

    raise RuntimeError("Unsupported WHATSAPP_PROVIDER. Use 'meta', 'pywhatkit', or 'twilio'.")

import argparse
import json
from dataclasses import dataclass
from datetime import date, datetime, timezone
from tkinter.font import names
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

CAMPAI_BASE_URL = "https://api.campai.com"
CAMPAI_CONTACTS_ENDPOINT = "/contacts"
CAMPAI_CONTACTS_PARAMS = {
    "mode": "query",
    "sort": "createdAt",
    "limit": 100,
    "organisation": "64e88fabfb6cef3375134031",
}


@dataclass(frozen=True)
class Member:
    id: str | None
    name: str
    age: int | None
    gender: str | None
    joined_at: date | None
    leave_at: date | None
    active: bool


def fetch_campai_members(api_key, timeout=10):
    """
    Fetch ALL members from Campai using pagination (skip).

    :param api_key: Campai API key
    :param timeout: Request timeout in seconds
    :return: Combined response JSON (list of all records)
    """

    base_url = CAMPAI_BASE_URL.rstrip("/") + "/" + CAMPAI_CONTACTS_ENDPOINT.lstrip("/")

    headers = {
        "Authorization": api_key,
        "Accept": "application/json",
    }

    all_records = []
    skip = 0
    limit = CAMPAI_CONTACTS_PARAMS.get("limit", 100)

    while True:
        params = CAMPAI_CONTACTS_PARAMS.copy()
        params["skip"] = skip

        query_string = urlencode(params)
        request_url = f"{base_url}?{query_string}"

        try:
            request = Request(request_url, headers=headers, method="GET")

            with urlopen(request, timeout=timeout) as response:
                body = response.read().decode("utf-8")

            try:
                payload = json.loads(body)
            except json.JSONDecodeError:
                print("Response is not valid JSON.")
                break

            records = _extract_records(payload)

            if not records:
                break

            all_records.extend(records)

            print(f"Fetched {len(records)} records (skip={skip})")

            # Stop when fewer than limit are returned
            if len(records) < limit:
                break

            skip += limit

        except HTTPError as http_err:
            body = http_err.read().decode("utf-8", errors="replace")
            print(f"HTTP error: {http_err} - Response: {body}")
            break
        except URLError as err:
            print(f"Request failed: {err}")
            break
        except TimeoutError:
            print("Request timed out.")
            break

    return all_records


def _parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    if isinstance(value, (int, float)):
        if value > 10_000_000_000:
            value = value / 1000
        try:
            return datetime.fromtimestamp(value, tz=timezone.utc).date()
        except (OverflowError, OSError, ValueError):
            return None
    if isinstance(value, str):
        cleaned = value.strip()
        for parser in (
            lambda text: datetime.fromisoformat(text.replace("Z", "+00:00")).date(),
            lambda text: datetime.strptime(text, "%Y-%m-%d").date(),
            lambda text: datetime.strptime(text, "%d.%m.%Y").date(),
        ):
            try:
                return parser(cleaned)
            except ValueError:
                continue
    return None


def _get_personal(record):
    personal = record.get("personal")
    if isinstance(personal, list):
        for item in personal:
            if isinstance(item, dict):
                personal = item
                break
    return personal if isinstance(personal, dict) else {}


def _get_membership(record):
    membership = record.get("membership")
    if isinstance(membership, list):
        for item in membership:
            if isinstance(item, dict):
                membership = item
                break
    return membership if isinstance(membership, dict) else {}


def _extract_name(record):
    personal = _get_personal(record)

    full_name = " ".join(
        part
        for part in (
            str(personal.get("personFirstName") or "").strip(),
            str(personal.get("personLastName") or "").strip(),
        )
        if part
    ).strip()
    if full_name:
        return full_name

    combined = " ".join(
        part
        for part in (
            str(record.get("firstName") or "").strip(),
            str(record.get("lastName") or "").strip(),
        )
        if part
    ).strip()
    if combined:
        return combined

    return str(record.get("id") or record.get("_id") or "Unknown")


def _extract_age(record):
    personal = _get_personal(record)

    for key in ("personAge", "age", "years", "memberAge"):
        value = personal.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str) and value.isdigit():
            return int(value)

    for key in ("age", "years", "memberAge"):
        value = record.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str) and value.isdigit():
            return int(value)

    birth_value = None
    for key in ("personBirthday", "birthDate", "birthday", "dateOfBirth", "birthdate"):
        birth_value = personal.get(key)
        if birth_value:
            break
    if birth_value is None:
        for key in ("birthDate", "birthday", "dateOfBirth", "birthdate"):
            birth_value = record.get(key)
            if birth_value:
                break

    if birth_value is None:
        birth_year = personal.get("personYearOfBirth")
        if isinstance(birth_year, int):
            birth_value = f"{birth_year}-01-01"
        elif isinstance(birth_year, str) and birth_year.isdigit():
            birth_value = f"{birth_year}-01-01"

    birth_date = _parse_date(birth_value)
    if birth_date is None:
        return None

    today = date.today()
    return (
        today.year
        - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )


def _extract_gender(record):
    personal = _get_personal(record)

    for key in ("salutation", "gender", "sex", "geschlecht"):
        value = personal.get(key)
        if value:
            return str(value)

    for key in ("gender", "sex", "geschlecht"):
        value = record.get(key)
        if value:
            return str(value)
    return None


def _extract_joined_at(record):
    membership = _get_membership(record)

    joined_at = _parse_date(membership.get("enterDate"))
    if joined_at:
        return joined_at

    return None


def _extract_leave_at(record):
    membership = _get_membership(record)

    leave_at = _parse_date(membership.get("leaveDate"))
    if leave_at:
        return leave_at

    return None


def _is_active(record):
    membership = _get_membership(record)

    status = membership.get("status")
    if isinstance(status, str):
        normalized = status.strip().lower()
        if normalized in {"active", "enabled", "member"}:
            return True
        if normalized in {"inactive", "disabled", "archived", "left", "terminated"}:
            return False

    if membership.get("enterDate") is None:
        return False

    for key in ("leaveDate", "terminationDate", "previousLeaveDate"):
        if membership.get(key):
            return False

    for key in ("active", "isActive", "enabled"):
        value = record.get(key)
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"true", "1", "yes", "active"}:
                return True
            if normalized in {"false", "0", "no", "inactive"}:
                return False

    status = record.get("status")
    if isinstance(status, str):
        normalized = status.strip().lower()
        if normalized in {"active", "enabled", "member"}:
            return True
        if normalized in {"inactive", "disabled", "archived"}:
            return False

    return True


def _extract_records(payload):
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        for key in ("data", "contacts", "results", "items", "members"):
            value = payload.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]
        nested = payload.get("data")
        if isinstance(nested, dict):
            for key in ("contacts", "results", "items", "members"):
                value = nested.get(key)
                if isinstance(value, list):
                    return [item for item in value if isinstance(item, dict)]
        for value in payload.values():
            if (
                isinstance(value, list)
                and value
                and all(isinstance(item, dict) for item in value)
            ):
                return value
    return []


def build_members(payload):
    members = []
    for record in _extract_records(payload):
        if not isinstance(record, dict):
            continue
        member = Member(
            id=str(record.get("id") or record.get("_id"))
            if record.get("id") or record.get("_id")
            else None,
            name=_extract_name(record),
            age=_extract_age(record),
            gender=_extract_gender(record),
            joined_at=_extract_joined_at(record),
            leave_at=_extract_leave_at(record),
            active=_is_active(record),
        )
        members.append(member)
    return members


def main():
    parser = argparse.ArgumentParser(
        description="Fetch Campai members from the contacts query"
    )

    parser.add_argument("--api-key", required=True, help="API key")

    args = parser.parse_args()

    result = fetch_campai_members(api_key=args.api_key)

    if result is not None:
        members = build_members(result)
        active_count = sum(1 for member in members if member.active)
        print(
            json.dumps([member.__dict__ for member in members], indent=4, default=str)
        )
        print(f"Active members: {active_count}")


if __name__ == "__main__":
    main()

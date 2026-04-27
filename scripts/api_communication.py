import argparse
import json
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

CAMPAI_BASE_URL = "https://api.campai.com"
CAMPAI_CONTACTS_ENDPOINT = "/contacts"
CAMPAI_CASH_ACCOUNTS_ENDPOINT = "/cashAccounts"
CAMPAI_CASH_ACCOUNT_TRANSACTIONS_ENDPOINT = "/cashAccountTransactions"
DEFAULT_ORGANISATION_ID = "64e88fabfb6cef3375134031"
CAMPAI_CONTACTS_PARAMS = {
    "mode": "query",
    "sort": "createdAt",
    "limit": 100,
    "organisation": DEFAULT_ORGANISATION_ID,
}

CAMPAI_CASH_ACCOUNTS_PARAMS = {
    "mode": "query",
    "sort": "createdAt",
    "limit": 100,
    "organisation": DEFAULT_ORGANISATION_ID,
}

CAMPAI_CASH_ACCOUNT_TRANSACTIONS_PARAMS = {
    "mode": "query",
    "sort": "-date",
    "limit": 100,
    "organisation": DEFAULT_ORGANISATION_ID,
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


@dataclass(frozen=True)
class Movement:
    id: str | None
    date: date | None
    text: str
    amount: float
    direction: str
    raw: dict[str, Any]


def _campai_paginated_get(
    *,
    endpoint: str,
    api_key: str,
    base_params: dict[str, Any],
    timeout: int = 10,
) -> list[dict[str, Any]]:
    base_url = CAMPAI_BASE_URL.rstrip("/") + "/" + endpoint.lstrip("/")
    headers = {
        "Authorization": api_key,
        "Accept": "application/json",
    }

    all_records: list[dict[str, Any]] = []
    skip = 0
    limit = int(base_params.get("limit", 100))

    while True:
        params = dict(base_params)
        params["skip"] = skip

        request_url = f"{base_url}?{urlencode(params)}"
        try:
            request = Request(request_url, headers=headers, method="GET")
            with urlopen(request, timeout=timeout) as response:
                body = response.read().decode("utf-8")

            payload = json.loads(body)
            records = _extract_records(payload)
            if not records:
                break

            all_records.extend(records)
            print(f"Fetched {len(records)} records from {endpoint} (skip={skip})")

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
        except json.JSONDecodeError:
            print("Response is not valid JSON.")
            break

    return all_records


def fetch_campai_members(api_key, timeout=10):
    """
    Fetch ALL members from Campai using pagination (skip).

    :param api_key: Campai API key
    :param timeout: Request timeout in seconds
    :return: Combined response JSON (list of all records)
    """

    return _campai_paginated_get(
        endpoint=CAMPAI_CONTACTS_ENDPOINT,
        api_key=api_key,
        base_params=CAMPAI_CONTACTS_PARAMS,
        timeout=timeout,
    )


def fetch_campai_cash_accounts(
    api_key: str,
    organisation_id: str = DEFAULT_ORGANISATION_ID,
    timeout: int = 10,
) -> list[dict[str, Any]]:
    params = dict(CAMPAI_CASH_ACCOUNTS_PARAMS)
    params["organisation"] = organisation_id
    return _campai_paginated_get(
        endpoint=CAMPAI_CASH_ACCOUNTS_ENDPOINT,
        api_key=api_key,
        base_params=params,
        timeout=timeout,
    )


def fetch_campai_cash_account_transactions(
    api_key: str,
    organisation_id: str = DEFAULT_ORGANISATION_ID,
    timeout: int = 10,
    cash_account_id: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
) -> list[dict[str, Any]]:
    params = dict(CAMPAI_CASH_ACCOUNT_TRANSACTIONS_PARAMS)
    params["organisation"] = organisation_id
    if cash_account_id:
        params["cashAccount"] = cash_account_id
    if from_date and to_date:
        params["date"] = f"gte_lte:{from_date.isoformat()};{to_date.isoformat()}"
    return _campai_paginated_get(
        endpoint=CAMPAI_CASH_ACCOUNT_TRANSACTIONS_ENDPOINT,
        api_key=api_key,
        base_params=params,
        timeout=timeout,
    )


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


def _parse_number(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return None
        text = text.replace("€", "").replace("EUR", "").replace("eur", "")
        text = text.replace(" ", "")
        if "," in text and "." in text:
            text = text.replace(".", "").replace(",", ".")
        elif "," in text:
            text = text.replace(",", ".")
        try:
            return float(text)
        except ValueError:
            return None
    return None


def _pick_first_number(data: dict[str, Any], keys: list[str]) -> float | None:
    for key in keys:
        if key in data:
            parsed = _parse_number(data.get(key))
            if parsed is not None:
                return parsed
    return None


def _flatten_text_fields(entry: dict[str, Any]) -> str:
    text_parts = []
    for key in (
        "text",
        "description",
        "reference",
        "details",
        "purpose",
        "note",
        "invoiceNumber",
        "bookingText",
        "name",
        "title",
        "type",
    ):
        value = entry.get(key)
        if isinstance(value, str) and value.strip():
            text_parts.append(value.strip())

    source = entry.get("source")
    if isinstance(source, dict):
        for key in ("name", "bankName"):
            value = source.get(key)
            if isinstance(value, str) and value.strip():
                text_parts.append(value.strip())

    return " | ".join(text_parts)


def _classify_direction(entry: dict[str, Any], amount: float) -> str:
    for key in ("direction", "flow", "bookingType", "kind", "type"):
        value = entry.get(key)
        if not isinstance(value, str):
            continue
        normalized = value.strip().lower()
        if normalized in {
            "income",
            "in",
            "credit",
            "revenue",
            "deposit",
            "incoming",
            "einzahlung",
            "eingang",
            "inflow",
        }:
            return "income"
        if normalized in {
            "outgoing",
            "out",
            "debit",
            "expense",
            "withdrawal",
            "payment",
            "auszahlung",
            "ausgang",
            "outflow",
        }:
            return "outgoing"
    return "income" if amount >= 0 else "outgoing"


def _extract_movement_amount(entry: dict[str, Any]) -> float | None:
    direct_amount = _pick_first_number(
        entry,
        [
            "amount",
            "grossAmount",
            "netAmount",
            "total",
            "value",
            "sum",
        ],
    )
    if direct_amount is not None:
        return direct_amount

    positions = entry.get("positions")
    if isinstance(positions, list):
        values = []
        for item in positions:
            if not isinstance(item, dict):
                continue
            parsed = _pick_first_number(
                item,
                ["amount", "grossAmount", "netAmount", "value", "sum"],
            )
            if parsed is not None:
                values.append(parsed)

        if values:
            signed_sum = sum(values)
            if abs(signed_sum) > 1e-9:
                return signed_sum
            # When positions cancel out (double-entry), fall back to strongest leg.
            return max(values, key=lambda number: abs(number))

    return None


def normalize_movements(transactions: list[dict[str, Any]]) -> list[Movement]:
    movements: list[Movement] = []
    for entry in transactions:
        if not isinstance(entry, dict):
            continue

        amount = _extract_movement_amount(entry)
        if amount is None or abs(amount) < 1e-9:
            continue

        movement_date = _parse_date(entry.get("date") or entry.get("valueDate"))
        movement = Movement(
            id=str(entry.get("id") or entry.get("_id"))
            if entry.get("id") or entry.get("_id")
            else None,
            date=movement_date,
            text=_flatten_text_fields(entry) or "Unbenannte Buchung",
            amount=abs(float(amount)),
            direction=_classify_direction(entry, float(amount)),
            raw=entry,
        )
        movements.append(movement)
    return movements


def _income_category(text: str) -> str:
    normalized = text.lower()

    if any(token in normalized for token in ("spende", "donation", "zuwendung")):
        return "Spenden"

    if any(token in normalized for token in ("mitgliedsbeitrag", "beitrag", "membership")):
        return "Mitgliedsbeitraege"

    if any(
        token in normalized
        for token in (
            "event",
            "veranstaltung",
            "schneeball",
            "konzert",
            "fest",
            "ferienprogramm",
            "aktion",
            "ball",
            "ticket",
            "eintritt",
        )
    ):
        return "Veranstaltungen"

    return "Sonstiges"


def _expense_category(text: str) -> str:
    normalized = text.lower()

    if any(
        token in normalized
        for token in (
            "event",
            "veranstaltung",
            "schneeball",
            "konzert",
            "fest",
            "ferienprogramm",
            "aktion",
            "ball",
            "technik",
            "catering",
        )
    ):
        return "Veranstaltungen"

    if any(
        token in normalized
        for token in (
            "unterstuetz",
            "unterstutz",
            "hilfe",
            "foerder",
            "spende an",
            "zuschuss",
            "sozial",
            "ukraine",
            "familie",
        )
    ):
        return "Unterstuetzung"

    if any(
        token in normalized
        for token in (
            "verwaltung",
            "bankgeb",
            "kontof",
            "gebuehr",
            "gebuhr",
            "steuer",
            "versicherung",
            "beitrag verband",
            "software",
            "lizenz",
            "domain",
            "hosting",
            "buero",
            "porto",
            "druck",
        )
    ):
        return "Vereinsverwaltung"

    return "Vereinsverwaltung"


def _extract_cash_account_id(transaction: dict[str, Any]) -> str | None:
    direct_id = transaction.get("cashAccountId") or transaction.get("accountId")
    if isinstance(direct_id, str) and direct_id.strip():
        return direct_id.strip()

    cash_account = transaction.get("cashAccount")
    if isinstance(cash_account, str) and cash_account.strip():
        return cash_account.strip()
    if isinstance(cash_account, dict):
        candidate = cash_account.get("id") or cash_account.get("_id")
        if isinstance(candidate, str) and candidate.strip():
            return candidate.strip()
    return None


def _extract_account_name(account: dict[str, Any]) -> str:
    for key in ("name", "title", "cashAccountNumber"):
        value = account.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    candidate_id = account.get("id") or account.get("_id")
    return str(candidate_id) if candidate_id else "Unknown account"


def _match_account(account_name: str, target: str) -> bool:
    normalized = account_name.strip().lower()
    target_normalized = target.strip().lower()
    if normalized == target_normalized:
        return True
    if target == "Kasse":
        return "kasse" in normalized or normalized == "cash"
    if target == "Bank (liquide)":
        return "bank" in normalized and ("liquide" in normalized or "liquid" in normalized)
    if target == "Bank (Anlage)":
        return "anlage" in normalized
    return False


def _account_bucket(account: dict[str, Any]) -> str | None:
    name = _extract_account_name(account).lower()
    account_type = str(account.get("type") or "").lower()
    account_number = str(account.get("cashAccountNumber") or "").strip()

    if "kasse" in name or account_type == "cash":
        return "Kasse"

    if any(token in name for token in ("kuendigung", "kündigung", "anlage", "festgeld", "geschaeftsanteile", "geschäftsanteile")):
        return "Bank (Anlage)"

    if account_number in {"950", "955"}:
        return "Bank (Anlage)"

    if "bank" in account_type or account_number in {"940", "945"}:
        return "Bank (liquide)"

    return None


def _extract_balance(entry: dict[str, Any]) -> float | None:
    for key in ("balance", "accountBalance", "runningBalance", "newBalance"):
        parsed = _parse_number(entry.get(key))
        if parsed is not None:
            return parsed

    transaction = entry.get("transaction")
    if isinstance(transaction, dict):
        for key in ("balance", "accountBalance", "runningBalance", "newBalance"):
            parsed = _parse_number(transaction.get(key))
            if parsed is not None:
                return parsed
    return None


def build_account_report(
    *,
    cash_accounts: list[dict[str, Any]],
    transactions: list[dict[str, Any]],
    reference_date: date,
) -> dict[str, Any]:
    movements = normalize_movements(transactions)
    transaction_by_id = {
        str(item.get("id") or item.get("_id")): item
        for item in transactions
        if isinstance(item, dict) and (item.get("id") or item.get("_id"))
    }
    founding_date = min((movement.date for movement in movements if movement.date), default=None)

    incomes = sorted(
        [movement for movement in movements if movement.direction == "income"],
        key=lambda movement: movement.amount,
        reverse=True,
    )
    outgoings = sorted(
        [movement for movement in movements if movement.direction == "outgoing"],
        key=lambda movement: movement.amount,
        reverse=True,
    )

    top_incomes = [
        {
            "date": movement.date.isoformat() if movement.date else None,
            "text": movement.text,
            "amount": round(movement.amount, 2),
        }
        for movement in incomes[:5]
    ]
    top_outgoings = [
        {
            "date": movement.date.isoformat() if movement.date else None,
            "text": movement.text,
            "amount": round(movement.amount, 2),
        }
        for movement in outgoings[:5]
    ]

    expense_breakdown_since_founding = {
        "Vereinsverwaltung": 0.0,
        "Unterstuetzung": 0.0,
        "Veranstaltungen": 0.0,
    }
    income_breakdown_since_founding = {
        "Spenden": 0.0,
        "Veranstaltungen": 0.0,
        "Mitgliedsbeitraege": 0.0,
        "Sonstiges": 0.0,
    }

    total_income_since_founding = 0.0
    total_expenses_since_founding = 0.0

    for movement in movements:
        if movement.direction == "income":
            income_key = _income_category(movement.text)
            income_breakdown_since_founding[income_key] += movement.amount
            total_income_since_founding += movement.amount
        else:
            spending_key = _expense_category(movement.text)
            expense_breakdown_since_founding[spending_key] += movement.amount
            total_expenses_since_founding += movement.amount

    one_year_ago = reference_date - timedelta(days=365)

    top_expenses_last_year = [
        {
            "date": movement.date.isoformat() if movement.date else None,
            "text": movement.text,
            "amount": round(movement.amount, 2),
        }
        for movement in outgoings
        if movement.date and one_year_ago <= movement.date <= reference_date
    ][:3]

    top_income_last_year = [
        {
            "date": movement.date.isoformat() if movement.date else None,
            "text": movement.text,
            "amount": round(movement.amount, 2),
        }
        for movement in incomes
        if movement.date and one_year_ago <= movement.date <= reference_date
    ][:3]

    current_total_balance = sum(
        _parse_number(account.get("balance")) or 0.0
        for account in cash_accounts
        if isinstance(account, dict)
    )

    signed_movements: list[tuple[date, float, str | None]] = []
    for movement in movements:
        if movement.date is None or movement.id is None:
            continue
        raw_transaction = transaction_by_id.get(movement.id)
        cash_account_id = _extract_cash_account_id(raw_transaction) if raw_transaction else None
        signed_amount = movement.amount if movement.direction == "income" else -movement.amount
        signed_movements.append((movement.date, signed_amount, cash_account_id))

    total_one_year_ago = current_total_balance - sum(
        amount for movement_date, amount, _ in signed_movements if movement_date > one_year_ago
    )

    account_snapshots: dict[str, dict[str, float | str | None]] = {}
    for account in cash_accounts:
        if not isinstance(account, dict):
            continue
        account_id = str(account.get("id") or account.get("_id") or "")
        if not account_id:
            continue
        account_name = _extract_account_name(account)
        balance_today = _parse_number(account.get("balance")) or 0.0
        balance_one_year_ago = balance_today - sum(
            amount
            for movement_date, amount, movement_account_id in signed_movements
            if movement_account_id == account_id and movement_date > one_year_ago
        )
        account_snapshots[account_name] = {
            "one_year_ago": round(balance_one_year_ago, 2),
            "today": round(balance_today, 2),
            "difference": round(balance_today - balance_one_year_ago, 2),
        }

    bucketed_accounts = {
        "Kasse": {"one_year_ago": 0.0, "today": 0.0, "difference": 0.0, "matched": 0},
        "Bank (liquide)": {"one_year_ago": 0.0, "today": 0.0, "difference": 0.0, "matched": 0},
        "Bank (Anlage)": {"one_year_ago": 0.0, "today": 0.0, "difference": 0.0, "matched": 0},
    }
    for account in cash_accounts:
        if not isinstance(account, dict):
            continue
        bucket = _account_bucket(account)
        if not bucket:
            continue
        account_name = _extract_account_name(account)
        snapshot = account_snapshots.get(account_name)
        if not snapshot:
            continue
        bucketed_accounts[bucket]["one_year_ago"] += float(snapshot["one_year_ago"])
        bucketed_accounts[bucket]["today"] += float(snapshot["today"])
        bucketed_accounts[bucket]["difference"] += float(snapshot["difference"])
        bucketed_accounts[bucket]["matched"] += 1

    requested_account_data: dict[str, dict[str, float | str | None]] = {}
    for target_name in ("Kasse", "Bank (liquide)", "Bank (Anlage)"):
        matched_account = next(
            (
                value
                for account_name, value in account_snapshots.items()
                if _match_account(account_name, target_name)
            ),
            None,
        )
        if matched_account:
            requested_account_data[target_name] = matched_account
            continue

        bucket = bucketed_accounts.get(target_name)
        if bucket and bucket["matched"] > 0:
            requested_account_data[target_name] = {
                "one_year_ago": round(float(bucket["one_year_ago"]), 2),
                "today": round(float(bucket["today"]), 2),
                "difference": round(float(bucket["difference"]), 2),
                "derived_from_accounts": int(bucket["matched"]),
            }
            continue

        requested_account_data[target_name] = {
            "one_year_ago": None,
            "today": None,
            "difference": None,
        }

    total_difference_since_founding = total_income_since_founding - total_expenses_since_founding
    total_balance_difference = current_total_balance - total_one_year_ago

    return {
        "reference_date": reference_date.isoformat(),
        "founding_date": founding_date.isoformat() if founding_date else None,
        "expenses_since_founding": {
            key: round(value, 2) for key, value in expense_breakdown_since_founding.items()
        },
        "income_since_founding": {
            key: round(value, 2) for key, value in income_breakdown_since_founding.items()
        },
        "totals_since_founding": {
            "expenses": round(total_expenses_since_founding, 2),
            "income": round(total_income_since_founding, 2),
            "difference": round(total_difference_since_founding, 2),
        },
        "top_3_expenses_last_year": top_expenses_last_year,
        "top_3_income_last_year": top_income_last_year,
        "total_money_comparison": {
            "one_year_ago": round(total_one_year_ago, 2),
            "today": round(current_total_balance, 2),
            "difference": round(total_balance_difference, 2),
        },
        "requested_accounts": requested_account_data,
        "top_5_income_movements": top_incomes,
        "top_5_outgoing_movements": top_outgoings,
        "meta": {
            "cash_accounts_total": len(cash_accounts),
            "transactions_total": len(transactions),
            "movements_total": len(movements),
        },
    }


def main():
    parser = argparse.ArgumentParser(
        description="Campai data helper: fetch members or generate account movement reports."
    )

    parser.add_argument("--api-key", required=True, help="API key")
    parser.add_argument(
        "--report",
        choices=("members", "accounts"),
        default="members",
        help="Which report to generate. Defaults to members.",
    )
    parser.add_argument(
        "--organisation",
        default=DEFAULT_ORGANISATION_ID,
        help="Organisation ID for Campai queries.",
    )
    parser.add_argument(
        "--cash-account-id",
        default=None,
        help="Optional cash account ID to filter transactions.",
    )
    parser.add_argument(
        "--reference-date",
        default=None,
        help="Optional reference date (YYYY-MM-DD) for yearly comparisons. Defaults to today.",
    )
    parser.add_argument(
        "--output-json",
        default=None,
        help="Optional file path to write the resulting report JSON.",
    )

    args = parser.parse_args()

    if args.report == "members":
        result = fetch_campai_members(api_key=args.api_key)

        if result is not None:
            members = build_members(result)
            active_count = sum(1 for member in members if member.active)
            print(
                json.dumps(
                    [member.__dict__ for member in members], indent=4, default=str
                )
            )
            print(f"Active members: {active_count}")
        return

    reference_date = (
        datetime.strptime(args.reference_date, "%Y-%m-%d").date()
        if args.reference_date
        else date.today()
    )

    cash_accounts = fetch_campai_cash_accounts(
        api_key=args.api_key,
        organisation_id=args.organisation,
    )

    transactions = fetch_campai_cash_account_transactions(
        api_key=args.api_key,
        organisation_id=args.organisation,
        cash_account_id=args.cash_account_id,
    )
    report = build_account_report(
        cash_accounts=cash_accounts,
        transactions=transactions,
        reference_date=reference_date,
    )

    print("\n=== Finance Report ===")
    print("Founding date:", report["founding_date"] or "unknown")

    print("\nExpenses since founding:")
    for key, value in report["expenses_since_founding"].items():
        print(f"- {key}: {value:.2f}")

    print("\nIncome since founding:")
    for key, value in report["income_since_founding"].items():
        print(f"- {key}: {value:.2f}")

    totals = report["totals_since_founding"]
    print("\nTotals since founding:")
    print(
        f"Expenses: {totals['expenses']:.2f} | Income: {totals['income']:.2f} | Difference: {totals['difference']:.2f}"
    )

    print("\nTop 3 expenses last year:")
    for idx, movement in enumerate(report["top_3_expenses_last_year"], start=1):
        print(
            f"{idx}. {movement['date'] or '-'} | {movement['amount']:.2f} | {movement['text']}"
        )

    print("\nTop 3 income last year:")
    for idx, movement in enumerate(report["top_3_income_last_year"], start=1):
        print(
            f"{idx}. {movement['date'] or '-'} | {movement['amount']:.2f} | {movement['text']}"
        )

    balance = report["total_money_comparison"]
    print("\nTotal money comparison (today vs one year ago):")
    print(
        f"One year ago: {balance['one_year_ago']:.2f} | Today: {balance['today']:.2f} | Diff: {balance['difference']:.2f}"
    )

    print("\nRequested account snapshots:")
    for account_name, data in report["requested_accounts"].items():
        if data["today"] is None:
            print(f"- {account_name}: not found")
            continue
        print(
            f"- {account_name}: one year ago {data['one_year_ago']:.2f}, today {data['today']:.2f}, diff {data['difference']:.2f}"
        )

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as output_file:
            json.dump(report, output_file, indent=2, ensure_ascii=False)
        print(f"\nWrote {args.output_json}")


if __name__ == "__main__":
    main()

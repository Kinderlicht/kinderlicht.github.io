import argparse
import json
import requests
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

CAMPAI_BASE_URL = "https://api.campai.com"
CAMPAI_CLOUD_BASE_URL = "https://cloud.campai.com"
CAMPAI_CONTACTS_ENDPOINT = "/contacts"
DEFAULT_ORGANISATION_ID = "64e88fabfb6cef3375134031"
DEFAULT_WORKSPACE_ID = "676d50cf06301b8eb8007669"
CAMPAI_FINANCE_ACCOUNTS_ENDPOINT = f"{CAMPAI_CLOUD_BASE_URL}/api/{DEFAULT_ORGANISATION_ID}/{DEFAULT_WORKSPACE_ID}/finance/cash/accounts/list"
CAMPAI_FINANCE_TRANSACTIONS_ENDPOINT = f"{CAMPAI_CLOUD_BASE_URL}/api/{DEFAULT_ORGANISATION_ID}/{DEFAULT_WORKSPACE_ID}/finance/cash/transactions/list"
CAMPAI_CONTACTS_PARAMS = {
    "mode": "query",
    "sort": "createdAt",
    "limit": 100,
    "organisation": DEFAULT_ORGANISATION_ID,
}

CAMPAI_FINANCE_ACCOUNTS_PARAMS = {
    "mode": "query",
    "sort": "createdAt",
    "limit": 100,
    "organisation": DEFAULT_ORGANISATION_ID,
}
FORBIDDEN_TOKENS = {"umbuchung", "intern", "enrico", "koch", "payment", "teilkündigung", "kündigung"}


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
    id: str
    date: date | None
    text: str
    amount: float
    direction: str
    cash_account: str | None
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


def fetch_from_finance_api(
    finance_api_key: str,
    key: str,
    url: str,
    timeout: int = 10,
    limit: int = 100,
    offset: int = 0,
) -> list[dict[str, Any]]:
    """
    Fetch cash transactions from the new Campai finance API using POST request.
    :param key: The key in the response JSON that contains the list of transactions (e.g. "transactions")
    :param finance_api_key: Campai Finance API key (separate from main API key)
    :param organisation_id: Organisation ID
    :param workspace_id: Workspace ID
    :param timeout: Request timeout in seconds
    :param limit: Number of transactions to fetch per request
    :param offset: Offset for pagination
    :return: List of cash transactions from response
    """
    headers = {
        "X-API-Key": finance_api_key,
        "Content-Type": "application/json",
    }

    items = []
    try:
        while True:
            payload = {
                "sort": {},
                "limit": limit,
                "offset": offset,
            }
            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=timeout,
            )
            response.raise_for_status()
            data = response.json()
            items.extend(data.get(key, []))
            print(f"Fetched {len(items)} {key} from finance API")
            offset += limit
            if len(data.get(key, [])) < limit:
                break
        return items
    except requests.exceptions.RequestException as err:
        print(f"Finance API request failed: {err}")
        return []


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


def _extract_cash_account_id(record: dict[str, Any]) -> str | None:
    # For account records, prefer the MongoDB _id because that is the stable key.
    object_id = record.get("_id")
    if object_id not in (None, ""):
        return str(object_id)

    # Then try nested _id in various account-related fields.
    for key in (
        "cashAccount",
        "cashAccountId",
        "cash_account",
        "account",
        "accountId",
    ):
        value = record.get(key)
        if isinstance(value, dict):
            nested_value = value.get("_id")
            if nested_value not in (None, ""):
                return str(nested_value)
        elif value not in (None, ""):
            return str(value)
    return None


def _extract_movement_cash_account_id(record: dict[str, Any]) -> str | None:
    # For movements, prefer the linked cash-account field, not the transaction _id.
    for key in (
        "cashAccount",
        "cashAccountId",
        "cash_account",
        "account",
        "accountId",
    ):
        value = record.get(key)
        if isinstance(value, dict):
            nested_value = value.get("_id") or value.get("id")
            if nested_value not in (None, ""):
                return str(nested_value)
        elif value not in (None, ""):
            return str(value)

    object_id = record.get("_id")
    if object_id not in (None, ""):
        return str(object_id)
    return None

def _extract_cash_account_name(record: dict[str, Any]) -> str | None:
    # Try multiple possible name fields
    for field in ("name", "displayName", "title", "accountName"):
        value = record.get(field)
        if value and isinstance(value, str) and value.strip():
            return value.strip()
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


def _flatten_text_fields(entry: dict[str, Any]) -> str:
    text_parts = []
    for key in (
        "purpose",
        "info",
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


def _classify_direction(amount: float) -> str:
    return "income" if amount >= 0 else "outgoing"


def _extract_movement_amount(entry: dict[str, Any]) -> float | None:
    return float(entry.get("amount"))


def normalize_movements(transactions: list[dict[str, Any]]) -> list[Movement]:
    movements: list[Movement] = []
    for entry in transactions:
        if not isinstance(entry, dict):
            continue

        amount = _extract_movement_amount(entry)
        if amount is None or abs(amount) < 1e-9:
            continue

        movement_date = _parse_date(entry.get("date"))
        movement = Movement(
            id=str(entry.get("_id") or entry.get("id") or entry.get("cashAccount") or ""),
            date=movement_date,
            text=_flatten_text_fields(entry) or "Unbenannte Buchung",
            amount=abs(float(amount) / 100),
            direction=_classify_direction(float(amount)),
            cash_account=_extract_movement_cash_account_id(entry),
            raw=entry,
        )
        movements.append(movement)
    return movements


def _income_category(text: str) -> str:
    normalized = text.lower()

    if any(token in normalized for token in ("spende", "donation", "zuwendung")):
        return "Spenden"

    if any(
        token in normalized
        for token in ("mitgliedsbeitrag", "jahresbeitrag", "membership")
    ):
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


def build_account_report(
    *,
    transactions: list[dict[str, Any]],
    cash_accounts: list[dict[str, Any]],
    reference_date: date,
) -> dict[str, Any]:
    movements = normalize_movements(transactions)
    founding_date = min(
        (movement.date for movement in movements if movement.date), default=None
    )
    one_year_ago = reference_date - timedelta(days=365)

    account_order: list[str] = []
    account_name_by_id: dict[str, str] = {}
    for account in cash_accounts:
        if not isinstance(account, dict):
            continue
        account_id = _extract_cash_account_id(account)
        if account_id is None:
            continue
        account_name = (
            _extract_cash_account_name(account)
            or account.get("displayName")
            or account.get("title")
            or str(account_id)
        )
        account_name_by_id[account_id] = account_name
        account_order.append(account_id)

    movements_by_account: dict[str, list[Movement]] = defaultdict(list)
    for movement in movements:
        if movement.cash_account:
            movements_by_account[movement.cash_account].append(movement)

    def signed_amount(movement: Movement) -> float | None:
        raw_amount = _parse_number(movement.raw.get("amount"))
        if raw_amount is None:
            return None
        return raw_amount / 100.0

    overall_income_since_founding: dict[str, float] = defaultdict(float)
    overall_expenses_since_founding: dict[str, float] = defaultdict(float)
    overall_income_total = 0.0
    overall_expense_total = 0.0
    top_income_last_year: list[dict[str, Any]] = []
    top_expenses_last_year: list[dict[str, Any]] = []

    for movement in movements:
        if movement.date is None or movement.date > reference_date:
            continue

        raw_amount = signed_amount(movement)
        if raw_amount is None:
            continue

        absolute_amount = abs(raw_amount)
        report_item = {
            "id": movement.id,
            "date": movement.date.isoformat() if movement.date else None,
            "text": movement.text,
            "amount": absolute_amount,
            "signed_amount": raw_amount,
            "direction": movement.direction,
            "cash_account": movement.cash_account,
            "cash_account_name": account_name_by_id.get(
                movement.cash_account or "", "Unbekanntes Konto"
            ),
        }

        if raw_amount >= 0:
            overall_income_total += absolute_amount
            overall_income_since_founding[_income_category(movement.text)] += absolute_amount
        else:
            overall_expense_total += absolute_amount
            overall_expenses_since_founding[_expense_category(movement.text)] += absolute_amount

        if movement.date >= one_year_ago:
            if raw_amount >= 0:
                top_income_last_year.append(report_item)
            else:
                top_expenses_last_year.append(report_item)

    def _sort_report_items(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return sorted(
            [i for i in items if all(forbidden not in str(i).lower() for forbidden in FORBIDDEN_TOKENS)],
            key=lambda item: abs(float(item.get("signed_amount", 0.0))),
            reverse=True,
        )[:3]

    requested_accounts: dict[str, dict[str, Any]] = {}
    total_today = 0.0
    total_one_year_ago = 0.0

    for account_id in account_order:
        account_movements = [
            movement
            for movement in movements_by_account.get(account_id, [])
            if movement.date is not None and movement.date <= reference_date
        ]

        if not account_movements:
            continue

        income_since_founding = 0.0
        expenses_since_founding = 0.0
        today_balance = 0.0
        one_year_ago_balance = 0.0
        recent_items: list[dict[str, Any]] = []

        for movement in account_movements:
            raw_amount = signed_amount(movement)
            if raw_amount is None:
                continue

            absolute_amount = abs(raw_amount)
            if raw_amount >= 0:
                income_since_founding += absolute_amount
            else:
                expenses_since_founding += absolute_amount

            if movement.date <= reference_date:
                today_balance += raw_amount
            if movement.date <= one_year_ago:
                one_year_ago_balance += raw_amount
            if one_year_ago <= movement.date <= reference_date:
                recent_items.append(
                    {
                        "id": movement.id,
                        "date": movement.date.isoformat(),
                        "text": movement.text,
                        "amount": absolute_amount,
                        "signed_amount": raw_amount,
                        "direction": movement.direction,
                        "cash_account": account_id,
                        "cash_account_name": account_name_by_id.get(account_id),
                    }
                )

        total_today += today_balance
        total_one_year_ago += one_year_ago_balance

        requested_accounts[account_id] = {
            "id": account_id,
            "name": account_name_by_id.get(account_id),
            "income_since_founding": income_since_founding,
            "expenses_since_founding": expenses_since_founding,
            "net_since_founding": income_since_founding - expenses_since_founding,
            "one_year_ago": one_year_ago_balance,
            "today": today_balance,
            "difference": today_balance - one_year_ago_balance,
            "top_movements_last_year": sorted(
                [i for i in recent_items if all(forbidden not in str(i).lower() for forbidden in FORBIDDEN_TOKENS)],
                key=lambda item: abs(float(item.get("signed_amount", 0.0))),
                reverse=True,
            )[:3],
        }

    top_3_income_last_year = _sort_report_items(top_income_last_year)
    top_3_expenses_last_year = _sort_report_items(top_expenses_last_year)

    return {
        "reference_date": reference_date.isoformat(),
        "founding_date": founding_date.isoformat() if founding_date else None,
        "cash_accounts": [
            {"id": account_id, "name": account_name_by_id.get(account_id)}
            for account_id in account_order
        ],
        "expenses_since_founding": dict(overall_expenses_since_founding),
        "income_since_founding": dict(overall_income_since_founding),
        "totals_since_founding": {
            "income": overall_income_total,
            "expenses": overall_expense_total,
            "difference": overall_income_total - overall_expense_total,
        },
        "top_3_expenses_last_year": top_3_expenses_last_year,
        "top_3_income_last_year": top_3_income_last_year,
        "total_money_comparison": {
            "one_year_ago": total_one_year_ago,
            "today": total_today,
            "difference": total_today - total_one_year_ago,
        },
        "requested_accounts": requested_accounts,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Campai data helper: fetch members or generate account movement reports."
    )
    parser.add_argument("--api-key", required=True, help="API key")
    parser.add_argument(
        "--finance-api-key",
        default=None,
        help="Separate Finance API key for accessing cash transactions. Required for accounts report.",
    )
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

    cash_accounts = fetch_from_finance_api(
        api_key=args.finance_api_key,
        organisation_id=args.organisation,
        url=CAMPAI_FINANCE_ACCOUNTS_ENDPOINT,
        key="cashAccounts",
    )

    if not cash_accounts:
        print(
            "Error: No cash accounts found. Please check your Finance API key and organisation ID."
        )
        return

    if not args.finance_api_key:
        print("Error: --finance-api-key is required for accounts report.")
        return

    transactions = fetch_from_finance_api(
        api_key=args.finance_api_key,
        organisation_id=args.organisation,
        url=CAMPAI_FINANCE_TRANSACTIONS_ENDPOINT,
        key="cashTransactions",
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

import argparse
import json
from dataclasses import dataclass
from datetime import date, datetime, timezone
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


def _movement_category(text: str, direction: str) -> str:
    normalized = text.lower()

    if any(token in normalized for token in ("zins", "interest")) and direction == "income":
        return "interest"

    if any(token in normalized for token in ("spende", "donation", "zuwendung")):
        return "donations"

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
        )
    ):
        return "events"

    return "other"


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

    income_breakdown = {"interest": 0.0, "donations": 0.0, "other": 0.0}
    spending_breakdown = {"events": 0.0, "donations": 0.0, "other": 0.0}

    for movement in movements:
        category = _movement_category(movement.text, movement.direction)
        if movement.direction == "income":
            income_key = category if category in income_breakdown else "other"
            income_breakdown[income_key] += movement.amount
        else:
            spending_key = category if category in spending_breakdown else "other"
            spending_breakdown[spending_key] += movement.amount

    previous_year = reference_date.year - 1
    previous_year_end = date(previous_year, 12, 31)

    current_total_balance = sum(
        _parse_number(account.get("balance")) or 0.0
        for account in cash_accounts
        if isinstance(account, dict)
    )

    balance_method = "current_balance_backcast"
    if cash_accounts:
        signed_movements: list[tuple[date, float]] = []
        for movement in movements:
            if movement.date is None:
                continue
            signed_amount = movement.amount if movement.direction == "income" else -movement.amount
            signed_movements.append((movement.date, signed_amount))

        reference_balance = current_total_balance - sum(
            amount for movement_date, amount in signed_movements if movement_date > reference_date
        )
        previous_balance = current_total_balance - sum(
            amount for movement_date, amount in signed_movements if movement_date > previous_year_end
        )
        current_balance = reference_balance
    else:
        balance_method = "net_flow_estimate"
        previous_balance = round(
            sum(
                movement.amount if movement.direction == "income" else -movement.amount
                for movement in movements
                if movement.date and movement.date.year == previous_year
            ),
            2,
        )
        current_balance = round(
            sum(
                movement.amount if movement.direction == "income" else -movement.amount
                for movement in movements
                if movement.date and movement.date.year == reference_date.year
            ),
            2,
        )

    return {
        "reference_date": reference_date.isoformat(),
        "top_5_income_movements": top_incomes,
        "top_5_outgoing_movements": top_outgoings,
        "bank_balance_comparison": {
            "method": balance_method,
            "last_year": round(previous_balance, 2),
            "this_year": round(current_balance, 2),
            "difference": round(current_balance - previous_balance, 2),
        },
        "income_sources": {
            key: round(value, 2) for key, value in income_breakdown.items()
        },
        "spending_targets": {
            key: round(value, 2) for key, value in spending_breakdown.items()
        },
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
    print("Top 5 income movements:")
    for idx, movement in enumerate(report["top_5_income_movements"], start=1):
        print(
            f"{idx}. {movement['date'] or '-'} | {movement['amount']:.2f} | {movement['text']}"
        )

    print("\nTop 5 outgoing movements:")
    for idx, movement in enumerate(report["top_5_outgoing_movements"], start=1):
        print(
            f"{idx}. {movement['date'] or '-'} | {movement['amount']:.2f} | {movement['text']}"
        )

    balance = report["bank_balance_comparison"]
    print("\nBank balance comparison:")
    print(
        f"Method: {balance['method']} | Last year: {balance['last_year']:.2f} | "
        f"This year: {balance['this_year']:.2f} | Diff: {balance['difference']:.2f}"
    )

    print("\nIncome sources:")
    for key, value in report["income_sources"].items():
        print(f"- {key}: {value:.2f}")

    print("\nSpending targets:")
    for key, value in report["spending_targets"].items():
        print(f"- {key}: {value:.2f}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as output_file:
            json.dump(report, output_file, indent=2, ensure_ascii=False)
        print(f"\nWrote {args.output_json}")


if __name__ == "__main__":
    main()

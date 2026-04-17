import csv
import io
import re
from datetime import date

import pandas as pd

from app.models.schemas import Transaction
from app.utils.categorizer import categorize


DATE_PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})")
AMOUNT_PATTERN = re.compile(r"(?:rs\.?|inr|₹)?\s*(-?\d+(?:,\d{3})*(?:\.\d{1,2})?)", re.IGNORECASE)


def _clean_amount(value) -> float:
    if pd.isna(value):
        return 0.0
    return float(str(value).replace(",", "").replace("₹", "").strip())


def _normalize_type(amount: float, raw_type: str | None = None) -> str:
    if raw_type and str(raw_type).lower() in {"income", "credit", "deposit"}:
        return "income"
    if amount < 0:
        return "expense"
    if raw_type and str(raw_type).lower() in {"expense", "debit", "withdrawal"}:
        return "expense"
    return "expense"


def dataframe_to_transactions(df: pd.DataFrame) -> list[Transaction]:
    df.columns = [str(column).strip().lower() for column in df.columns]
    transactions = []

    for _, row in df.iterrows():
        date_value = row.get("date") or row.get("transaction date") or row.get("txn date") or str(date.today())
        description = row.get("description") or row.get("narration") or row.get("details") or row.get("merchant") or "Transaction"
        raw_amount = row.get("amount")
        if raw_amount is None:
            debit = _clean_amount(row.get("debit", 0))
            credit = _clean_amount(row.get("credit", 0))
            raw_amount = credit if credit > 0 else -debit
        amount = _clean_amount(raw_amount)
        raw_type = row.get("type") or row.get("transaction type")
        transaction_type = _normalize_type(amount, raw_type)
        amount = abs(amount)
        category = row.get("category") or categorize(str(description), transaction_type)

        if amount == 0:
            continue

        transactions.append(
            Transaction(
                date=str(date_value),
                description=str(description),
                amount=amount,
                type=transaction_type,
                category=str(category),
            )
        )
    return transactions


def parse_csv_bytes(content: bytes) -> list[Transaction]:
    text = content.decode("utf-8-sig")
    sample = text[:2048]
    delimiter = csv.Sniffer().sniff(sample).delimiter if sample.strip() else ","
    df = pd.read_csv(io.StringIO(text), delimiter=delimiter)
    return dataframe_to_transactions(df)


def parse_pdf_bytes(content: bytes) -> list[Transaction]:
    import pdfplumber

    rows = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables() or []
            for table in tables:
                if len(table) < 2:
                    continue
                header = table[0]
                for row in table[1:]:
                    rows.append(dict(zip(header, row, strict=False)))
    if not rows:
        return []
    return dataframe_to_transactions(pd.DataFrame(rows))


def parse_text_to_transactions(text: str) -> list[Transaction]:
    transactions = []
    for line in [item.strip() for item in text.splitlines() if item.strip()]:
        parts = [part.strip() for part in line.split(",")]
        if len(parts) >= 3:
            date_value, description, amount_value = parts[:3]
            category = parts[3] if len(parts) > 3 else ""
            amount = _clean_amount(amount_value)
            transaction_type = "income" if amount > 0 and "salary" in description.lower() else "expense"
        else:
            date_match = DATE_PATTERN.search(line)
            amount_match = AMOUNT_PATTERN.search(line)
            if not amount_match:
                continue
            date_value = date_match.group(1) if date_match else str(date.today())
            amount = _clean_amount(amount_match.group(1))
            description = DATE_PATTERN.sub("", line).replace(amount_match.group(0), "").strip(" ,-")
            category = ""
            transaction_type = "income" if any(word in line.lower() for word in ["salary", "income", "earned", "credited"]) else "expense"

        transactions.append(
            Transaction(
                date=date_value,
                description=description or "Text transaction",
                amount=abs(amount),
                type=transaction_type,
                category=category or categorize(description, transaction_type),
            )
        )
    return transactions

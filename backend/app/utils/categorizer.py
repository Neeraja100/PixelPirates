from app.models.schemas import Transaction


CATEGORY_RULES = {
    "Food & Dining": ["swiggy", "zomato", "restaurant", "cafe", "food", "dining", "pizza", "coffee"],
    "Transport": ["uber", "ola", "metro", "fuel", "petrol", "diesel", "cab", "taxi", "bus"],
    "Shopping": ["amazon", "flipkart", "myntra", "shopping", "store", "mall"],
    "Entertainment": ["netflix", "spotify", "prime", "movie", "cinema", "hotstar", "game"],
    "Bills & Utilities": ["electricity", "wifi", "internet", "mobile", "bill", "utility", "recharge"],
    "Rent & Housing": ["rent", "maintenance", "housing", "flat"],
    "Health": ["pharmacy", "doctor", "hospital", "medicine", "clinic"],
    "Education": ["course", "tuition", "book", "college", "school", "udemy"],
    "Savings & Investments": ["sip", "mutual fund", "fd", "deposit", "investment", "savings"],
    "Income": ["salary", "stipend", "freelance", "income", "credited", "payroll"],
}

DISCRETIONARY_CATEGORIES = {"Food & Dining", "Shopping", "Entertainment"}


def categorize(description: str, transaction_type: str = "expense") -> str:
    if transaction_type == "income":
        return "Income"

    text = description.lower()
    for category, keywords in CATEGORY_RULES.items():
        if any(keyword in text for keyword in keywords):
            return category
    return "Other"


def normalize_transactions(transactions: list[Transaction]) -> list[Transaction]:
    normalized = []
    for transaction in transactions:
        category = transaction.category
        if not category or category == "Uncategorized":
            category = categorize(transaction.description, transaction.type)
        normalized.append(transaction.model_copy(update={"category": category}))
    return normalized

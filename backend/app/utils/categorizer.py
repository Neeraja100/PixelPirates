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


import os
import json
from openai import OpenAI
from app.models.schemas import Transaction


def normalize_transactions(transactions: list[Transaction]) -> list[Transaction]:
    normalized = []
    uncategorized = []
    
    for transaction in transactions:
        category = transaction.category
        if not category or category == "Uncategorized" or category == "Other":
            category = categorize(transaction.description, transaction.type)
        
        if category == "Other":
            uncategorized.append(transaction)
        else:
            normalized.append(transaction.model_copy(update={"category": category}))
            
    if uncategorized:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                client = OpenAI(api_key=api_key)
                
                # build a payload for batch
                payload = [
                    {"id": i, "desc": t.description} 
                    for i, t in enumerate(uncategorized) 
                ]
                
                prompt = (
                    "You are a transaction categorizer. Categorize the items into one of strictly these categories: "
                    f"{list(CATEGORY_RULES.keys())}. If completely unsure, use 'Other'. "
                    "Respond purely in JSON as a dictionary mapping 'id' to 'Category'. "
                    "Data: " + json.dumps(payload)
                )
                
                completion = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "system", "content": "You output JSON mapping ID to Category."}, {"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                result_map = json.loads(completion.choices[0].message.content)
                
                for i, t in enumerate(uncategorized):
                    cat = result_map.get(str(i), result_map.get(i, "Other"))
                    
                    # Validate category is actually allowed
                    if cat not in CATEGORY_RULES and cat != "Income":
                        cat = "Other"
                        
                    normalized.append(t.model_copy(update={"category": cat}))
                    
            except Exception:
                for t in uncategorized:
                    normalized.append(t.model_copy(update={"category": "Other"}))
        else:
            for t in uncategorized:
                normalized.append(t.model_copy(update={"category": "Other"}))
                
    return normalized

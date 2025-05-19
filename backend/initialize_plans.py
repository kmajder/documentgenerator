# init_plans.py
from extensions import mongo

DEFAULT_PLANS = [
    {
        "name": "free",
        "display_name": "Free",
        "max_documents_per_month": 10,
        "max_templates": 2,               
        "price": 0,
        "features": ["Basic PDF/Word export"],
        "is_free": True
    },
    {
        "name": "starter",
        "display_name": "Starter",
        "max_documents_per_month": 200,
        "max_templates": 10,              
        "price": 29,
        "features": ["Basic export", "Priority support"],
        "is_free": False
    },
    {
        "name": "pro",
        "display_name": "Pro Office",
        "max_documents_per_month": 600,
        "max_templates": 25,
        "price": 69,
        "features": ["All export formats", "Custom templates", "Team sharing"],
        "is_free": False
    },
    {
        "name": "unlimited",
        "display_name": "Unlimited",
        "max_documents_per_month": None,
        "max_templates": None,
        "price": 129,
        "features": ["Unlimited generation", "Team features", "Premium support"],
        "is_free": False
    }
]

def initialize_plans():
    existing = mongo.db.plans.count_documents({})
    if existing == 0:
        mongo.db.plans.insert_many(DEFAULT_PLANS)
        print("✅ Inserted default plans.")
    else:
        print("ℹ️ Plans already initialized.")

# models/user.py
class UserModel:
    def __init__(self, mongo_doc):
        self.id = str(mongo_doc["_id"])
        self.email = mongo_doc["email"]
        self.plan = mongo_doc.get("plan", "free")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "plan": self.plan
        }

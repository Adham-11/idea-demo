from sklearn.ensemble import IsolationForest
import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(f"mongodb+srv://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}?{os.getenv('DB_OPTIONS')}")
db = client[os.getenv('DB_NAME')]

def run_detection():
    try:
        projects = list(db.projects.find())

        def safe_len(x):
            return len(x) if isinstance(x, list) else 0

        df = pd.DataFrame(projects)

        df['min_investment'] = pd.to_numeric(df['min_investment'], errors='coerce')
        df['max_investment'] = pd.to_numeric(df['max_investment'], errors='coerce')
        df = df.dropna(subset=['min_investment', 'max_investment'])

        df['budget'] = df['max_investment'] - df['min_investment']
        df['team_size'] = df['team_members'].apply(safe_len)
        df['has_business_plan'] = df['business_plan'].apply(lambda x: 1 if x else 0)
        df['has_summary'] = df['exective_sunnary'].apply(lambda x: 1 if x else 0)
        df['market_desc_length'] = df['market_description'].apply(lambda x: len(x) if x else 0)
        df['objectives_length'] = df['business_objectives'].apply(lambda x: len(x) if x else 0)
        df['has_linkedin'] = df['team_members'].apply(
            lambda members: int(all(m.get('linkedin_account', '').startswith('https://') for m in members)) if isinstance(members, list) else 0
        )

        feature_df = df[[
            'budget', 'team_size', 'has_business_plan', 'has_summary',
            'market_desc_length', 'objectives_length', 'has_linkedin'
        ]].fillna(0)

        model = IsolationForest(contamination=0.05, random_state=42)
        model.fit(feature_df)

        preds = model.predict(feature_df)  # -1 = anomaly
        feature_df['fraud_flag'] = (preds == -1).astype(int)

        # Collect flagged projects
        flagged_projects = [
            {"project_id": str(proj['_id']), "project_name": proj.get('project_name', 'Unknown')}
            for i, proj in enumerate(projects) if preds[i] == -1
        ]

        # Update DB
        for i, proj in enumerate(projects):
            db.projects.update_one(
                {"_id": proj['_id']},
                {"$set": {"fraud_flag": int(preds[i] == -1)}}
            )

        count = feature_df['fraud_flag'].sum()
        return {
            "message": "Fraud detection completed.",
            "fraud_count": int(count),
            "flagged_projects": flagged_projects  # Add flagged projects
        }

    except Exception as e:
        return {"error": str(e)}
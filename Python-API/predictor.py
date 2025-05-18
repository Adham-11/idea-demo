import pandas as pd
from pymongo import MongoClient
from joblib import load
import os
from dotenv import load_dotenv
import traceback

load_dotenv()

# MongoDB credentials
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_OPTIONS = os.getenv("DB_OPTIONS")

MONGO_URI = f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}?{DB_OPTIONS}"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db['projects']

# MODEL_PATH = "./models/updated_big_startup_dataset_model.pkl"

def map_stage(stage):
    if stage in ['Series A', 'Series B', 'Series C', 'Series D', 'Growth']:
        return 'Growth'
    elif stage == 'Seed':
        return 'Seed'
    return 'Launch'

def predict_on_projects():
    try:
        models = {
            "big_model": load("./models/updated_big_startup_dataset_model.pkl"),
            "cleaned_model": load("./models/updated_cleaned_startup_dataset_model.pkl")
        }

        projects = list(collection.find({}))
        df = pd.DataFrame(projects)

        if df.empty:
            return {"error": "No project data available."}

        df['project_stage'] = df['project_stage'].apply(map_stage)

        # Schema-adapted fields
        df['industry'] = df['project_industry'] if 'project_industry' in df else 'Unknown'
        df['min_investment'] = pd.to_numeric(df.get('min_investment', 0), errors='coerce')
        df['max_investment'] = pd.to_numeric(df.get('max_investment', 0), errors='coerce')
        df['budget'] = df['max_investment'] - df['min_investment']
        df['duration'] = 12
        df['team_size'] = df.get('team_members', []).apply(lambda x: len(x) if isinstance(x, list) else 0)

        required_cols = ['project_stage', 'budget', 'duration', 'team_size', 'industry']
        df = df.dropna(subset=required_cols)

        predictions = []

        for model_name, (model, feature_cols) in models.items():
            input_df = pd.get_dummies(df[required_cols])
            input_df = input_df.reindex(columns=feature_cols, fill_value=0)

            preds = model.predict(input_df)
            probs = model.predict_proba(input_df)[:, 1]

            predictions.append({
            "model": model_name,
            "predictions": [{
                "project_id": str(project.get('_id')),
                "project_name": project.get('project_name', 'Unknown'),  # Add project_name
                "predicted_success": bool(preds[i]),
                "confidence": round(probs[i] * 100, 2)
            } for i, project in enumerate(projects)]
            })

        return predictions

    except Exception as e:
        print("❌ Prediction error:", traceback.format_exc())
        return {"error": traceback.format_exc()}

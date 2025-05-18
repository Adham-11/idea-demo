import os
import time
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

CSV_FOLDER = "./csv"
MODEL_FOLDER = "./models"
os.makedirs(MODEL_FOLDER, exist_ok=True)

def map_stage(stage):
    if stage in ['Series A', 'Series B', 'Series C', 'Series D', 'Growth']:
        return 'Growth'
    elif stage == 'Seed':
        return 'Seed'
    return 'Launch'

def train_model_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    df = df[df['status'].notnull() & df['project_stage'].notnull()]
    df['is_success'] = df['status'].apply(lambda x: 1 if str(x).lower() in ['success', 'acquired', 'operating'] else 0)
    df['project_stage'] = df['project_stage'].apply(map_stage)

    X = pd.get_dummies(df[['project_stage', 'budget', 'duration', 'team_size', 'industry']])
    y = df['is_success']
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)

    if X_train.empty or y_train.empty:
        print(f"⚠️ Skipping {csv_path} — no training data found after preprocessing.")
        return

    print(f"🔎 Training on {len(X_train)} samples, {len(X.columns)} features")

    start = time.time()
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    end = time.time()

    base_name = os.path.splitext(os.path.basename(csv_path))[0]
    model_path = f"{MODEL_FOLDER}/{base_name}_model.pkl"
    joblib.dump((model, list(X.columns)), model_path)

    print(f"✅ Model saved: {model_path}")
    print(f"⏱ Training time: {round(end - start, 2)} seconds")

def train_all_models():
    for file in os.listdir(CSV_FOLDER):
        if file.endswith('.csv'):
            train_model_from_csv(os.path.join(CSV_FOLDER, file))

if __name__ == "__main__":
    train_all_models()

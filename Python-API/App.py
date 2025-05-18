from flask import Flask, request, jsonify
# from flask_cors import CORS
from predictor import predict_on_projects
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Flask app init
app = Flask(__name__)
# CORS(app)

# MongoDB connection
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_OPTIONS = os.getenv("DB_OPTIONS")
PORT = int(os.getenv("PORT", 7050))

MONGO_URI = f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}{DB_OPTIONS}"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

@app.route('/')
def index():
    return "✅ ML Flask API is running"

@app.route('/detect_fraud', methods=['GET'])
def detect_fraud():
    try:
        from fraud_detector import run_detection
        return jsonify(run_detection())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/analyze', methods=['POST'])
def analyze_data():
    try:
        chat_type_counts = list(db.chats.aggregate([
            {"$group": {"_id": "$type", "count": {"$sum": 1}}}
        ]))

        meeting_status_counts = list(db.meetings.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]))

        project_stage_counts = list(db.projects.aggregate([
            {"$group": {"_id": "$project_stage", "count": {"$sum": 1}}}
        ]))

        review_avg_rating = list(db.reviews.aggregate([
            {"$group": {"_id": None, "average": {"$avg": "$review_rate"}}}
        ]))
        review_average = review_avg_rating[0]["average"] if review_avg_rating else 0

        user_role_counts = list(db.users.aggregate([
            {"$group": {"_id": "$role", "count": {"$sum": 1}}}
        ]))

        staff_role_counts = list(db.staffs.aggregate([
            {"$group": {"_id": "$role", "count": {"$sum": 1}}}
        ]))

        staff_status_counts = list(db.staffs.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]))

        project_predictions = predict_on_projects()

        fraud_count = db.projects.count_documents({'fraud_flag': 1})


        return jsonify({
            "chat_types": chat_type_counts,
            "meeting_statuses": meeting_status_counts,
            "project_stages": project_stage_counts,
            "review_average_rating": review_average,
            "user_roles": user_role_counts,
            "staff_roles": staff_role_counts,
            "staff_statuses": staff_status_counts,
            "project_predictions": project_predictions,
            "fraud_count":fraud_count,
        })

    except Exception as e:
        print("❌ Analysis error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT, debug=True)

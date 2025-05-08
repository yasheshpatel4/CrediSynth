from flask import Flask, request, jsonify
import joblib
import tensorflow as tf
from datetime import datetime
import json
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model and scaler
try:
    model = tf.keras.models.load_model('saved_model/investment_predictor.h5')
    scaler = joblib.load('saved_model/scaler.pkl')
    logger.info("✅ Model and scaler loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load model/scaler: {e}")
    model = None
    scaler = None

# Load training metadata if available (optional)
try:
    with open("saved_model/training_metadata.json", "r") as f:
        training_metadata = json.load(f)
except:
    training_metadata = {}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            raise ValueError("Model or scaler not loaded properly.")

        data = request.get_json()
        required = ['name', 'targetAmount', 'savedAmount', 'deadline']
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        name = data['name']
        target = float(data['targetAmount'])
        saved = float(data['savedAmount'])
        deadline_raw = data['deadline']

        if isinstance(deadline_raw, list):
            deadline_raw = deadline_raw[0]
        if isinstance(deadline_raw, int):
            deadline_raw = str(deadline_raw)

        deadline = datetime.strptime(deadline_raw, "%Y-%m-%d").date()
        today = datetime.today().date()
        days_left = max((deadline - today).days, 0)
        weeks_left = round(days_left / 7, 1)
        months_left = round(days_left / 30.44, 1)

        # Feature preparation
        features = [[saved, target, saved, days_left]]
        scaled_features = scaler.transform(features)

        prob = model.predict(scaled_features)[0][0]
        result = int(prob >= 0.5)

        # Analysis
        progress_percent = round((saved / target) * 100, 2) if target else 0
        daily_savings_needed = round((target - saved) / days_left, 2) if days_left > 0 else None

        if saved >= target:
            goal_status = "Achieved"
        elif daily_savings_needed and daily_savings_needed <= (target * 0.01):
            goal_status = "On Track"
        else:
            goal_status = "Behind"

        if goal_status == "Behind":
            recommendation = f"Try saving at least ₹{daily_savings_needed} per day to catch up."
        elif goal_status == "Achieved":
            recommendation = "🎉 Congratulations! You've achieved your goal."
        else:
            recommendation = "👍 You're on track. Keep saving consistently."

        return jsonify({
            "prediction": result,
            "confidence": float(prob),
            "message": "Likely to invest" if result else "Unlikely to invest",
            "goal": {
                "name": name,
                "targetAmount": target,
                "savedAmount": saved,
                "deadline": deadline_raw,
                "daysLeft": days_left,
                "weeksLeft": weeks_left,
                "monthsLeft": months_left,
                "progressPercent": progress_percent,
                "dailySavingsNeeded": daily_savings_needed,
                "goalStatus": goal_status,
                "recommendation": recommendation
            },
            "model_metadata": training_metadata
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)

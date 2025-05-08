from flask import Flask, request, jsonify
import joblib
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Load models
roi_model = joblib.load("roi_model.pkl")
days_model = joblib.load("days_model.pkl")
out_model = joblib.load("outperform_model.pkl")
expected_features = joblib.load("expected_features.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Input parsing
    investment_type = data["investmentType"]
    amount = float(data["amount"])
    purchase_price = float(data["purchasePrice"])
    current_value = float(data["currentValue"])
    purchase_date = datetime.strptime(data["purchaseDate"], "%Y-%m-%d")
    today = datetime.today()

    # Real values
    actual_roi = ((current_value - purchase_price) / purchase_price) * 100
    holding_days = (today - purchase_date).days

    # Prepare model input
    input_df = pd.DataFrame([{
        "amount": amount,
        "purchase_price": purchase_price,
        "current_value": current_value,
        f"type_{investment_type}": 1
    }])

    # Add missing features
    for col in expected_features:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[expected_features]

    # Predictions
    predicted_roi = roi_model.predict(input_df)[0]
    predicted_days = days_model.predict(input_df)[0]
    predicted_outperformance = bool(out_model.predict(input_df)[0])

    # Logic for recommendation
    recommendation = "Hold"
    if actual_roi < -20 and holding_days > 365 and predicted_roi < 0:
        recommendation = "Sell - too much loss over time"
    elif actual_roi > 30:
        recommendation = "Consider selling - already good profit"
    elif predicted_roi > actual_roi:
        recommendation = f"Hold for approximately {int(predicted_days)} more days"

    # Simulated alternatives
    alternatives = [
        {"type": "Stock", "estimated_roi": round(predicted_roi + 2, 2)},
        {"type": "Bond", "estimated_roi": round(predicted_roi - 1.5, 2)},
        {"type": "Crypto", "estimated_roi": round(predicted_roi + 4, 2)}
    ]

    return jsonify({
        "actualROI": round(actual_roi, 2),
        "holdingDays": holding_days,
        "predictedROI": round(predicted_roi, 2),
        "recommendedHoldingDays": int(predicted_days),
        "predictedOutperformance": predicted_outperformance,
        "recommendation": recommendation,
        "alternatives": alternatives
    })

if __name__ == "__main__":
    app.run(port=5002,debug=True)

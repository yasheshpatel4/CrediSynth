from flask import Flask, request, jsonify
import joblib
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Load model and expected columns
model = joblib.load("inveestment/investment_model.pkl")
expected_columns = joblib.load("inveestment/expected_columns.pkl")

@app.route('/analyze', methods=['POST'])
def analyze_investment():
    data = request.get_json()

    # Parse values with fallback and validation
    investment_type_str = data.get("investmentType", "Unknown")
    asset_str = data.get("asset") or data.get("assetName", "Unknown")
    amount = float(data.get("amount", 0))
    purchase_price = float(data.get("purchasePrice", data.get("currentValue", 0)))  # fallback
    current_value = float(data.get("currentValue", 0))
    purchase_date_str = data.get("purchaseDate", "2022-01-01")

    # Compute days held
    try:
        purchase_date = datetime.strptime(purchase_date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid purchaseDate format. Use YYYY-MM-DD."}), 400

    days_held = (datetime.now() - purchase_date).days
    user_activity_score = 80  # static or dynamic logic here

    # Create dataframe for prediction
    input_df = pd.DataFrame([{
        "amount": amount,
        "purchase_price": purchase_price,
        "current_value": current_value,
        "days_held": days_held,
        "user_activity_score": user_activity_score,
        "type": investment_type_str,
        "asset": asset_str
    }])

    # One-hot encode and align with training features
    input_encoded = pd.get_dummies(input_df)
    for col in expected_columns:
        if col not in input_encoded.columns:
            input_encoded[col] = 0
    input_encoded = input_encoded[expected_columns]

    # Predict
    prediction = model.predict(input_encoded)[0]

    # Financial calculations
    initial_total = amount * purchase_price
    current_total = amount * current_value
    gain_loss = current_total - initial_total
    gain_loss_percent = (gain_loss / initial_total) * 100 if initial_total != 0 else 0

    summary_message = (
        f"Your investment in {asset_str} {'looks profitable' if prediction == 1 else 'is underperforming'}. "
        f"You've {'gained' if gain_loss >= 0 else 'lost'} approximately "
        f"{round(abs(gain_loss), 2)} USD ({round(abs(gain_loss_percent), 2)}%)."
    )

    return jsonify({
        "investment_quality": "Good" if prediction == 1 else "Bad",
        "raw_prediction": int(prediction),
        "investment_type": investment_type_str,
        "asset": asset_str,
        "amount": amount,
        "purchase_price": purchase_price,
        "current_price": current_value,
        "initial_total_value": round(initial_total, 2),
        "current_total_value": round(current_total, 2),
        "gain_loss": round(gain_loss, 2),
        "gain_loss_percent": round(gain_loss_percent, 2),
        "days_held": days_held,
        "summary_message": summary_message
    })

if __name__ == '__main__':
    app.run(debug=True)

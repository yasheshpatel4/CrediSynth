from flask import Flask, request, jsonify
import joblib
import numpy as np
import traceback

app = Flask(__name__)

# Load trained model
model = joblib.load('money_insights/money_insights_model.pkl')

# Label mappings
investment_mapping = {'Stock': 0, 'MutualFund': 1, 'ETF': 2, 'Bond': 3}
risk_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
outcome_mapping = {0: 'Safe', 1: 'Moderate', 2: 'Risky'}

@app.route('/analyze/insights', methods=['POST'])
def predict_insight():
    data = request.get_json()

    user_profile = data.get('userProfile', {})
    investments = data.get('investments', [])
    goals = data.get('goals', [])

    if not isinstance(investments, list) or not all(isinstance(inv, dict) for inv in investments):
        return jsonify({"error": "Invalid format for 'investments'. Expected a list of objects."}), 400

    try:
        monthly_income = user_profile.get('monthlyIncome', 0.0)
        savings_target = user_profile.get('savingsTarget', 0.0)
        risk_tolerance = user_profile.get('riskTolerance', 'Medium')
        investment_preferences = user_profile.get('investmentPreferences', 'Stock')

        saved_amount = sum(goal.get('savedAmount', 0.0) for goal in goals) if goals else 0.0

        if investments:
            total_amount = sum(inv.get('amount', 0.0) for inv in investments)
            total_purchase_price = sum(inv.get('purchasePrice', 0.0) for inv in investments)
            current_value_avg = total_amount / len(investments)
            purchase_price_avg = total_purchase_price / len(investments)
            types = [inv.get('investmentType', investment_preferences) for inv in investments]
            investment_type = max(set(types), key=types.count)
        else:
            current_value_avg = 0.0
            purchase_price_avg = 0.0
            investment_type = investment_preferences

        investment_code = investment_mapping.get(investment_type, 0)
        risk_code = risk_mapping.get(risk_tolerance, 1)

        features = np.array([
            monthly_income,
            savings_target,
            saved_amount,
            investment_code,
            current_value_avg,
            purchase_price_avg,
            risk_code
        ]).reshape(1, -1)

        # Main classification
        prediction = model.predict(features)[0]
        predicted_label = outcome_mapping.get(prediction, "Unknown")

        # ROI
        roi_percent = round(((current_value_avg - purchase_price_avg) / purchase_price_avg) * 100, 2) if purchase_price_avg > 0 else 0.0

        # Savings progress
        savings_progress = round((saved_amount / savings_target) * 100, 2) if savings_target > 0 else 0.0

        # Diversification score
        unique_types = len(set(types)) if investments else 1
        diversification_score = round((unique_types / len(investment_mapping)) * 100, 2)

        # Suggestions
        suggestions = []
        if predicted_label == "Risky":
            suggestions.append("Diversify your investments to reduce risk.")
            if risk_tolerance != "High":
                suggestions.append("Your risk tolerance is lower than your portfolio's actual risk.")
        elif predicted_label == "Safe":
            suggestions.append("Consider slightly riskier assets if you're aiming for higher returns.")

        if savings_progress < 50:
            suggestions.append("You're behind on your savings goal. Try to save more each month.")

        return jsonify({
            "predicted_insight": predicted_label,
            "roi_percent": roi_percent,
            "savings_progress_percent": savings_progress,
            "diversification_score_percent": diversification_score,
            "suggestions": suggestions,
            "features_used": {
                "monthlyIncome": monthly_income,
                "savingsTarget": savings_target,
                "savedAmount": saved_amount,
                "investmentType": investment_type,
                "currentValueAvg": current_value_avg,
                "purchasePriceAvg": purchase_price_avg,
                "riskTolerance": risk_tolerance
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "trace": traceback.format_exc()
        }), 500



if __name__ == '__main__':
    app.run(debug=True)

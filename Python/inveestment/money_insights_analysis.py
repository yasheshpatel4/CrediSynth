from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

def load_sample_data():
    filename = os.path.join(os.path.dirname(__file__), "sample_expenses.csv")
    if not os.path.exists(filename):
        return pd.DataFrame(columns=["description", "amount", "date", "category", "type"])
    df = pd.read_csv(filename, parse_dates=["date"])
    return df

def analyze_data(df):
    df['month'] = df['date'].dt.to_period('M')

    # Debug print combined dataframe categories and amounts
    # print("Combined DataFrame categories and amounts:")
    # print(df.groupby('category')['amount'].sum())

    # Monthly saving and expense for bar chart
    monthly_summary = df.groupby(['month', 'type'])['amount'].sum().unstack(fill_value=0)
    monthly_saving_expense = {
        "labels": [str(m) for m in monthly_summary.index],
        "saving": monthly_summary.get('saving', pd.Series([0]*len(monthly_summary.index))).tolist(),
        "expense": monthly_summary.get('expense', pd.Series([0]*len(monthly_summary.index))).abs().tolist()
    }

    # Monthly saving for line chart
    monthly_saving = {
        "labels": [str(m) for m in monthly_summary.index],
        "data": monthly_summary.get('saving', pd.Series([0]*len(monthly_summary.index))).tolist()
    }

    # Category wise spending for pie chart (aggregate over all data)
    category_wise_spending_series = df[df['type'] == 'expense'].groupby('category')['amount'].sum().abs()
    # print("Category wise spending series:")
    # print(category_wise_spending_series)
    category_wise_spending = {
        "labels": category_wise_spending_series.index.tolist(),
        "data": category_wise_spending_series.values.tolist()
    }

    recommendations = []
    overspending_months = monthly_summary.index[monthly_summary.get('expense', 0) > monthly_summary.get('saving', 0)].tolist()
    for month in overspending_months:
        recommendations.append(f"Alert: You overspent in {month}. Consider reviewing your expenses.")

    if not category_wise_spending_series.empty:
        top_category = category_wise_spending_series.idxmax()
        top_amount = category_wise_spending_series.max()
        recommendations.append(f"Tip: You could save ₹{int(top_amount * 0.1)} per month by reducing spending on {top_category}.")

    recommendations.append("Consider investing ₹5,000 in a low-risk mutual fund to balance your portfolio.")

    return {
        "monthlySavingExpense": monthly_saving_expense,
        "monthlySaving": monthly_saving,
        "categoryWiseSpending": category_wise_spending,
        "recommendations": recommendations
    }

@app.route('/money-insights/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    expenses = data.get("expenses", [])
    sample_df = load_sample_data()

    if expenses:
        user_df = pd.DataFrame(expenses)
        user_df['date'] = pd.to_datetime(user_df['date'])
        # Normalize amount: expenses negative, income/saving positive
        def normalize_amount(row):
            if row['type'] == 'expense':
                return -abs(row['amount'])
            else:
                return abs(row['amount'])
        user_df['amount'] = user_df.apply(normalize_amount, axis=1)
        combined_df = pd.concat([sample_df, user_df], ignore_index=True)
    else:
        combined_df = sample_df

    result = analyze_data(combined_df)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

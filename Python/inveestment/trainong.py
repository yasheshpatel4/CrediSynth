# train_investment_models.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("C:/Users/zeelp/Desktop/CrediSynth/Python/inveestment/investment_data.csv")

# Feature engineering
df["roi"] = ((df["current_value"] - df["purchase_price"]) / df["purchase_price"]) * 100
df = pd.get_dummies(df, columns=["type"])

# Feature selection
features = [col for col in df.columns if col not in ["roi", "days_held", "outperformed"]]

# Train ROI predictor
X_roi, y_roi = df[features], df["roi"]
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_roi, y_roi, test_size=0.2, random_state=42)
roi_model = RandomForestRegressor(n_estimators=100, random_state=42)
roi_model.fit(X_train_r, y_train_r)
print(f"ROI Model R^2 Score: {roi_model.score(X_test_r, y_test_r):.2f}")
joblib.dump(roi_model, "roi_model.pkl")

# Train holding days predictor
X_days, y_days = df[features], df["days_held"]
X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_days, y_days, test_size=0.2, random_state=42)
days_model = RandomForestRegressor(n_estimators=100, random_state=42)
days_model.fit(X_train_d, y_train_d)
print(f"Holding Days Model R^2 Score: {days_model.score(X_test_d, y_test_d):.2f}")
joblib.dump(days_model, "days_model.pkl")

# Optional: Train outperformance classifier
X_out, y_out = df[features], df["outperformed"]
X_train_o, X_test_o, y_train_o, y_test_o = train_test_split(X_out, y_out, test_size=0.2, random_state=42)
out_model = RandomForestClassifier(n_estimators=100, random_state=42)
out_model.fit(X_train_o, y_train_o)
print(f"Outperformance Classifier Accuracy: {out_model.score(X_test_o, y_test_o):.2f}")
joblib.dump(out_model, "outperform_model.pkl")

# Save expected columns for Flask usage
joblib.dump(features, "expected_features.pkl")

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv("inveestment/investment_data.csv")

# One-hot encode categorical columns
df = pd.get_dummies(data, columns=["type"])

# Define features and target
X = df.drop("outperformed", axis=1)
y = df["outperformed"]

# Save expected column order
joblib.dump(list(X.columns), "inveestment/expected_columns.pkl")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "inveestment/investment_model.pkl")

# Print accuracy
accuracy = model.score(X_test, y_test)
print(f"Model accuracy on test data: {accuracy * 100:.2f}%")

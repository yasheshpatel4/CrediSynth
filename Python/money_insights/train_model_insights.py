import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv('C:/Users/zeelp/Desktop/Python/money_insights/high_accuracy_financial_users.csv')

# Encode categorical columns
le = LabelEncoder()
df['investmentType'] = le.fit_transform(df['investmentType'])
df['riskTolerance'] = le.fit_transform(df['riskTolerance'])
df['outcome'] = le.fit_transform(df['outcome'])

# Features and label
X = df.drop('outcome', axis=1)
y = df['outcome']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'money_insights/money_insights_model.pkl')

y_pred_test = model.predict(X_test)
test_accuracy = accuracy_score(y_test, y_pred_test)
print(f"Model test accuracy: {test_accuracy:.2%}")


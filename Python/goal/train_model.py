import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
import joblib

# Load data
df = pd.read_csv("C:/Users/zeelp/Desktop/FinAi  Python/financial_data_500.csv")

# Convert dates to datetime
df['transaction_date'] = pd.to_datetime(df['transaction_date'])
df['goal_deadline'] = pd.to_datetime(df['goal_deadline'])
df['investment_date'] = pd.to_datetime(df['investment_date'])

# Feature engineering
df['transaction_year'] = df['transaction_date'].dt.year
df['transaction_month'] = df['transaction_date'].dt.month
df['goal_time_left_days'] = (df['goal_deadline'] - df['transaction_date']).dt.days
df['is_invested'] = df['investment_amount'].notnull().astype(int)

# Define features and target
features = df[['amount', 'goal_target', 'goal_saved', 'goal_time_left_days']]
target = df['is_invested']

# Scale features
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Save the scaler
joblib.dump(scaler, "saved_model/scaler.pkl")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(features_scaled, target, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(features.shape[1],)),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile and train
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=30, batch_size=16, validation_data=(X_test, y_test), verbose=1)

# Save model
model.save("saved_model/investment_predictor.h5")
print("✅ Success: Model trained and saved as 'investment_predictor.h5'.")
print("✅ Scaler saved as 'scaler.pkl'.")
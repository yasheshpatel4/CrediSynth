import json
import logging
from flask import Flask, jsonify, request
import joblib
import tensorflow as tf

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)  # Set log level to INFO or DEBUG
logger = logging.getLogger(__name__)  # Create a logger for your module

# Load model and scaler
try:
    model = tf.keras.models.load_model("saved_model/investment_predictor.h5")
    scaler = joblib.load("saved_model/scaler.pkl")
    logger.info("✅ Model and scaler loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load model/scaler: {str(e)}")

# Load training metadata
try:
    with open("saved_model/training_metadata.json", "r") as f:
        training_metadata = json.load(f)
    logger.info("✅ Training metadata loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load training metadata: {str(e)}")
    training_metadata = {}

# Define /predict route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse input data from POST request
        input_data = request.get_json()  # assuming input data is sent as JSON
        
        # Extract features (e.g., amount, goal_target, goal_saved, goal_time_left_days)
        features = [
            input_data['amount'],
            input_data['goal_target'],
            input_data['goal_saved'],
            input_data['goal_time_left_days']
        ]
        
        # Scale the input data using the saved scaler
        features_scaled = scaler.transform([features])
        
        # Predict the result (probability) using the trained model
        prediction_prob = model.predict(features_scaled)[0][0]
        result = 1 if prediction_prob >= 0.5 else 0
        
        # Prepare the response with training insights
        response = {
            "prediction": result,
            "confidence": float(prediction_prob),
            "message": "Likely to invest" if result else "Unlikely to invest",
            "status": "success",
            "model_analytics": {
                "training_performance": {
                    "accuracy": training_metadata.get("final_accuracy"),
                    "loss": training_metadata.get("final_loss"),
                    "training_duration": training_metadata.get("training_duration"),
                    "best_epoch": training_metadata.get("best_epoch")
                },
                "data_distribution": {
                    "class_ratio": training_metadata.get("class_distribution"),
                    "total_samples": training_metadata.get("total_samples"),
                    "feature_means": training_metadata.get("feature_means")
                },
                "model_architecture": {
                    "layers": [layer.__class__.__name__ for layer in model.layers],
                    "input_shape": model.input_shape[1:],
                    "output_shape": model.output_shape[1:]
                }
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"❌ Error in prediction: {str(e)}")
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

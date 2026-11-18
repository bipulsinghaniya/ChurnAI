
import os
import joblib
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Load trained model and preprocessing objects
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "models"))

model = joblib.load(
    os.path.join(MODEL_DIR, "customer_churn_model.pkl")
)

encoder = joblib.load(
    os.path.join(MODEL_DIR, "encoder.pkl")
)

scaler = joblib.load(
    os.path.join(MODEL_DIR, "scaler.pkl")
)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Customer Churn Prediction API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No customer data received"}), 400

        # Convert input into DataFrame
        customer = pd.DataFrame([data])

        # Get original categorical and numerical features
        categorical_features = list(encoder.feature_names_in_)
        numerical_features = list(scaler.feature_names_in_)

        # Validate required features
        required_features = categorical_features + numerical_features

        missing_features = [
            feature for feature in required_features
            if feature not in customer.columns
        ]

        if missing_features:
            return jsonify({
                "error": f"Missing features: {missing_features}"
            }), 400

        # Encode categorical features
        encoded = encoder.transform(
            customer[categorical_features]
        )

        encoded_df = pd.DataFrame(
            encoded,
            columns=encoder.get_feature_names_out(
                categorical_features
            )
        )

        # Scale numerical features
        scaled_values = scaler.transform(
            customer[numerical_features]
        )

        scaled_df = pd.DataFrame(
            scaled_values,
            columns=numerical_features
        )

        # Combine encoded and scaled features
        processed_customer = pd.concat(
            [encoded_df, scaled_df],
            axis=1
        )

        # IMPORTANT:
        # Match the exact feature order used during model training
        processed_customer = processed_customer.reindex(
            columns=model.feature_names_in_,
            fill_value=0
        )

        # Make prediction
        prediction = model.predict(processed_customer)[0]

        probabilities = model.predict_proba(
            processed_customer
        )[0]

        churn_index = list(model.classes_).index(1)
        churn_probability = probabilities[churn_index]

        return jsonify({
            "prediction": int(prediction),
            "result": "Churn" if prediction == 1 else "No Churn",
            "churn_probability": round(
                float(churn_probability) * 100, 2
            )
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)

# ChurnPulse – Customer Churn Prediction System

An end-to-end Machine Learning web application designed to predict telecom customer churn in real time. It features a complete ML pipeline built with Scikit-learn, a Flask REST API backend for low-latency inference, and an intuitive, modern dashboard developed with React 19, Vite, and Tailwind CSS.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Machine Learning Pipeline & Performance](#-machine-learning-pipeline--performance)
- [Project Architecture](#-project-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Run (Quick Guide)](#-how-to-run-quick-guide)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## ⚡ How to Run (Quick Guide)

> 📖 **Full step-by-step instructions & troubleshooting are available in [RUN.md](file:///d:/Projects/3_MachineLearningProjects/Customer-Churn-Prediction/RUN.md).**

1. **Start Backend (Terminal 1):**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
2. **Start Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Open Browser:** Visit `https://churnpulse-frontend.onrender.com`

---

## 🚀 Overview

Customer churn poses a major challenge for subscription-based businesses. **ChurnPulse** helps identify high-risk customers before they leave, allowing businesses to proactively offer targeted retention strategies. 

The project analyzes the **Telco Customer Churn dataset** (7,043 customer records, 20+ demographic and account attributes) and predicts whether a customer will churn along with their churn probability score and risk level (Low, Medium, High).

---

## ✨ Key Features

- **End-to-End ML Pipeline:** Data exploration, preprocessing, feature encoding, scaling, and hyperparameter tuning using Scikit-learn.
- **Leak-Free Preprocessing:** Fitted `StandardScaler` and `OneHotEncoder` strictly on training splits to prevent data leakage.
- **Optimized for Recall:** Hyperparameter-tuned Random Forest with balanced class weights to maximize churn detection.
- **Fast REST API:** Lightweight Flask API handling input validation and serialized pipeline inference with Joblib.
- **Interactive UI Dashboard:** Built with React 19, Tailwind CSS, and Lucide icons for real-time risk assessment and dynamic probability scoring.

---

## 📊 Machine Learning Pipeline & Performance

Multiple classification models were trained and benchmarked:

| Model | Accuracy | Churn Precision | Churn Recall | Churn F1-Score |
|---|:---:|:---:|:---:|:---:|
| Logistic Regression | 80.70% | 66% | 56% | 61% |
| Tuned Logistic Regression | 74.24% | 51% | 78% | 62% |
| **Tuned Random Forest (Selected)** | **76.30%** | **54%** | **79%** | **64%** |

> **Why Tuned Random Forest?** In customer churn prediction, **Recall** is critical — missing a customer who is about to churn (false negative) is much more expensive than reaching out to an active customer (false positive). Tuned Random Forest achieved the highest recall (**79%**) with balanced class weights.

---

## 🏗️ Project Architecture

```
[ User Input (React Dashboard) ]
              │
              ▼  (HTTP POST /predict)
[ Flask REST API Server (Port 5000) ]
              │
              ▼
[ Feature Transformation ]
  ├── Categorical Features  ──>  OneHotEncoder (encoder.pkl)
  └── Numerical Features    ──>  StandardScaler (scaler.pkl)
              │
              ▼
[ Inference Engine ]
  └── Random Forest Classifier (customer_churn_model.pkl)
              │
              ▼
[ JSON Response: Prediction, Probability %, Risk Tier ]
```

---

## 🛠️ Tech Stack

- **Machine Learning & Data Science:** Python, Scikit-learn, Pandas, NumPy, Joblib, Jupyter Notebook
- **Backend:** Flask, Flask-CORS
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React
- **Dataset:** Telco Customer Churn (Kaggle)

---

## 📂 Project Structure

```bash
Customer-Churn-Prediction/
├── backend/
│   ├── app.py                # Flask application & inference endpoint
│   └── requirements.txt      # Python dependencies
├── data/
│   └── Telco-Customer-Churn.csv # Dataset
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React Dashboard component
│   │   ├── main.jsx          # React DOM entry point
│   │   └── index.css         # Tailwind directives & global styling
│   ├── package.json          # Node dependencies & build scripts
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration
├── models/
│   ├── customer_churn_model.pkl # Trained Random Forest model
│   ├── encoder.pkl              # Saved OneHotEncoder
│   └── scaler.pkl               # Saved StandardScaler
├── notebooks/
│   └── 01_data_exploration.ipynb # EDA, model training & evaluation
├── .gitignore
├── README.md
└── RUN.md                    # Detailed run instructions
```

---

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/Customer-Churn-Prediction.git
cd Customer-Churn-Prediction
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# Windows:
python -m venv venv
venv\Scripts\activate
# macOS/Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask API server
python app.py
```
Backend API will be running at `http://127.0.0.1:5000`.

### 3. Frontend Setup
In a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open your browser at `http://localhost:5173` to access the dashboard.

---

## 📡 API Documentation

### **Endpoint:** `POST /predict`

#### Request Body (JSON)
```json
{
  "gender": "Female",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 5,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "OnlineBackup": "No",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "No",
  "StreamingMovies": "No",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 75.50,
  "TotalCharges": 377.50
}
```

#### Response (JSON)
```json
{
  "prediction": 1,
  "result": "Churn",
  "churn_probability": 78.42
}
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

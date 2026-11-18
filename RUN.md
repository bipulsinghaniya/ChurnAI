# 🚀 How to Run the Project (Step-by-Step Guide)

This guide provides clear, practical instructions for running both the **Flask Backend API** and the **React + Vite Frontend Dashboard** on your machine.

---

## 📋 Prerequisites

Before running the project, ensure you have installed:
- **Python 3.9+**: Check with `python --version`
- **Node.js 18+ & npm**: Check with `node -v` and `npm -v`
- **Git**: Check with `git --version`

---

## 🏃 Quick Start (2 Terminal Windows)

You will need two separate terminal windows or tabs: one for the **Backend** and one for the **Frontend**.

---

### Step 1: Start the Backend (Flask API)

Open your **first terminal** and navigate to the project directory:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment (recommended)
# On Windows:
python -m venv venv

# On macOS/Linux:
# python3 -m venv venv

# 3. Activate the virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
# venv\Scripts\activate.bat
# On macOS/Linux:
# source venv/bin/activate

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Start the Flask server
python app.py
```

✅ **Expected Output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```
> The API server is now running on `http://127.0.0.1:5000`. Leave this terminal open.

---

### Step 2: Start the Frontend (React + Vite)

Open your **second terminal** and navigate to the project directory:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies (first time only)
npm install

# 3. Start the Vite development server
npm run dev
```

✅ **Expected Output:**
```
  VITE v8.x.x  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 3: Open in Browser

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

You will see the ChurnPulse Dashboard. Fill in customer details or use the default values and click **"Predict Churn"** to get real-time churn probability and risk tier analysis.

---

## 🧪 Testing the API Directly (Optional)

You can verify the backend is running properly without the frontend by running this command in another terminal:

### Health Check (GET)
```bash
# Windows PowerShell:
curl http://127.0.0.1:5000/

# Expected Output:
# {"message":"Customer Churn Prediction API is running!"}
```

### Prediction Test (POST)
```bash
# Windows PowerShell:
Invoke-RestMethod -Uri "http://127.0.0.1:5000/predict" -Method Post -ContentType "application/json" -Body (@{
    gender = "Female"
    SeniorCitizen = 0
    Partner = "Yes"
    Dependents = "No"
    tenure = 5
    PhoneService = "Yes"
    MultipleLines = "No"
    InternetService = "Fiber optic"
    OnlineSecurity = "No"
    OnlineBackup = "No"
    DeviceProtection = "No"
    TechSupport = "No"
    StreamingTV = "No"
    StreamingMovies = "No"
    Contract = "Month-to-month"
    PaperlessBilling = "Yes"
    PaymentMethod = "Electronic check"
    MonthlyCharges = 75.50
    TotalCharges = 377.50
} | ConvertTo-Json)
```

---

## 🛠️ Common Troubleshooting

| Issue | Solution |
|---|---|
| `Port 5000 is already in use` | Kill the process using port 5000 or change the port in `backend/app.py` line 124. |
| `ModuleNotFoundError: No module named 'flask'` | Ensure your virtual environment is activated (`venv\Scripts\activate`) before running `pip install -r requirements.txt`. |
| `Cannot connect to API` on frontend | Ensure the backend server (`python app.py`) is running on port 5000 before clicking predict in the browser. |
| `npm command not found` | Install Node.js from [nodejs.org](https://nodejs.org/). |

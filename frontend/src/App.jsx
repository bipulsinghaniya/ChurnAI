import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000/predict";

const DEFAULT_FORM = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "No",
  tenure: 5,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 75.50,
  TotalCharges: 377.50,
};

const COHORT_SAMPLES = [
  {
    id: 1,
    label: "Case 1 · New Fiber Optic Churner",
    category: "High Risk",
    riskClass: "badge-high",
    prob: "78.4%",
    contract: "Month-to-month",
    internet: "Fiber optic",
    tenure: "5 months",
    charges: "$75.50/mo",
    notes: "Short tenure, electronic check, lack of tech support and security add-ons.",
    data: {
      gender: "Female",
      SeniorCitizen: 0,
      Partner: "Yes",
      Dependents: "No",
      tenure: 5,
      PhoneService: "Yes",
      MultipleLines: "No",
      InternetService: "Fiber optic",
      OnlineSecurity: "No",
      OnlineBackup: "No",
      DeviceProtection: "No",
      TechSupport: "No",
      StreamingTV: "No",
      StreamingMovies: "No",
      Contract: "Month-to-month",
      PaperlessBilling: "Yes",
      PaymentMethod: "Electronic check",
      MonthlyCharges: 75.50,
      TotalCharges: 377.50,
    },
  },
  {
    id: 2,
    label: "Case 2 · High-Spend Month-to-Month",
    category: "High Risk",
    riskClass: "badge-high",
    prob: "83.1%",
    contract: "Month-to-month",
    internet: "Fiber optic",
    tenure: "2 months",
    charges: "$99.85/mo",
    notes: "High monthly commitment without long-term agreement or device protection.",
    data: {
      gender: "Male",
      SeniorCitizen: 1,
      Partner: "No",
      Dependents: "No",
      tenure: 2,
      PhoneService: "Yes",
      MultipleLines: "Yes",
      InternetService: "Fiber optic",
      OnlineSecurity: "No",
      OnlineBackup: "No",
      DeviceProtection: "No",
      TechSupport: "No",
      StreamingTV: "Yes",
      StreamingMovies: "Yes",
      Contract: "Month-to-month",
      PaperlessBilling: "Yes",
      PaymentMethod: "Electronic check",
      MonthlyCharges: 99.85,
      TotalCharges: 199.70,
    },
  },
  {
    id: 3,
    label: "Case 3 · Transitioning DSL User",
    category: "Medium Risk",
    riskClass: "badge-medium",
    prob: "52.8%",
    contract: "One year",
    internet: "DSL",
    tenure: "18 months",
    charges: "$54.20/mo",
    notes: "Moderate tenure with one-year contract, but streaming add-ons unutilized.",
    data: {
      gender: "Male",
      SeniorCitizen: 0,
      Partner: "No",
      Dependents: "No",
      tenure: 18,
      PhoneService: "Yes",
      MultipleLines: "No",
      InternetService: "DSL",
      OnlineSecurity: "Yes",
      OnlineBackup: "No",
      DeviceProtection: "No",
      TechSupport: "No",
      StreamingTV: "No",
      StreamingMovies: "No",
      Contract: "One year",
      PaperlessBilling: "No",
      PaymentMethod: "Mailed check",
      MonthlyCharges: 54.20,
      TotalCharges: 975.60,
    },
  },
  {
    id: 4,
    label: "Case 4 · Multi-Product Family",
    category: "Medium Risk",
    riskClass: "badge-medium",
    prob: "41.6%",
    contract: "Month-to-month",
    internet: "DSL",
    tenure: "24 months",
    charges: "$68.90/mo",
    notes: "Multiple lines and dependents; potential retention target for contract upgrade.",
    data: {
      gender: "Female",
      SeniorCitizen: 0,
      Partner: "Yes",
      Dependents: "Yes",
      tenure: 24,
      PhoneService: "Yes",
      MultipleLines: "Yes",
      InternetService: "DSL",
      OnlineSecurity: "Yes",
      OnlineBackup: "Yes",
      DeviceProtection: "Yes",
      TechSupport: "No",
      StreamingTV: "Yes",
      StreamingMovies: "No",
      Contract: "Month-to-month",
      PaperlessBilling: "Yes",
      PaymentMethod: "Bank transfer (automatic)",
      MonthlyCharges: 68.90,
      TotalCharges: 1653.60,
    },
  },
  {
    id: 5,
    label: "Case 5 · Long-Tenure 2-Year Contract",
    category: "Low Risk",
    riskClass: "badge-low",
    prob: "4.8%",
    contract: "Two year",
    internet: "Fiber optic",
    tenure: "68 months",
    charges: "$105.40/mo",
    notes: "Highly sticky customer with all security services enabled and auto bank transfer.",
    data: {
      gender: "Female",
      SeniorCitizen: 0,
      Partner: "Yes",
      Dependents: "Yes",
      tenure: 68,
      PhoneService: "Yes",
      MultipleLines: "Yes",
      InternetService: "Fiber optic",
      OnlineSecurity: "Yes",
      OnlineBackup: "Yes",
      DeviceProtection: "Yes",
      TechSupport: "Yes",
      StreamingTV: "Yes",
      StreamingMovies: "Yes",
      Contract: "Two year",
      PaperlessBilling: "No",
      PaymentMethod: "Bank transfer (automatic)",
      MonthlyCharges: 105.40,
      TotalCharges: 7167.20,
    },
  },
  {
    id: 6,
    label: "Case 6 · Loyal Phone-Only Senior",
    category: "Low Risk",
    riskClass: "badge-low",
    prob: "2.1%",
    contract: "Two year",
    internet: "No",
    tenure: "60 months",
    charges: "$20.25/mo",
    notes: "Low-maintenance phone service with consistent automatic credit card payments.",
    data: {
      gender: "Male",
      SeniorCitizen: 1,
      Partner: "Yes",
      Dependents: "No",
      tenure: 60,
      PhoneService: "Yes",
      MultipleLines: "No",
      InternetService: "No",
      OnlineSecurity: "No internet service",
      OnlineBackup: "No internet service",
      DeviceProtection: "No internet service",
      TechSupport: "No internet service",
      StreamingTV: "No internet service",
      StreamingMovies: "No internet service",
      Contract: "Two year",
      PaperlessBilling: "No",
      PaymentMethod: "Credit card (automatic)",
      MonthlyCharges: 20.25,
      TotalCharges: 1215.00,
    },
  },
];

export default function App() {
  /* ── State ── */
  const [tab, setTab] = useState("predict");
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([
    "[SYSTEM] ChurnPulse Random Forest Engine v1.0 ready.",
    "[SYSTEM] Serialized objects loaded: encoder.pkl, scaler.pkl, customer_churn_model.pkl",
  ]);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const logsRef = useRef(null);
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  /* ── Logs auto-scroll ── */
  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  /* ── Chart.js ── */
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();

    chartInst.current = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Logistic Reg.", "Tuned Log. Reg.", "Tuned Random Forest"],
        datasets: [
          {
            label: "Accuracy",
            data: [0.807, 0.7424, 0.763],
            backgroundColor: "rgba(13,148,136,.7)",
            borderColor: "#0d9488",
            borderWidth: 1,
          },
          {
            label: "Churn Recall",
            data: [0.56, 0.78, 0.79],
            backgroundColor: "rgba(14,165,233,.7)",
            borderColor: "#0ea5e9",
            borderWidth: 1,
          },
          {
            label: "Churn Precision",
            data: [0.66, 0.51, 0.54],
            backgroundColor: "rgba(16,185,129,.7)",
            borderColor: "#10b981",
            borderWidth: 1,
          },
          {
            label: "F1-Score",
            data: [0.61, 0.62, 0.64],
            backgroundColor: "rgba(167,139,250,.7)",
            borderColor: "#a78bfa",
            borderWidth: 1,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#94a3b8",
              font: { family: "Inter, sans-serif", size: 11 },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,.03)" },
          },
          y: {
            min: 0,
            max: 1,
            ticks: { color: "#94a3b8", stepSize: 0.2 },
            grid: { color: "rgba(255,255,255,.03)" },
          },
        },
      },
    });
  }, []);

  /* ── Helpers ── */
  const addLog = (msg, cls = "") => setLogs((p) => [...p, { msg, cls }]);
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3500);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "SeniorCitizen" || field === "tenure"
          ? parseInt(value) || 0
          : field === "MonthlyCharges" || field === "TotalCharges"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const applyPreset = (presetData) => {
    setFormData({ ...presetData });
    setPredictionResult(null);
    addLog(`[ACTION] Applied preset: ${presetData.Contract} | ${presetData.InternetService}`, "log-info");
    showToast("Preset profile loaded!", "success");
  };

  /* ── Prediction ── */
  const runPrediction = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    addLog("[INFO] Dispatching customer payload to Flask REST API...", "log-info");

    const iv = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 88));
    }, 120);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const result = await res.json();
      setPredictionResult(result);
      setProgress(100);

      const logMsg = `[SUCCESS] Output received: ${result.result} (${result.churn_probability}%)`;
      addLog(logMsg, result.prediction === 1 ? "log-warn" : "log-success");
      showToast(`Prediction: ${result.result} (${result.churn_probability}%)`, "success");
    } catch (err) {
      const msg = err.message.includes("fetch")
        ? "Cannot connect to Flask backend. Is 'python app.py' running on port 5000?"
        : err.message;
      setError(msg);
      addLog(`[ERROR] ${msg}`, "log-warn");
      showToast("Prediction failed", "error");
    } finally {
      clearInterval(iv);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /* ── Filter Cohorts ── */
  const cohortItems =
    galleryFilter === "all"
      ? COHORT_SAMPLES
      : COHORT_SAMPLES.filter((s) => s.category.toLowerCase().includes(galleryFilter.toLowerCase()));

  /* ── Render ── */
  return (
    <>
      <div className="grid-mesh" />
      <div className="glow-blob blob-top" />
      <div className="glow-blob blob-bottom" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="navbar-logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line" />
            </div>
            <span className="logo-name">ChurnPulse</span>
          </a>
          <ul className="navbar-menu">
            <li><a href="#features" className="navbar-link">Capabilities</a></li>
            <li><a href="#demo" className="navbar-link">Live Console</a></li>
            <li><a href="#cohorts" className="navbar-link">Customer Cohorts</a></li>
            <li><a href="#metrics" className="navbar-link">Model Telemetry</a></li>
            <li><a href="#faq" className="navbar-link">FAQ</a></li>
          </ul>
          <a href="#demo" className="btn btn-primary btn-sm">
            <i className="fas fa-play" /> Run Predictor
          </a>
        </div>
      </nav>

      <div className="app-wrap">
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Random Forest Active · 79% Churn Recall · F1 0.64</span>
          </div>
          <h1 className="hero-title">
            Predicting Customer Churn<br />Before It Happens, Instantly
          </h1>
          <p className="hero-desc">
            An intelligent customer retention platform powered by a tuned Random Forest classifier trained on 7,043 telecom accounts. Evaluate contract types, service bundles, and billing profiles to identify churn risk in real time.
          </p>
          <div className="hero-ctas">
            <a href="#demo" className="btn btn-primary">
              <i className="fas fa-terminal" /> Launch Prediction Console
            </a>
            <a href="#cohorts" className="btn btn-secondary">
              <i className="fas fa-users" /> Explore Customer Cohorts
            </a>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="section-container" id="features">
          <div className="section-header">
            <span className="section-tag">System Features</span>
            <h2 className="section-title">Platform Capabilities</h2>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "fa-sliders-h",
                name: "Real-Time Risk Scoring",
                desc: "Send 19 demographic, account, and service parameters to the Flask REST inference engine and receive real-time churn probability and risk tier classification in milliseconds.",
              },
              {
                icon: "fa-shield-alt",
                name: "Leak-Free Preprocessing",
                desc: "Preprocessed with Scikit-learn OneHotEncoder and StandardScaler fit exclusively on training data, preventing data leakage and guaranteeing deployment fidelity.",
              },
              {
                icon: "fa-bullseye",
                name: "Recall-Optimized Classification",
                desc: "Engineered with balanced class weights to maximize customer churn detection (79% recall), reducing false negatives and protecting valuable customer lifetime value.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.name}>
                <div className="feature-icon">
                  <i className={`fas ${f.icon}`} />
                </div>
                <h4 className="feature-name">{f.name}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo Console ── */}
        <section className="section-container" id="demo">
          <div className="section-header">
            <span className="section-tag">Interactive Environment</span>
            <h2 className="section-title">Customer Churn Prediction Console</h2>
          </div>

          <div className="demo-panel">
            <div className="demo-tabs-bar">
              <button
                className={`demo-tab-btn ${tab === "predict" ? "active" : ""}`}
                onClick={() => setTab("predict")}
              >
                <i className="fas fa-user-check" /> Account Attributes &amp; Scoring
              </button>
              <button
                className={`demo-tab-btn ${tab === "pipeline" ? "active" : ""}`}
                onClick={() => setTab("pipeline")}
              >
                <i className="fas fa-route" /> ML Pipeline Architecture
              </button>
            </div>

            <div className="demo-pane-body">
              {tab === "predict" && (
                <div className="workspace-grid">
                  {/* Left Column: Input Form */}
                  <div className="workspace-card">
                    <div className="workspace-card-title">
                      <i className="fas fa-sliders-h" /> Customer Account Profile
                    </div>

                    {/* Presets */}
                    <div className="presets-bar">
                      <span className="presets-label"><i className="fas fa-bolt" /> Presets:</span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => applyPreset(COHORT_SAMPLES[0].data)}
                      >
                        High Risk
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => applyPreset(COHORT_SAMPLES[2].data)}
                      >
                        Medium Risk
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => applyPreset(COHORT_SAMPLES[4].data)}
                      >
                        Low Risk
                      </button>
                    </div>

                    {/* Section 1: Demographics */}
                    <div className="form-section-title">
                      <i className="fas fa-user" /> Demographics &amp; Tenure
                    </div>
                    <div className="form-grid-3">
                      <div className="form-field">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          value={formData.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Senior Citizen</label>
                        <select
                          className="form-select"
                          value={formData.SeniorCitizen}
                          onChange={(e) => handleInputChange("SeniorCitizen", e.target.value)}
                        >
                          <option value={0}>No (0)</option>
                          <option value={1}>Yes (1)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Partner</label>
                        <select
                          className="form-select"
                          value={formData.Partner}
                          onChange={(e) => handleInputChange("Partner", e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Dependents</label>
                        <select
                          className="form-select"
                          value={formData.Dependents}
                          onChange={(e) => handleInputChange("Dependents", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Tenure (Months)</label>
                        <input
                          type="number"
                          min="0"
                          max="72"
                          className="form-input"
                          value={formData.tenure}
                          onChange={(e) => handleInputChange("tenure", e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Phone Service</label>
                        <select
                          className="form-select"
                          value={formData.PhoneService}
                          onChange={(e) => handleInputChange("PhoneService", e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    {/* Section 2: Services */}
                    <div className="form-section-title">
                      <i className="fas fa-wifi" /> Internet &amp; Value-Added Services
                    </div>
                    <div className="form-grid-3">
                      <div className="form-field">
                        <label className="form-label">Internet Service</label>
                        <select
                          className="form-select"
                          value={formData.InternetService}
                          onChange={(e) => handleInputChange("InternetService", e.target.value)}
                        >
                          <option value="Fiber optic">Fiber optic</option>
                          <option value="DSL">DSL</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Multiple Lines</label>
                        <select
                          className="form-select"
                          value={formData.MultipleLines}
                          onChange={(e) => handleInputChange("MultipleLines", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No phone service">No phone service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Online Security</label>
                        <select
                          className="form-select"
                          value={formData.OnlineSecurity}
                          onChange={(e) => handleInputChange("OnlineSecurity", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Online Backup</label>
                        <select
                          className="form-select"
                          value={formData.OnlineBackup}
                          onChange={(e) => handleInputChange("OnlineBackup", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Device Protection</label>
                        <select
                          className="form-select"
                          value={formData.DeviceProtection}
                          onChange={(e) => handleInputChange("DeviceProtection", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Tech Support</label>
                        <select
                          className="form-select"
                          value={formData.TechSupport}
                          onChange={(e) => handleInputChange("TechSupport", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Streaming TV</label>
                        <select
                          className="form-select"
                          value={formData.StreamingTV}
                          onChange={(e) => handleInputChange("StreamingTV", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Streaming Movies</label>
                        <select
                          className="form-select"
                          value={formData.StreamingMovies}
                          onChange={(e) => handleInputChange("StreamingMovies", e.target.value)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="No internet service">No internet service</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Contract Type</label>
                        <select
                          className="form-select"
                          value={formData.Contract}
                          onChange={(e) => handleInputChange("Contract", e.target.value)}
                        >
                          <option value="Month-to-month">Month-to-month</option>
                          <option value="One year">One year</option>
                          <option value="Two year">Two year</option>
                        </select>
                      </div>
                    </div>

                    {/* Section 3: Billing */}
                    <div className="form-section-title">
                      <i className="fas fa-credit-card" /> Billing &amp; Payment
                    </div>
                    <div className="form-grid-2">
                      <div className="form-field">
                        <label className="form-label">Paperless Billing</label>
                        <select
                          className="form-select"
                          value={formData.PaperlessBilling}
                          onChange={(e) => handleInputChange("PaperlessBilling", e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Payment Method</label>
                        <select
                          className="form-select"
                          value={formData.PaymentMethod}
                          onChange={(e) => handleInputChange("PaymentMethod", e.target.value)}
                        >
                          <option value="Electronic check">Electronic check</option>
                          <option value="Mailed check">Mailed check</option>
                          <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                          <option value="Credit card (automatic)">Credit card (automatic)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Monthly Charges ($)</label>
                        <input
                          type="number"
                          step="0.05"
                          className="form-input"
                          value={formData.MonthlyCharges}
                          onChange={(e) => handleInputChange("MonthlyCharges", e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Total Charges ($)</label>
                        <input
                          type="number"
                          step="0.05"
                          className="form-input"
                          value={formData.TotalCharges}
                          onChange={(e) => handleInputChange("TotalCharges", e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={runPrediction}
                      disabled={loading}
                      style={{ width: "100%", marginTop: ".5rem" }}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin" /> Evaluating Churn Risk...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bolt" /> Predict Customer Churn
                        </>
                      )}
                    </button>

                    {error && (
                      <div className="error-bar">
                        <i className="fas fa-exclamation-circle" /> {error}
                      </div>
                    )}

                    {/* Console Logs */}
                    <div>
                      <div className="console-header-bar">
                        <span className="console-tab-tag">
                          <i className="fas fa-terminal" /> Inference Telemetry &amp; Logs
                        </span>
                        <span style={{ fontSize: ".65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          STDOUT
                        </span>
                      </div>
                      <div className="logs-box" ref={logsRef}>
                        {logs.map((l, i) => (
                          <div key={i} className={typeof l === "object" ? l.cls : ""}>
                            {typeof l === "object" ? l.msg : l}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Output */}
                  <div className="workspace-card">
                    <div className="workspace-card-title">
                      <i className="fas fa-tachometer-alt" /> Model Decision &amp; Scoring
                    </div>

                    {predictionResult && (
                      <div className="success-bar">
                        <span>
                          <i className="fas fa-check-circle" /> Inference complete via Random Forest
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem" }}>
                          HTTP 200 OK
                        </span>
                      </div>
                    )}

                    <div className="output-card-box">
                      {predictionResult ? (
                        <>
                          <span
                            className={`risk-tag ${
                              predictionResult.churn_probability >= 70
                                ? "risk-high"
                                : predictionResult.churn_probability >= 40
                                ? "risk-medium"
                                : "risk-low"
                            }`}
                          >
                            <i
                              className={`fas ${
                                predictionResult.prediction === 1
                                  ? "fa-user-times"
                                  : "fa-user-check"
                              }`}
                            />
                            {predictionResult.prediction === 1 ? "High Churn Risk" : "Likely Retained"}
                          </span>

                          <div
                            className="prob-score-huge"
                            style={{
                              color:
                                predictionResult.churn_probability >= 70
                                  ? "var(--danger)"
                                  : predictionResult.churn_probability >= 40
                                  ? "var(--warning)"
                                  : "var(--success)",
                            }}
                          >
                            {predictionResult.churn_probability}%
                          </div>

                          <span style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
                            Predicted Churn Probability
                          </span>

                          <div className="prob-meter-bar">
                            <div
                              className="prob-meter-fill"
                              style={{
                                width: `${predictionResult.churn_probability}%`,
                                background:
                                  predictionResult.churn_probability >= 70
                                    ? "var(--danger)"
                                    : predictionResult.churn_probability >= 40
                                    ? "var(--warning)"
                                    : "var(--success)",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: "3rem 1rem", color: "var(--text-muted)" }}>
                          <i className="fas fa-chart-pie" style={{ fontSize: "2.5rem", marginBottom: "1rem", display: "block" }} />
                          <p style={{ fontSize: ".85rem" }}>
                            Configure customer profile attributes and click <strong>Predict Customer Churn</strong> to view real-time score.
                          </p>
                        </div>
                      )}
                    </div>

                    {loading && (
                      <div>
                        <div
                          style={{
                            fontSize: ".7rem",
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-display)",
                            marginBottom: ".35rem",
                          }}
                        >
                          Processing feature transformations &amp; tree votes...
                        </div>
                        <div className="progress-meter">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Insight Cards */}
                    <div className="insight-grid">
                      <div className="insight-card">
                        <div className="insight-title">Contract Factor</div>
                        <div className="insight-val">{formData.Contract}</div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-title">Monthly Commitment</div>
                        <div className="insight-val">${formData.MonthlyCharges}/mo</div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-title">Customer Tenure</div>
                        <div className="insight-val">{formData.tenure} Months</div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-title">Internet Type</div>
                        <div className="insight-val">{formData.InternetService}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ML Pipeline */}
              {tab === "pipeline" && (
                <div className="workspace-grid">
                  <div className="workspace-card">
                    <div className="workspace-card-title">
                      <i className="fas fa-route" /> Inference Dataflow
                    </div>
                    {[
                      ["Input JSON Payload", "19 raw features validated against expected schema."],
                      ["One-Hot Encoding", "16 categorical features encoded via encoder.pkl (drop='first', handle_unknown='ignore')."],
                      ["Standard Scaling", "Numerical features (tenure, MonthlyCharges, TotalCharges) scaled via scaler.pkl."],
                      ["Feature Reindexing", "Exact column ordering alignment against model.feature_names_in_."],
                      ["Random Forest Scoring", "200 decision trees compute class votes with balanced weighting."],
                      ["Risk Classification", "Returns binary classification (0/1), class label, and calibrated percentage probability."],
                    ].map(([step, desc], i) => (
                      <div className="pipeline-step" key={i}>
                        <div className="step-num">{i + 1}</div>
                        <div>
                          <strong style={{ color: "#fff" }}>{step}</strong> — {desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="workspace-card">
                    <div className="workspace-card-title">
                      <i className="fas fa-code-branch" /> API Endpoints
                    </div>
                    {[
                      {
                        method: "GET",
                        cls: "method-get",
                        path: "/",
                        desc: "Health check verifying Flask API is up and operational.",
                      },
                      {
                        method: "POST",
                        cls: "method-post",
                        path: "/predict",
                        desc: "Accepts JSON payload with 19 customer features → returns churn label & probability.",
                      },
                    ].map((ep) => (
                      <div className="api-card" key={ep.path} style={{ marginBottom: ".65rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
                          <span className={`method-badge ${ep.cls}`}>{ep.method}</span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".8rem", color: "#fff" }}>
                            {ep.path}
                          </span>
                        </div>
                        <p style={{ fontSize: ".75rem", color: "var(--text-secondary)", marginTop: ".35rem" }}>
                          {ep.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Customer Cohorts ── */}
        <section className="section-container" id="cohorts">
          <div className="section-header">
            <span className="section-tag">Sample Profiles</span>
            <h2 className="section-title">Customer Cohort Samples</h2>
            <p className="section-desc">
              Explore prototypical customer profiles across risk tiers. Click any profile to inspect full details or load it into the prediction console.
            </p>
          </div>

          <div className="gallery-filter-row">
            <div className="filter-chips">
              {["all", "High Risk", "Medium Risk", "Low Risk"].map((f) => (
                <span
                  key={f}
                  className={`filter-chip ${galleryFilter === f ? "active" : ""}`}
                  onClick={() => setGalleryFilter(f)}
                >
                  {f === "all" ? "All Cohorts" : f}
                </span>
              ))}
            </div>
          </div>

          <div className="gallery-grid">
            {cohortItems.map((s) => (
              <div
                className="gallery-card"
                key={s.id}
                onClick={() => setModal(s)}
              >
                <div className="gallery-card-header">
                  <span className={`gallery-badge ${s.riskClass}`}>{s.category}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".85rem", fontWeight: 700, color: "#fff" }}>
                    {s.prob} Churn
                  </span>
                </div>
                <div className="gallery-card-body">
                  <div className="gallery-card-label">{s.label}</div>
                  <div className="gallery-card-row">
                    <span>Contract:</span>
                    <span style={{ color: "#fff" }}>{s.contract}</span>
                  </div>
                  <div className="gallery-card-row">
                    <span>Internet:</span>
                    <span style={{ color: "#fff" }}>{s.internet}</span>
                  </div>
                  <div className="gallery-card-row">
                    <span>Tenure:</span>
                    <span style={{ color: "#fff" }}>{s.tenure}</span>
                  </div>
                  <div className="gallery-card-row">
                    <span>Monthly Spend:</span>
                    <span style={{ color: "#fff" }}>{s.charges}</span>
                  </div>
                  <div className="gallery-card-cta">Click to inspect &amp; test profile →</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ML Metrics & Telemetry ── */}
        <section className="section-container" id="metrics">
          <div className="section-header">
            <span className="section-tag">Model Diagnostics</span>
            <h2 className="section-title">Random Forest Classifier Telemetry</h2>
            <p className="section-desc">
              Model specifications, hyperparameter configuration, and test-set performance metrics for the ChurnPulse engine.
            </p>
          </div>

          <div className="telemetry-layout">
            <div className="specs-column">
              {/* Specs */}
              <div className="spec-card">
                <div className="spec-card-header">
                  <i className="fas fa-microchip spec-icon" />
                  <span className="spec-title">Algorithm Specifications</span>
                </div>
                <div className="spec-list">
                  {[
                    ["Algorithm", "RandomForestClassifier"],
                    ["Estimators (Trees)", "200"],
                    ["Max Depth", "10"],
                    ["Min Samples Leaf", "2"],
                    ["Class Weight", "balanced"],
                    ["Validation Set Size", "1,409 (20% holdout)"],
                    ["Total Dataset Records", "7,043 customers"],
                    ["Inference Latency", "< 30ms"],
                  ].map(([l, v]) => (
                    <div className="spec-row" key={l}>
                      <span className="spec-label">{l}</span>
                      <span className="spec-value">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bars */}
              <div className="spec-card">
                <div className="spec-card-header">
                  <i className="fas fa-chart-bar spec-icon" />
                  <span className="spec-title">Tuned Random Forest Metrics</span>
                </div>
                <div className="bar-list">
                  {[
                    { label: "Churn Recall (Sensitivity)", val: "0.79", pct: "79%", cls: "fill-teal", color: "var(--accent-teal)" },
                    { label: "Accuracy", val: "0.7630", pct: "76.3%", cls: "fill-sky", color: "var(--accent-sky)" },
                    { label: "F1-Score (Churn)", val: "0.64", pct: "64%", cls: "fill-green", color: "var(--success)" },
                    { label: "Precision (Churn)", val: "0.54", pct: "54%", cls: "fill-teal", color: "#fff" },
                  ].map((b) => (
                    <div className="bar-item" key={b.label}>
                      <div className="bar-label-row">
                        <span>{b.label}</span>
                        <span style={{ color: b.color, fontFamily: "var(--font-mono)" }}>{b.val}</span>
                      </div>
                      <div className="bar-track">
                        <div className={`bar-fill ${b.cls}`} style={{ width: b.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: ".95rem", color: "#fff" }}>
                    Algorithm Benchmark
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-secondary)", marginTop: ".2rem" }}>
                    Logistic Regression vs. Tuned LR vs. Tuned Random Forest
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <span className="status-dot" />
                  <span style={{ fontSize: ".7rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    Holdout Test
                  </span>
                </div>
              </div>

              <div className="chart-canvas-wrap">
                <canvas ref={chartRef} />
              </div>

              <div className="metric-mini-cards">
                {[
                  { val: "76.3%", label: "Accuracy", color: "var(--accent-teal)" },
                  { val: "79.0%", label: "Churn Recall", color: "var(--accent-sky)" },
                  { val: "0.64", label: "F1-Score", color: "var(--success)" },
                  { val: "200", label: "Trees", color: "#a78bfa" },
                ].map((m) => (
                  <div className="metric-mini" key={m.label}>
                    <div className="metric-mini-val" style={{ color: m.color }}>{m.val}</div>
                    <div className="metric-mini-label">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section-container" id="faq">
          <div className="section-header">
            <span className="section-tag">Help Center</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {[
              [
                "Why is Random Forest tuned for Recall rather than raw Accuracy?",
                "In subscription business models, failing to detect a churner (false negative) costs significant customer lifetime value. Achieving 79% recall ensures retention teams identify almost 8 out of 10 departing customers early.",
              ],
              [
                "How does the model handle categorical features?",
                "Categorical variables (e.g., Contract type, Internet service, Payment method) are transformed using OneHotEncoder with drop='first' and handle_unknown='ignore' to prevent multicollinearity and production errors.",
              ],
              [
                "How do I run the backend API locally?",
                "In the backend folder, run: 'pip install -r requirements.txt' followed by 'python app.py'. The API will start on port 5000.",
              ],
              [
                "What dataset was used for training?",
                "The system was trained and evaluated on the Telco Customer Churn dataset comprising 7,043 customer accounts with demographic, service, and contract attributes.",
              ],
              [
                "Can new customer features be added to the inference pipeline?",
                "Yes. By retraining the pipeline in the Jupyter notebook (notebooks/01_data_exploration.ipynb) and saving the resulting encoder, scaler, and model pickle files, the Flask API automatically synchronizes with new features.",
              ],
            ].map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary className="faq-summary">{q}</summary>
                <div className="faq-body">{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#0d9488,#0ea5e9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "1rem",
                  }}
                >
                  <i className="fas fa-chart-line" />
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#fff" }}>
                  ChurnPulse
                </span>
              </div>
              <p className="footer-desc">
                Machine learning-powered customer churn prediction engine built with Scikit-learn, Flask, and React 19.
              </p>
              <div className="footer-socials">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                  <i className="fab fa-github" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                  <i className="fab fa-linkedin" />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigation</h4>
              <ul className="footer-links">
                {[
                  ["Capabilities", "#features"],
                  ["Live Console", "#demo"],
                  ["Customer Cohorts", "#cohorts"],
                  ["Model Telemetry", "#metrics"],
                  ["FAQ", "#faq"],
                ].map(([l, h]) => (
                  <li key={l}>
                    <a href={h}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Tech Stack</h4>
              {[
                ["fa-cube", "Scikit-learn"],
                ["fa-tree", "Random Forest"],
                ["fa-server", "Flask"],
                ["fab fa-react", "React 19"],
                ["fa-bolt", "Vite"],
                ["fa-database", "Pandas"],
              ].map(([icon, name]) => (
                <span className="tech-pill" key={name}>
                  <i className={`${icon.startsWith("fab") ? "fab " : "fas "}${icon}`} />
                  {name}
                </span>
              ))}
            </div>

            <div className="footer-col">
              <h4>Creator</h4>
              <div className="team-card">
                <div className="team-row">
                  <div className="team-avatar">
                    <i className="fas fa-user" />
                  </div>
                  <div>
                    <div className="team-name">Machine Learning Engineer</div>
                    <div className="team-role">AI / ML · Full-Stack Developer</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: ".8rem", color: "var(--text-secondary)", marginTop: ".85rem", lineHeight: 1.5 }}>
                Dataset:{" "}
                <a
                  href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-teal)", textDecoration: "none" }}
                >
                  Kaggle Telco Customer Churn
                </a>
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 ChurnPulse · Customer Churn Prediction &amp; Retention AI</span>
            <span>Built with <strong style={{ color: "var(--accent-teal)" }}>Scikit-learn &amp; React</strong></span>
          </div>
        </footer>
      </div>

      {/* ── Modal for Cohort Profile ── */}
      {modal && (
        <div
          className="modal-overlay active"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="modal-body">
            <div className="modal-top-bar">
              <span className="modal-heading">{modal.label}</span>
              <button className="modal-close" onClick={() => setModal(null)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`risk-tag ${modal.category === "High Risk" ? "risk-high" : modal.category === "Medium Risk" ? "risk-medium" : "risk-low"}`}>
                  {modal.category}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  Historical Churn: {modal.prob}
                </span>
              </div>

              <p style={{ fontSize: ".85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {modal.notes}
              </p>

              <div className="insight-grid" style={{ marginTop: ".5rem" }}>
                <div className="insight-card">
                  <div className="insight-title">Contract</div>
                  <div className="insight-val">{modal.contract}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-title">Internet Service</div>
                  <div className="insight-val">{modal.internet}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-title">Tenure</div>
                  <div className="insight-val">{modal.tenure}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-title">Monthly Charges</div>
                  <div className="insight-val">{modal.charges}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    applyPreset(modal.data);
                    setModal(null);
                    window.location.hash = "#demo";
                  }}
                >
                  <i className="fas fa-arrow-right" /> Load Profile into Live Console
                </button>
                <button className="btn btn-secondary" onClick={() => setModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div className={`toast ${toast.type} ${toast.show ? "show" : ""}`}>
        <i className={toast.type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle"} />
        <span>{toast.msg}</span>
      </div>
    </>
  );
}

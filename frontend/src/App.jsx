
import { useState } from "react";
import {
  Activity,
  Users,
  TrendingUp,
  ShieldCheck,
  Zap,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  CreditCard,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BrainCircuit,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/predict";

const initialForm = {
  gender: "Female",
  SeniorCitizen: "0",
  Partner: "Yes",
  Dependents: "No",
  tenure: "5",
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
  MonthlyCharges: "75.50",
  TotalCharges: "377.50",
};

const fields = [
  {
    title: "Personal Information",
    icon: UserRound,
    items: [
      { name: "gender", label: "Gender", options: ["Female", "Male"] },
      { name: "SeniorCitizen", label: "Senior Citizen", options: ["0", "1"] },
      { name: "Partner", label: "Has Partner", options: ["Yes", "No"] },
      { name: "Dependents", label: "Dependents", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Service Information",
    icon: Wifi,
    items: [
      { name: "PhoneService", label: "Phone Service", options: ["Yes", "No"] },
      {
        name: "MultipleLines",
        label: "Multiple Lines",
        options: ["Yes", "No", "No phone service"],
      },
      {
        name: "InternetService",
        label: "Internet Service",
        options: ["DSL", "Fiber optic", "No"],
      },
      ...[
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
      ].map((name) => ({
        name,
        label: name.replace(/([A-Z])/g, " $1"),
        options: ["Yes", "No", "No internet service"],
      })),
    ],
  },
  {
    title: "Account Information",
    icon: CreditCard,
    items: [
      {
        name: "Contract",
        label: "Contract Type",
        options: ["Month-to-month", "One year", "Two year"],
      },
      {
        name: "PaperlessBilling",
        label: "Paperless Billing",
        options: ["Yes", "No"],
      },
      {
        name: "PaymentMethod",
        label: "Payment Method",
        options: [
          "Electronic check",
          "Mailed check",
          "Bank transfer (automatic)",
          "Credit card (automatic)",
        ],
      },
    ],
  },
];

const numericFields = [
  { name: "tenure", label: "Tenure (Months)", min: 0, max: 72 },
  { name: "MonthlyCharges", label: "Monthly Charges ($)", min: 0 },
  { name: "TotalCharges", label: "Total Charges ($)", min: 0 },
];

const featureData = [
  { name: "Tenure", value: 16.9 },
  { name: "Total Charges", value: 14.3 },
  { name: "Two Year Contract", value: 11.3 },
  { name: "Monthly Charges", value: 9.8 },
  { name: "Fiber Optic", value: 6.6 },
  { name: "Electronic Check", value: 5.3 },
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      ...form,
      SeniorCitizen: Number(form.SeniorCitizen),
      tenure: Number(form.tenure),
      MonthlyCharges: Number(form.MonthlyCharges),
      TotalCharges: Number(form.TotalCharges),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Cannot connect to Flask server. Please check whether the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  const isChurn = result?.result === "Churn";

  return (
    <div className="min-h-screen bg-[#09090f] text-slate-100">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-[#101019] p-6 lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="rounded-xl bg-blue-600 p-3">
            <BrainCircuit size={25} />
          </div>
          <div>
            <h1 className="text-lg font-bold">ChurnAI</h1>
            <p className="text-xs text-slate-500">Prediction Platform</p>
          </div>
        </div>

        <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <div className="flex items-center gap-3 rounded-xl bg-blue-600/15 px-4 py-3 text-blue-400">
          <Activity size={19} />
          <span className="font-medium">Dashboard</span>
        </div>

        <div className="mt-4 flex items-center gap-3 px-4 py-3 text-slate-400">
          <Users size={19} />
          Customer Analysis
        </div>

        <div className="mt-4 flex items-center gap-3 px-4 py-3 text-slate-400">
          <TrendingUp size={19} />
          Model Insights
        </div>

        <div className="absolute bottom-8 left-6 right-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            ML Model Ready
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tuned Random Forest
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-5 sm:p-8 lg:ml-64 lg:p-10">

        {/* Header */}
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Workspace / Overview
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Customer Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Predict customer churn using machine learning.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-xl border border-white/10 p-3 text-slate-400">
              <Bell size={19} />
            </button>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 p-2">
              <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400">
                <UserRound size={19} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-slate-500">ML Dashboard</p>
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Model Accuracy",
              value: "76.30%",
              icon: ShieldCheck,
              color: "text-blue-400",
            },
            {
              title: "Churn Recall",
              value: "79%",
              icon: TrendingUp,
              color: "text-purple-400",
            },
            {
              title: "Churn Precision",
              value: "54%",
              icon: Users,
              color: "text-orange-400",
            },
            {
              title: "Churn F1 Score",
              value: "64%",
              icon: Zap,
              color: "text-emerald-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#12121d] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.title}</p>
                <item.icon className={item.color} size={21} />
              </div>
              <h3 className="mt-4 text-3xl font-bold">{item.value}</h3>
              <p className="mt-2 text-xs text-slate-500">
                Tuned Random Forest
              </p>
            </div>
          ))}

        </section>

        {/* Prediction Form */}
        <section className="grid gap-6 xl:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#12121d] p-6 xl:col-span-2">

            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">Customer Information</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Enter customer details to predict churn.
                </p>
              </div>
              <span className="rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-400">
                19 Features
              </span>
            </div>

            <form onSubmit={handleSubmit}>

              {fields.map((section) => (
                <div key={section.title} className="mb-8">
                  <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                    <section.icon size={19} className="text-blue-400" />
                    <h4 className="font-semibold">{section.title}</h4>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {section.items.map((field) => (
                      <div key={field.name}>
                        <label className="mb-2 block text-sm text-slate-400">
                          {field.label}
                        </label>
                        <select
                          value={form[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#1b1b29] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                        >
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {field.name === "SeniorCitizen"
                                ? option === "1" ? "Yes" : "No"
                                : option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mb-8">
                <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                  <CreditCard size={19} className="text-blue-400" />
                  <h4 className="font-semibold">Financial & Tenure Details</h4>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {numericFields.map((field) => (
                    <div key={field.name}>
                      <label className="mb-2 block text-sm text-slate-400">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.name === "tenure" ? "1" : "0.01"}
                        required
                        value={form[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#1b1b29] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  <AlertTriangle className="mr-2 inline" size={17} />
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={19} />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Search size={19} />
                      Predict Customer Churn
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-4 text-slate-300 transition hover:bg-white/5"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Prediction Result */}
          <div className="flex flex-col gap-6">

            <div className="rounded-2xl border border-white/10 bg-[#12121d] p-6">
              <h3 className="text-lg font-bold">Prediction Result</h3>
              <p className="mt-1 text-sm text-slate-400">
                Machine learning analysis
              </p>

              {!result && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                    <BrainCircuit size={38} />
                  </div>
                  <h4 className="font-semibold">Awaiting Prediction</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    Fill in the customer details and click predict.
                  </p>
                </div>
              )}

              {result && (
                <div className="py-8 text-center">
                  <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
                    isChurn
                      ? "bg-red-500/10 text-red-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {isChurn
                      ? <AlertTriangle size={38} />
                      : <CheckCircle2 size={38} />
                    }
                  </div>

                  <p className="text-sm text-slate-400">
                    Prediction Status
                  </p>
                  <h3 className={`mt-2 text-3xl font-bold ${
                    isChurn ? "text-red-400" : "text-emerald-400"
                  }`}>
                    {result.result}
                  </h3>

                  <div className="mt-8 rounded-xl bg-white/5 p-5">
                    <p className="text-sm text-slate-400">
                      Churn Probability
                    </p>
                    <h2 className="mt-2 text-4xl font-bold">
                      {Number(result.churn_probability).toFixed(2)}%
                    </h2>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          isChurn ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(0, Number(result.churn_probability)))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-slate-500">
                    Prediction generated by Tuned Random Forest.
                  </p>
                </div>
              )}
            </div>

            {/* Feature Importance */}
            <div className="rounded-2xl border border-white/10 bg-[#12121d] p-6">
              <h3 className="text-lg font-bold">Top Features</h3>
              <p className="mt-1 text-sm text-slate-400">
                Model feature importance
              </p>

              <div className="mt-7 space-y-5">
                {featureData.map((feature) => (
                  <div key={feature.name}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-300">{feature.name}</span>
                      <span className="text-slate-400">
                        {feature.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${feature.value / 16.9 * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs text-slate-500">
                Based on the trained Random Forest model.
              </p>
            </div>

          </div>
        </section>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          Customer Churn Prediction Platform · Powered by Machine Learning
        </footer>

      </main>
    </div>
  );
}

export default App;

# Python & Machine Learning Architecture: Atmospheric AI System

A comprehensive blueprint for building the complete Atmospheric AI weather forecasting and research defense platform using **Python (FastAPI, Scikit-learn, PyTorch/TensorFlow, XGBoost)** and an interactive web frontend.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following technical choices were confirmed for the Python implementation:
> - **Backend Architecture**: FastAPI RESTful API server with asynchronous endpoints (`uvicorn`), typed Pydantic models, and CORS integration.
> - **Machine Learning Engine**: Pre-trained model artifacts serialized via `joblib` (Scikit-learn, XGBoost) and PyTorch (`.pt`) / TensorFlow/Keras (`.keras`) state dicts for deep recurrent LSTM networks, with a dedicated Python stacking meta-learner.
> - **Frontend Interface**: Modern reactive client interface consuming the FastAPI REST endpoints in real-time, matching the Natural Tones scientific telemetry design.
> - **AI Weather Grounding**: Server-side integration with the official `@google/genai` or Gemini Python SDK (`google-genai`) with Google Search Grounding for real-time synoptic reports.

---

## 1. Overview & Core Concept

- **What It Does**: Transposes the entire mathematical forecasting pipeline into a production-grade Python ML ecosystem. The Python server loads trained models (Ordinary Least Squares, Random Forest, XGBoost, LSTM, and Hybrid Stacking Ensembles) and exposes low-latency inference, SHAP/Gini feature importance calculations, 7-day multi-horizon time-series generation, early-warning risk detection, and Google Gemini synoptic reporting.
- **Target Audience**: TY B.Tech Computer Engineering & AI/Data Science students, capstone evaluators, meteorological researchers, and developers seeking an end-to-end Python ML deployment.
- **Key Value**: Provides authentic Python code matching academic viva requirements—including actual training scripts, model serialization, FastAPI route definitions, SHAP explanations, and defense documentation.

---

## 2. System Architecture & Technical Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Interactive Web Frontend                        │
│   [City Presets]  [Synoptic Sliders]  [Architecture Switcher]          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON Payload
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FastAPI Python Backend (server.py)                 │
│                                                                        │
│  POST /api/predict          POST /api/forecast/7day                    │
│  GET  /api/models/benchmarks GET  /api/dataset/records                 │
│  POST /api/gemini/synoptic  POST /api/gemini/chat                      │
└───────────────────┬────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Python Machine Learning Inference Pipeline               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 1. Feature Preprocessing & Engineering (features.py)           │   │
│   │    - Dew Point Depression: (T - T_dew)                         │   │
│   │    - Barometric Pressure Deficit: (1013.25 - P)                │   │
│   │    - Standard Scaler (scaler.joblib)                           │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │ Preprocessed Tensor X             │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 2. Multi-Model Architecture Inference Suite                    │   │
│   │    ├─ Linear Regression    -> sklearn.linear_model.Ridge       │   │
│   │    ├─ Random Forest        -> sklearn.ensemble.RandomForest    │   │
│   │    ├─ XGBoost              -> xgboost.XGBRegressor / XGBClf    │   │
│   │    ├─ Deep Recurrent LSTM  -> torch.nn.Module (LSTMNet)        │   │
│   │    └─ Stacking Meta-Learner -> 0.46 * XGB + 0.54 * LSTM        │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │ Outputs                           │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 3. Meteorological Risk & SHAP Analytics Engine                 │   │
│   │    - Heat Index (Rothfusz equation)                            │   │
│   │    - Severe Rain / Flash Flood / Gale Warning Thresholds       │   │
│   │    - SHAP / TreeExplainer feature importance attribution       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Python File & Directory Hierarchy

When setting up the project locally with Python, the recommended repository structure is:

```
weather-prediction-ml-python/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application and route endpoints
│   │   ├── schemas.py              # Pydantic v2 validation models
│   │   ├── config.py               # Environment configuration (Gemini API keys, ports)
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── preprocessing.py    # Physics feature calculations (Dew depression, pressure deficit)
│   │   │   ├── models.py           # PyTorch LSTM network architecture class definition
│   │   │   ├── inference.py        # Model loading (joblib, torch) and prediction logic
│   │   │   └── risk_engine.py      # Heat index, squall alerts, flood risk thresholds
│   │   ├── data/
│   │   │   ├── cities.py           # Indian city synoptic presets (Pune, Mumbai, Delhi, etc.)
│   │   │   ├── benchmarks.py       # MAE, RMSE, R2, latency metrics for research paper
│   │   │   └── historical_sample.py# Historical station records & correlation matrix
│   │   └── services/
│   │       └── gemini_service.py   # Google GenAI SDK (search grounding & synoptic report)
│   ├── trained_models/             # Serialized pre-trained weights
│   │   ├── scaler.joblib           # StandardScaler weights
│   │   ├── linear_model.joblib     # Linear / Ridge regression model
│   │   ├── random_forest.joblib    # 100-estimator Random Forest
│   │   ├── xgboost_model.json      # Trained XGBoost Booster
│   │   └── lstm_weights.pt         # PyTorch bi-directional LSTM weights
│   ├── train.py                    # Standalone training script generating the artifacts
│   ├── requirements.txt            # Python dependencies
│   └── .env.example
├── frontend/                       # Web UI (React/Vite or standalone HTML5/Tailwind)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── api/                    # Client calls to FastAPI localhost:8000
│   └── package.json
└── README.md                       # TY B.Tech viva defense guide & setup instructions
```

---

## 4. Key Python Modules Specification

### A. Python Dependencies (`requirements.txt`)
```text
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
numpy>=1.26.0
pandas>=2.2.0
scikit-learn>=1.4.0
xgboost>=2.0.0
torch>=2.2.0
google-genai>=1.0.0
python-dotenv>=1.0.0
shap>=0.45.0
```

### B. Machine Learning Architecture (PyTorch LSTM + Scikit-Learn Stacking)
- **PyTorch LSTM Definition (`backend/app/ml/models.py`)**:
  - Bi-directional 2-layer LSTM with hidden dimension 64, dropout 0.2, followed by a linear projection layer.
  - Receives sequential $(N, L, D)$ moisture and barometric pressure sequences ($L=72$ hours, $D=8$ features).
- **XGBoost Regressor (`xgboost_model.json`)**:
  - 100 boosted trees with `max_depth=5`, `learning_rate=0.05`, and `subsample=0.8`.
- **Hybrid Meta-Learner (`backend/app/ml/inference.py`)**:
  - Stacking meta-regressor combining $0.46 \cdot \hat{y}_{\text{XGB}} + 0.54 \cdot \hat{y}_{\text{LSTM}}$, with residual moisture gate adjustments.

### C. FastAPI Endpoints (`backend/app/main.py`)
- `POST /api/predict`: Takes current synoptic parameters (`temperature`, `humidity`, `pressure`, `wind_speed`, `dew_point`, `cloud_cover`, `prev_day_rain`), executes the requested model, and returns temperature, rain probability, confidence, SHAP importance, and risk alerts.
- `POST /api/forecast/7day`: Iteratively projects continuous time-series forecasts across a 7-day multi-horizon window.
- `GET /api/models/benchmarks`: Returns quantitative empirical metrics (MAE, RMSE, $R^2$, accuracy, latency).
- `POST /api/gemini/synoptic`: Calls Gemini 3.7 Flash for deep meteorological synthesis.
- `POST /api/gemini/chat`: Grounded meteorological assistant endpoint with Google Search grounding.

---

## 5. Execution & Delivery Plan

1. **Provide Complete Python Code Samples**:
   - Provide the complete `train.py` training & export script.
   - Provide the FastAPI server (`backend/app/main.py`) and Pydantic schemas.
   - Provide the PyTorch LSTM definition and inference engine (`inference.py`).
   - Provide the API client integration instructions so the frontend communicates seamlessly with FastAPI.
2. **Viva Defense Documentation**:
   - Provide standard academic defense questions and mathematical explanations (Taylor loss expansion, LSTM gated memory cells, dew point depression formula) formatted for TY B.Tech submission.

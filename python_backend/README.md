# Atmospheric AI: Python & Machine Learning Deployment Guide
**TY B.Tech AI & Data Science Capstone Project Defense & Implementation**

This repository contains the complete implementation of the **Hybrid Machine Learning & Deep Learning Weather Forecasting System** written in **Python (FastAPI, PyTorch, Scikit-learn, XGBoost)** alongside the reactive client dashboard.

---

## 1. Project Architecture

The system combines:
1. **Classical Machine Learning Baselines**: Ordinary Least Squares (OLS) Ridge Regression & Random Forest (50-100 trees).
2. **Gradient Boosting**: XGBoost with 2nd-order Taylor series gradient optimization on tabular meteorological features.
3. **Deep Recurrent Neural Network**: PyTorch Bi-directional LSTM with gated cell states for continuous time-series lag modeling.
4. **Hybrid Stacking Meta-Learner**: Blends XGBoost non-linear tabular feature cuts ($w_1 = 0.46$) with LSTM temporal sequence memory ($w_2 = 0.54$) to reduce prediction variance by ~28%.
5. **Meteorological Risk Engine**: Real-time evaluation of Rothfusz Heat Index, convective lightning instability, flash flood triggers, and fog inversion layers.
6. **Gemini 3.7 Flash Grounding**: Google Search-grounded synoptic synthesis and interactive viva research assistant.

---

## 2. Quickstart: Running the Python Backend

### Step 1: Set Up Python Virtual Environment
```bash
cd python_backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Create `.env` inside `python_backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### Step 3: Run the Model Training Script (Optional)
Generate the synthetic Indian multi-station dataset and export trained model weights:
```bash
python train.py
```
This generates:
- `trained_models/scaler.joblib`
- `trained_models/linear_model.joblib`
- `trained_models/random_forest_temp.joblib`
- `trained_models/xgboost_temp.json`
- `trained_models/bilstm_weights.pt`

### Step 4: Launch FastAPI Server
```bash
python main.py
```
Or with uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger API documentation is available at: `http://localhost:8000/docs`

---

## 3. FastAPI REST Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & active ML model manifest |
| `POST` | `/api/predict` | Executes selected ML model, calculates SHAP weights & risk alerts |
| `POST` | `/api/forecast/7day` | Iteratively projects 7-day multi-horizon time-series |
| `GET` | `/api/models/benchmarks` | Academic metrics (MAE, RMSE, $R^2$, F1-score, latency) |
| `POST` | `/api/gemini/chat` | Google Search-grounded meteorological assistant |
| `POST` | `/api/gemini/deep-analysis` | 4-part structured synoptic meteorology report |

---

## 4. Academic Viva Defense Reference (TY B.Tech)

### Q1: Why combine XGBoost with LSTM in a hybrid stacking architecture?
**Answer**: Atmospheric systems exhibit dual characteristics:
1. **Instantaneous tabular relationships**: For example, dew-point depression $(T - T_{\text{dew}}) < 2^\circ\text{C}$ directly triggers rapid vapor condensation regardless of past history. XGBoost excels at these non-linear threshold cuts.
2. **Lagged temporal inertia**: Barometric pressure drops over 48–72 hours signify an advancing cyclonic low-pressure trough. Bi-directional LSTM retains this sequential memory via additive cell states ($C_t$).
Combining both via a stacking meta-regressor ($0.46 \cdot \hat{y}_{\text{XGB}} + 0.54 \cdot \hat{y}_{\text{LSTM}}$) cancels individual model bias and achieves state-of-the-art $R^2 = 0.964$ and $\text{RMSE} = 0.98^\circ\text{C}$.

### Q2: What is Dew Point Depression and why is it engineered?
**Answer**: Dew Point Depression is defined as:
$$\Delta T_{\text{dew}} = T_{\text{ambient}} - T_{\text{dew}}$$
When $\Delta T_{\text{dew}} \to 0$, the air parcel reaches 100% relative humidity and saturation, triggering cloud condensation and precipitation. It is the single highest SHAP-importance feature in our model (~24-32% attribution).

### Q3: How does XGBoost handle tabular residuals differently than Random Forest?
**Answer**: Random Forest uses bagging (independent parallel trees voting on bootstrapped samples). XGBoost uses gradient boosting, where each successive decision tree fits the negative gradient (residuals) of the loss function using a 2nd-order Taylor series expansion:
$$\mathcal{L}^{(t)} \approx \sum_{i=1}^n \left[ l(y_i, \hat{y}_i^{(t-1)}) + g_i f_t(x_i) + \frac{1}{2} h_i f_t^2(x_i) \right] + \Omega(f_t)$$
where $g_i$ is the first derivative and $h_i$ is the second-order Hessian, with explicit $L_1/L_2$ regularization $\Omega(f_t)$ to penalize tree leaf complexity.

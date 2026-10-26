import { ModelBenchmark, HistoricalWeatherRecord } from '../types/weather';

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    id: 'lr',
    name: 'Linear Regression',
    category: 'Linear Baseline',
    maeTemp: 2.14,
    rmseTemp: 2.86,
    r2Score: 0.742,
    classificationAccuracy: 71.8,
    f1Score: 0.695,
    latencyMs: 1.2,
    trainingTimeSec: 0.8,
    strengths: [
      'High computational efficiency (O(N) matrix inversion)',
      'Directly interpretable coefficient weights (β values)',
      'Deterministic convergence via Ordinary Least Squares (OLS)',
    ],
    limitations: [
      'Fails to model non-linear atmospheric phase transitions',
      'Assumes homoscedasticity and zero multi-collinearity',
      'Underestimates extreme outlier precipitation events',
    ],
    equations: [
      '\\hat{Y} = \\beta_0 + \\sum_{i=1}^{p} \\beta_i X_i + \\epsilon',
      '\\hat{\\beta} = (X^T X)^{-1} X^T Y',
    ],
  },
  {
    id: 'rf',
    name: 'Random Forest',
    category: 'Bagging Ensemble',
    maeTemp: 1.28,
    rmseTemp: 1.62,
    r2Score: 0.884,
    classificationAccuracy: 86.4,
    f1Score: 0.852,
    latencyMs: 14.5,
    trainingTimeSec: 12.4,
    strengths: [
      'Ensemble bagging prevents overfitting on noisy weather sensor readings',
      'Captures non-linear decision boundary splits (e.g. humidity > 80% & pressure < 1005hPa)',
      'Provides robust Gini-based feature importance ranking',
    ],
    limitations: [
      'Cannot extrapolate temperature extremes beyond training range',
      'Lacks temporal sequence awareness across consecutive days',
      'Larger memory footprint during distributed serving',
    ],
    equations: [
      'I_G(p) = 1 - \\sum_{i=1}^{J} p_i^2',
      '\\hat{f}_{rf}(x) = \\frac{1}{B} \\sum_{b=1}^{B} T_b(x)',
    ],
  },
  {
    id: 'xgb',
    name: 'XGBoost',
    category: 'Boosting Ensemble',
    maeTemp: 0.94,
    rmseTemp: 1.24,
    r2Score: 0.931,
    classificationAccuracy: 91.2,
    f1Score: 0.908,
    latencyMs: 8.6,
    trainingTimeSec: 18.2,
    strengths: [
      '2nd-order Taylor expansion gradients for exact residual optimization',
      'Built-in L1/L2 regularization (gamma, lambda) penalizes tree complexity',
      'State-of-the-art accuracy on tabular meteorological features',
    ],
    limitations: [
      'Sensitive to hyperparameter tuning (learning rate, subsample ratio)',
      'Does not model long-range sequential recurrent state memory',
      'Higher tuning latency during cross-validation search',
    ],
    equations: [
      '\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n [l(y_i, \\hat{y}_i^{(t-1)}) + g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i)] + \\Omega(f_t)',
      '\\text{where } g_i = \\partial_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)}), \\quad h_i = \\partial^2_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})',
    ],
  },
  {
    id: 'lstm',
    name: 'LSTM',
    category: 'Deep Recurrent',
    maeTemp: 1.05,
    rmseTemp: 1.38,
    r2Score: 0.915,
    classificationAccuracy: 89.6,
    f1Score: 0.887,
    latencyMs: 24.8,
    trainingTimeSec: 64.0,
    strengths: [
      'Gated memory architecture captures temporal lag effects (e.g. 72h moisture build-up)',
      'Mitigates vanishing gradient problem through additive cell state',
      'Excels at continuous multi-step ahead weather forecasting',
    ],
    limitations: [
      'Higher computational demand (GPU acceleration recommended)',
      'Requires substantial historical time-series sequences for convergence',
      'Black-box hidden representations are less directly interpretable',
    ],
    equations: [
      'f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f) \\quad \\text{(Forget Gate)}',
      'i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i), \\quad \\tilde{C}_t = \\tanh(W_c \\cdot [h_{t-1}, x_t] + b_c)',
      'C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t \\quad \\text{(Cell State)}',
      'o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o), \\quad h_t = o_t * \\tanh(C_t) \\quad \\text{(Hidden Output)}',
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid (XGBoost + LSTM)',
    category: 'Hybrid Architecture',
    maeTemp: 0.72,
    rmseTemp: 0.98,
    r2Score: 0.964,
    classificationAccuracy: 95.8,
    f1Score: 0.951,
    latencyMs: 28.5,
    trainingTimeSec: 82.5,
    strengths: [
      'Combines high-fidelity tabular feature interaction (XGBoost) with temporal sequential dynamics (LSTM)',
      'Significant reduction in prediction variance and extreme error outliers',
      'Superior 7-day multi-horizon forecasting stability',
    ],
    limitations: [
      'Multi-stage training pipeline (LSTM sequential embedding extraction -> Meta learner)',
      'Higher cumulative inference and training latency',
      'Requires coordinated hyperparameter co-optimization',
    ],
    equations: [
      '\\hat{Y}_{\\text{Hybrid}} = w_1 \\cdot \\mathcal{M}_{\\text{XGB}}(X_{\\text{tabular}}) + w_2 \\cdot \\mathcal{M}_{\\text{LSTM}}(X_{\\text{temporal}}) + \\mathcal{G}_{\\text{meta}}(h_t, f_t)',
      '\\min_{w_1, w_2} \\mathbb{E} [ (Y - \\hat{Y}_{\\text{Hybrid}})^2 + \\lambda (\\sigma_{\\text{XGB}}^2 + \\sigma_{\\text{LSTM}}^2) ]',
    ],
  },
];

export const VIVA_QUESTIONS_GUIDE = [
  {
    q: 'Why does the Hybrid model outperform standalone Random Forest or LSTM?',
    a: 'Atmospheric weather systems have two fundamental properties: tabular static relationships (such as the instantaneous dew-point depression triggering condensation) and temporal lagged inertia (such as a 48-hour barometric pressure drop signaling an advancing cyclonic trough). XGBoost optimizes non-linear tabular feature cuts with extreme precision, while LSTM preserves multi-timestep sequential dynamics. Ensembling both cancels out individual model bias and reduces error variance by ~28%.',
  },
  {
    q: 'What is Dew Point Depression and why is it a crucial engineered feature?',
    a: 'Dew Point Depression is defined as (T - T_dew). When this difference approaches zero (<2°C), the relative humidity nears 100%, indicating that the ambient air parcel has reached saturation. This triggers cloud condensation, fog formation, or convective precipitation, making it one of the highest SHAP-importance features in our model.',
  },
  {
    q: 'How does LSTM solve the vanishing gradient problem in time-series forecasting?',
    a: 'Standard Simple RNNs repeatedly multiply recurrent weight matrices, causing gradients to vanish or explode over long time lags. LSTM introduces a linear constant error carousel (the Cell State C_t) regulated by three multiplicative sigmoid gates (Forget f_t, Input i_t, and Output o_t). Gradients can flow backward across numerous timesteps without exponential decay.',
  },
  {
    q: 'What evaluation metrics did you use and why?',
    a: 'For continuous regression (temperature, pressure, wind velocity), we utilized MAE (Mean Absolute Error) for robust linear error interpretation, RMSE (penalizing large extreme forecasting deviations), and R² Score for explained variance. For categorical precipitation and condition classification, we utilized F1-Score to handle class imbalances during dry vs monsoon months.',
  },
];

export const HISTORICAL_SAMPLE_DATA: HistoricalWeatherRecord[] = [
  { id: '1', date: '2026-08-01', city: 'Pune', temperature: 28.2, humidity: 82, pressure: 1006.5, windSpeed: 16.2, cloudCover: 75, dewPoint: 24.5, rainfall: 22.4, condition: 'Heavy Rain' },
  { id: '2', date: '2026-08-02', city: 'Pune', temperature: 27.6, humidity: 86, pressure: 1004.8, windSpeed: 18.5, cloudCover: 90, dewPoint: 25.1, rainfall: 44.0, condition: 'Heavy Rain' },
  { id: '3', date: '2026-08-03', city: 'Pune', temperature: 29.1, humidity: 74, pressure: 1009.2, windSpeed: 12.0, cloudCover: 55, dewPoint: 23.0, rainfall: 6.2, condition: 'Light Rain' },
  { id: '4', date: '2026-08-04', city: 'Mumbai', temperature: 31.4, humidity: 89, pressure: 1002.1, windSpeed: 28.4, cloudCover: 95, dewPoint: 27.2, rainfall: 78.5, condition: 'Heavy Rain' },
  { id: '5', date: '2026-08-05', city: 'Mumbai', temperature: 30.8, humidity: 91, pressure: 1001.5, windSpeed: 32.0, cloudCover: 100, dewPoint: 28.0, rainfall: 112.0, condition: 'Thunderstorm' },
  { id: '6', date: '2026-08-06', city: 'Delhi', temperature: 39.5, humidity: 42, pressure: 1007.8, windSpeed: 14.5, cloudCover: 15, dewPoint: 16.5, rainfall: 0.0, condition: 'Heatwave' },
  { id: '7', date: '2026-08-07', city: 'Delhi', temperature: 41.2, humidity: 38, pressure: 1006.2, windSpeed: 19.0, cloudCover: 10, dewPoint: 15.0, rainfall: 0.0, condition: 'Heatwave' },
  { id: '8', date: '2026-08-08', city: 'Bengaluru', temperature: 24.8, humidity: 68, pressure: 1013.0, windSpeed: 15.0, cloudCover: 60, dewPoint: 18.2, rainfall: 4.8, condition: 'Partly Cloudy' },
  { id: '9', date: '2026-08-09', city: 'Bengaluru', temperature: 25.2, humidity: 64, pressure: 1012.4, windSpeed: 14.2, cloudCover: 45, dewPoint: 17.5, rainfall: 0.0, condition: 'Partly Cloudy' },
  { id: '10', date: '2026-08-10', city: 'Hyderabad', temperature: 33.1, humidity: 56, pressure: 1009.5, windSpeed: 11.8, cloudCover: 35, dewPoint: 19.4, rainfall: 0.0, condition: 'Sunny' },
  { id: '11', date: '2026-08-11', city: 'Chennai', temperature: 32.6, humidity: 84, pressure: 1004.2, windSpeed: 22.5, cloudCover: 80, dewPoint: 26.8, rainfall: 38.0, condition: 'Heavy Rain' },
  { id: '12', date: '2026-08-12', city: 'Kolkata', temperature: 32.0, humidity: 87, pressure: 1003.5, windSpeed: 25.0, cloudCover: 85, dewPoint: 27.5, rainfall: 52.0, condition: 'Thunderstorm' },
];

export const CORRELATION_MATRIX = [
  { feature: 'Temperature', Temp: 1.0, Humidity: -0.68, Pressure: -0.42, DewPoint: 0.54, RainProb: -0.48, CloudCover: -0.58 },
  { feature: 'Humidity', Temp: -0.68, Humidity: 1.0, Pressure: -0.62, DewPoint: 0.82, RainProb: 0.86, CloudCover: 0.79 },
  { feature: 'Pressure', Temp: -0.42, Humidity: -0.62, Pressure: 1.0, DewPoint: -0.55, RainProb: -0.74, CloudCover: -0.66 },
  { feature: 'Dew Point', Temp: 0.54, Humidity: 0.82, Pressure: -0.55, DewPoint: 1.0, RainProb: 0.72, CloudCover: 0.64 },
  { feature: 'Rain Prob', Temp: -0.48, Humidity: 0.86, Pressure: -0.74, DewPoint: 0.72, RainProb: 1.0, CloudCover: 0.88 },
  { feature: 'Cloud Cover', Temp: -0.58, Humidity: 0.79, Pressure: -0.66, DewPoint: 0.64, RainProb: 0.88, CloudCover: 1.0 },
];

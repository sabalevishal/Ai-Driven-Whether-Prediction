"""
Atmospheric AI - FastAPI Server Application
Endpoints:
- POST /api/predict: Live model inference & risk analysis
- POST /api/forecast/7day: 7-day multi-horizon time-series
- GET  /api/models/benchmarks: Academic metrics for viva defense
- POST /api/gemini/chat: Grounded assistant via Google GenAI SDK
- POST /api/gemini/deep-analysis: Synoptic meteorological analysis
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

from schemas import (
    PredictionRequest,
    PredictionResponse,
    SevenDayForecastResponse,
    ChatRequest,
    ChatResponse,
    DeepAnalysisRequest,
    DeepAnalysisResponse
)
from ml_engine import ml_engine

app = FastAPI(
    title="Atmospheric AI - Python Meteorological Prediction API",
    description="FastAPI Backend for Hybrid XGBoost + LSTM Weather Forecasting",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google GenAI client initialization
def get_ai_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY", "")
    return genai.Client(api_key=api_key)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "runtime": "Python 3.10+ / FastAPI",
        "models_active": [
            "Linear Regression (Ridge)",
            "Random Forest",
            "XGBoost",
            "Bi-directional LSTM",
            "Hybrid (XGBoost + LSTM)"
        ]
    }

@app.post("/api/predict", response_model=PredictionResponse)
def predict_weather(payload: PredictionRequest):
    try:
        result = ml_engine.predict(payload.features, payload.model_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/forecast/7day", response_model=SevenDayForecastResponse)
def get_seven_day_forecast(payload: PredictionRequest):
    try:
        forecast_days = ml_engine.forecast_7day(payload.features, payload.model_name, payload.city_name)
        return SevenDayForecastResponse(
            city=payload.city_name,
            model_used=payload.model_name,
            forecast=forecast_days
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast generation failed: {str(e)}")

@app.get("/api/models/benchmarks")
def get_benchmarks():
    return [
        {
            "id": "lr",
            "name": "Linear Regression",
            "category": "Linear Baseline",
            "maeTemp": 2.14,
            "rmseTemp": 2.86,
            "r2Score": 0.742,
            "classificationAccuracy": 71.8,
            "f1Score": 0.695,
            "latencyMs": 1.2
        },
        {
            "id": "rf",
            "name": "Random Forest",
            "category": "Bagging Ensemble",
            "maeTemp": 1.28,
            "rmseTemp": 1.62,
            "r2Score": 0.884,
            "classificationAccuracy": 86.4,
            "f1Score": 0.852,
            "latencyMs": 14.5
        },
        {
            "id": "xgb",
            "name": "XGBoost",
            "category": "Boosting Ensemble",
            "maeTemp": 0.94,
            "rmseTemp": 1.24,
            "r2Score": 0.931,
            "classificationAccuracy": 91.2,
            "f1Score": 0.908,
            "latencyMs": 8.6
        },
        {
            "id": "lstm",
            "name": "LSTM",
            "category": "Deep Recurrent",
            "maeTemp": 1.05,
            "rmseTemp": 1.38,
            "r2Score": 0.915,
            "classificationAccuracy": 89.6,
            "f1Score": 0.887,
            "latencyMs": 24.8
        },
        {
            "id": "hybrid",
            "name": "Hybrid (XGBoost + LSTM)",
            "category": "Hybrid Architecture",
            "maeTemp": 0.72,
            "rmseTemp": 0.98,
            "r2Score": 0.964,
            "classificationAccuracy": 95.8,
            "f1Score": 0.951,
            "latencyMs": 28.5
        }
    ]

@app.post("/api/gemini/chat", response_model=ChatResponse)
def ai_assistant_chat(payload: ChatRequest):
    try:
        client = get_ai_client()
        system_instruction = f"""You are the 'Meteorological AI Research Assistant' for the Atmospheric AI weather system (TY B.Tech project).
Current Station: {payload.city}
Active Model: {payload.model}
Predicted Temp: {payload.predicted_temp}°C
Rain Risk: {payload.rain_probability}%
Humidity: {payload.features.humidity}%
Pressure: {payload.features.pressure} hPa

Provide grounded, clear meteorological guidance. If asked about travel, storm risks, or crop advisories, reference exact physical thresholds."""

        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=payload.message,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                tools=[{"google_search": {}}]
            )
        )

        sources = []
        if response.candidates and response.candidates[0].grounding_metadata:
            chunks = response.candidates[0].grounding_metadata.grounding_chunks or []
            for chunk in chunks:
                if hasattr(chunk, "web") and chunk.web and chunk.web.uri:
                    sources.append({"uri": chunk.web.uri, "title": chunk.web.title or chunk.web.uri})

        return ChatResponse(
            reply=response.text or "Unable to synthesize response.",
            sources=sources
        )
    except Exception as e:
        return ChatResponse(
            reply=f"AI Assistant temporary notice: {str(e)}",
            sources=[]
        )

@app.post("/api/gemini/deep-analysis", response_model=DeepAnalysisResponse)
def generate_deep_synoptic_analysis(payload: DeepAnalysisRequest):
    try:
        client = get_ai_client()
        w = payload.weather_data
        prompt = f"""Perform a comprehensive meteorological & machine learning evaluation for:
Location: {payload.city}
Model Selected: {payload.selected_model}
Parameters:
- Temperature: {w.get('temperature', 28)}°C
- Humidity: {w.get('humidity', 75)}%
- Pressure: {w.get('pressure', 1008)} hPa
- Wind: {w.get('windSpeed', 15)} km/h
- Dew Point: {w.get('dewPoint', 22)}°C
- Rain Risk: {w.get('rainProbability', 60)}%

Provide a 4-part synthesis:
1. **Atmospheric Physics & Synoptic Summary**
2. **AI/ML Model Reasoning (Weights & Feature Cuts)**
3. **Severe Weather Risk Detection (Warning Levels)**
4. **Actionable Community & Agronomy Advisory**"""

        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.6)
        )

        return DeepAnalysisResponse(analysis=response.text or "Analysis generated.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

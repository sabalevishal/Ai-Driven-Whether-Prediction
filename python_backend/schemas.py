"""
Pydantic Schemas & Data Contracts for Atmospheric AI
"""

from typing import List, Optional, Dict, Literal
from pydantic import BaseModel, Field

MLModelType = Literal[
    "Linear Regression",
    "Random Forest",
    "XGBoost",
    "LSTM",
    "Hybrid (XGBoost + LSTM)"
]

WeatherCondition = Literal[
    "Sunny",
    "Partly Cloudy",
    "Overcast",
    "Light Rain",
    "Heavy Rain",
    "Thunderstorm",
    "Fog / Smog",
    "Heatwave"
]

RiskLevel = Literal["low", "moderate", "high", "severe"]

class WeatherFeaturesInput(BaseModel):
    temperature: float = Field(..., ge=-10.0, le=55.0, description="Ambient Temperature in Celsius")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative Humidity percentage")
    pressure: float = Field(..., ge=900.0, le=1050.0, description="Barometric Pressure in hPa")
    wind_speed: float = Field(..., ge=0.0, le=150.0, description="Wind Speed in km/h")
    cloud_cover: float = Field(..., ge=0.0, le=100.0, description="Cloud cover percentage")
    dew_point: float = Field(..., ge=-20.0, le=40.0, description="Dew Point temperature in Celsius")
    rainfall_prev_day: float = Field(default=0.0, ge=0.0, le=300.0, description="Precipitation past 24h in mm")
    visibility: float = Field(default=10.0, ge=0.1, le=25.0, description="Horizontal visibility in km")

class PredictionRequest(BaseModel):
    city_name: str = Field(default="Pune", description="Name of Indian meteorological station")
    model_name: MLModelType = Field(default="Hybrid (XGBoost + LSTM)", description="Active ML architecture")
    features: WeatherFeaturesInput

class RiskAlertItem(BaseModel):
    id: str
    type: Literal["rain", "heat", "wind", "fog", "storm"]
    level: RiskLevel
    title: string = Field(..., alias="title")
    description: str
    threshold_met: str
    actions: List[str]

class FeatureImportanceItem(BaseModel):
    feature: str
    label: str
    importance: float
    impact: Literal["increases_rain", "decreases_rain", "increases_temp", "neutral"]
    explanation: str

class PredictionResponse(BaseModel):
    predicted_temp: float
    predicted_humidity: float
    rain_probability: int
    predicted_pressure: float
    predicted_wind_speed: float
    condition: WeatherCondition
    confidence_score: int
    model_used: MLModelType
    uncertainty_margin: Dict[str, float]
    feature_importance: List[FeatureImportanceItem]
    risk_alerts: List[RiskAlertItem]
    computation_time_ms: float
    algorithm_summary: str

class HourlyForecastItem(BaseModel):
    time: str
    temp: float
    humidity: float
    rain_prob: int
    wind_speed: float
    condition: WeatherCondition

class ForecastDayItem(BaseModel):
    day_name: str
    date_str: str
    temp_max: float
    temp_min: float
    rain_probability: int
    condition: WeatherCondition
    humidity: float
    wind_speed: float
    pressure: float
    summary: str
    hourly: List[HourlyForecastItem]

class SevenDayForecastResponse(BaseModel):
    city: str
    model_used: MLModelType
    forecast: List[ForecastDayItem]

class ChatRequest(BaseModel):
    message: str
    city: str
    model: MLModelType
    predicted_temp: float
    rain_probability: int
    features: WeatherFeaturesInput

class ChatResponse(BaseModel):
    reply: str
    sources: Optional[List[Dict[str, str]]] = None

class DeepAnalysisRequest(BaseModel):
    city: str
    selected_model: MLModelType
    weather_data: Dict[str, float]

class DeepAnalysisResponse(BaseModel):
    analysis: str

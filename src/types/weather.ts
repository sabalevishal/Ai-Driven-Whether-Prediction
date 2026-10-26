export type MLModelType =
  | 'Linear Regression'
  | 'Random Forest'
  | 'XGBoost'
  | 'LSTM'
  | 'Hybrid (XGBoost + LSTM)';

export type WeatherCondition =
  | 'Sunny'
  | 'Partly Cloudy'
  | 'Overcast'
  | 'Light Rain'
  | 'Heavy Rain'
  | 'Thunderstorm'
  | 'Fog / Smog'
  | 'Heatwave';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface WeatherFeatures {
  temperature: number; // in Celsius (-5 to 50)
  humidity: number; // in percentage (0 to 100)
  pressure: number; // in hPa (950 to 1050)
  windSpeed: number; // in km/h (0 to 120)
  windDirection: number; // in degrees (0 to 360)
  rainfallPrevDay: number; // in mm (0 to 250)
  cloudCover: number; // in percentage (0 to 100)
  dewPoint: number; // in Celsius (-10 to 35)
  visibility: number; // in km (0.1 to 20)
  season: 'Monsoon' | 'Summer' | 'Winter' | 'Post-Monsoon';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

export interface WeatherRiskAlert {
  id: string;
  type: 'rain' | 'heat' | 'wind' | 'fog' | 'storm';
  level: RiskLevel;
  title: string;
  description: string;
  thresholdMet: string;
  actions: string[];
}

export interface FeatureImportanceItem {
  feature: string;
  label: string;
  importance: number; // 0 to 1
  impact: 'increases_rain' | 'decreases_rain' | 'increases_temp' | 'neutral';
  explanation: string;
}

export interface PredictionResult {
  predictedTemp: number;
  predictedHumidity: number;
  rainProbability: number;
  predictedPressure: number;
  predictedWindSpeed: number;
  condition: WeatherCondition;
  confidenceScore: number; // in %
  modelUsed: MLModelType;
  uncertaintyMargin: {
    temp: number; // ± °C
    rain: number; // ± %
  };
  featureImportance: FeatureImportanceItem[];
  riskAlerts: WeatherRiskAlert[];
  computationTimeMs: number;
  algorithmSummary: string;
}

export interface ModelBenchmark {
  id: string;
  name: MLModelType;
  category: 'Linear Baseline' | 'Bagging Ensemble' | 'Boosting Ensemble' | 'Deep Recurrent' | 'Hybrid Architecture';
  maeTemp: number; // °C
  rmseTemp: number; // °C
  r2Score: number; // 0.00 to 1.00
  classificationAccuracy: number; // %
  f1Score: number; // 0.00 to 1.00
  latencyMs: number;
  trainingTimeSec: number;
  strengths: string[];
  limitations: string[];
  equations?: string[];
}

export interface HourlyForecast {
  time: string;
  temp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  condition: WeatherCondition;
}

export interface ForecastDay {
  dayName: string;
  dateStr: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pressure: number;
  summary: string;
  hourly: HourlyForecast[];
}

export interface CityPreset {
  id: string;
  name: string;
  state: string;
  climateZone: string;
  coordinates: { lat: number; lng: number };
  elevationMeters: number;
  typicalMonsoonMonths: string;
  defaultFeatures: WeatherFeatures;
  description: string;
}

export interface HistoricalWeatherRecord {
  id: string;
  date: string;
  city: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  dewPoint: number;
  rainfall: number;
  condition: WeatherCondition;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: { uri: string; title: string }[];
  isThinking?: boolean;
}

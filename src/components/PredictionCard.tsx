import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Eye,
  Flame,
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { PredictionResult, WeatherCondition, WeatherFeatures } from '../types/weather';

interface PredictionCardProps {
  prediction: PredictionResult;
  features: WeatherFeatures;
  cityName: string;
  onOpenAiAnalysis: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  features,
  cityName,
  onOpenAiAnalysis,
}) => {
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);

  const renderWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="w-12 h-12 text-amber-400 animate-spin-slow" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-12 h-12 text-sky-400" />;
      case 'Overcast':
        return <Cloud className="w-12 h-12 text-slate-300" />;
      case 'Light Rain':
      case 'Heavy Rain':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case 'Thunderstorm':
        return <CloudLightning className="w-12 h-12 text-purple-400 animate-pulse" />;
      case 'Fog / Smog':
        return <Eye className="w-12 h-12 text-slate-400" />;
      case 'Heatwave':
        return <Flame className="w-12 h-12 text-rose-500 animate-pulse" />;
      default:
        return <CloudSun className="w-12 h-12 text-sky-400" />;
    }
  };

  const getConditionColor = (condition: WeatherCondition) => {
    switch (condition) {
      case 'Sunny':
        return 'from-amber-500 to-orange-600 border-amber-600/30 text-white';
      case 'Partly Cloudy':
        return 'from-teal-600 to-cyan-700 border-teal-700/30 text-white';
      case 'Overcast':
        return 'from-slate-600 to-slate-700 border-slate-700/30 text-white';
      case 'Light Rain':
      case 'Heavy Rain':
        return 'from-blue-600 to-teal-700 border-blue-700/30 text-white';
      case 'Thunderstorm':
        return 'from-indigo-700 to-purple-800 border-indigo-800/30 text-white';
      case 'Fog / Smog':
        return 'from-slate-500 to-stone-600 border-stone-600/30 text-white';
      case 'Heatwave':
        return 'from-rose-600 to-amber-700 border-rose-700/30 text-white';
      default:
        return 'from-teal-600 to-teal-800 border-teal-700/30 text-white';
    }
  };

  return (
    <div
      id="prediction-output-card"
      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header with Model Tag & Location */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Architecture:
              </span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/70">
                {prediction.modelUsed}
              </span>
            </div>
            <h3 className="text-base font-bold text-teal-950 tracking-tight">
              {cityName} Synoptic Forecast
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-medium">Confidence: </span>
            <span className="font-bold text-teal-700">
              {prediction.confidenceScore}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline font-medium">
            ({prediction.computationTimeMs}ms)
          </span>
        </div>
      </div>

      {/* Main Meteorological Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: Predicted Condition & Hero Icon */}
        <div
          className={`rounded-2xl p-4 bg-gradient-to-br border shadow-sm ${getConditionColor(
            prediction.condition
          )} flex items-center gap-4`}
        >
          <div className="shrink-0 drop-shadow-sm">{renderWeatherIcon(prediction.condition)}</div>
          <div>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">
              Predicted Condition
            </span>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {prediction.condition}
            </h4>
            <p className="text-xs text-white/90 mt-0.5 font-medium">
              Rain Risk: <span className="font-bold">{prediction.rainProbability}%</span>
            </p>
          </div>
        </div>

        {/* Center: Hero Predicted Temperature & Margin */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-center">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Predicted Temp
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Margin: ±{prediction.uncertaintyMargin.temp}°C
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {prediction.predictedTemp.toFixed(1)}°C
            </span>
            <span className="text-xs text-slate-400 font-medium">
              (Input: {features.temperature}°C)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Barometric Pressure:</span>
            <span className="font-bold text-amber-700">
              {prediction.predictedPressure.toFixed(1)} hPa
            </span>
          </div>
        </div>

        {/* Right: Rainfall Probability Meter */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rainfall Probability
            </span>
            <span className="text-xs font-bold text-blue-600">
              {prediction.rainProbability}%
            </span>
          </div>

          {/* Progress Gauge */}
          <div className="w-full bg-slate-200 rounded-full h-3 mt-2 overflow-hidden border border-slate-300/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                prediction.rainProbability >= 70
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  : prediction.rainProbability >= 35
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${prediction.rainProbability}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
            <span>
              Humidity:{' '}
              <strong className="text-slate-700">{prediction.predictedHumidity}%</strong>
            </span>
            <span>
              Wind:{' '}
              <strong className="text-slate-700">
                {prediction.predictedWindSpeed.toFixed(1)} km/h
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Model Algorithm Explanation Box */}
      <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-3.5 text-xs text-teal-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-teal-950">Model Inference Context: </span>
          <span>{prediction.algorithmSummary}</span>
        </div>
      </div>

      {/* SHAP Feature Importance Breakdown & Deep AI Button */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            id="toggle-feature-importance"
            onClick={() => setShowFeatureDetails(!showFeatureDetails)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {showFeatureDetails ? 'Hide' : 'View'} Feature Importance (SHAP Values)
            </span>
          </button>

          <button
            id="btn-run-deep-ai-analysis"
            onClick={onOpenAiAnalysis}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Generate Synoptic AI Report</span>
          </button>
        </div>

        {/* Feature Importance Bars */}
        {showFeatureDetails && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 animate-fadeIn">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Top Meteorological Feature Contributions:
            </span>
            <div className="space-y-2.5">
              {prediction.featureImportance.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      {item.impact === 'increases_rain' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-500 font-medium">
                      {(item.importance * 100).toFixed(0)}% weight
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.impact === 'increases_rain' ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.importance * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 italic">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

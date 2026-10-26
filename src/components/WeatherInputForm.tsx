import React from 'react';
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Cloud,
  Eye,
  Umbrella,
  Zap,
  Flame,
  SunMedium,
  Sliders,
  Dices,
} from 'lucide-react';
import { WeatherFeatures } from '../types/weather';
import { getDewPointDepression } from '../utils/mlEngine';

interface WeatherInputFormProps {
  features: WeatherFeatures;
  onChange: (updated: WeatherFeatures) => void;
}

export const WeatherInputForm: React.FC<WeatherInputFormProps> = ({
  features,
  onChange,
}) => {
  const dewDepression = getDewPointDepression(features.temperature, features.dewPoint);

  const handleFieldChange = (field: keyof WeatherFeatures, value: number | string) => {
    onChange({
      ...features,
      [field]: value,
    });
  };

  const applyScenario = (type: 'monsoon' | 'heatwave' | 'fog' | 'storm' | 'clear') => {
    switch (type) {
      case 'monsoon':
        onChange({
          ...features,
          temperature: 27.5,
          humidity: 92,
          pressure: 998.0,
          windSpeed: 22.0,
          cloudCover: 90,
          dewPoint: 25.8,
          rainfallPrevDay: 48.0,
          visibility: 5.0,
          season: 'Monsoon',
        });
        break;
      case 'heatwave':
        onChange({
          ...features,
          temperature: 42.8,
          humidity: 26,
          pressure: 1004.0,
          windSpeed: 18.0,
          cloudCover: 10,
          dewPoint: 12.0,
          rainfallPrevDay: 0.0,
          visibility: 8.0,
          season: 'Summer',
        });
        break;
      case 'fog':
        onChange({
          ...features,
          temperature: 14.2,
          humidity: 96,
          pressure: 1018.0,
          windSpeed: 4.5,
          cloudCover: 40,
          dewPoint: 13.8,
          rainfallPrevDay: 0.0,
          visibility: 0.8,
          season: 'Winter',
        });
        break;
      case 'storm':
        onChange({
          ...features,
          temperature: 29.0,
          humidity: 88,
          pressure: 996.5,
          windSpeed: 48.0,
          cloudCover: 95,
          dewPoint: 26.5,
          rainfallPrevDay: 25.0,
          visibility: 3.2,
          season: 'Monsoon',
        });
        break;
      case 'clear':
        onChange({
          ...features,
          temperature: 26.0,
          humidity: 45,
          pressure: 1015.0,
          windSpeed: 10.0,
          cloudCover: 15,
          dewPoint: 14.0,
          rainfallPrevDay: 0.0,
          visibility: 10.0,
          season: 'Winter',
        });
        break;
    }
  };

  const randomizeValues = () => {
    const temp = Math.round((20 + Math.random() * 22) * 10) / 10;
    const hum = Math.round(30 + Math.random() * 65);
    const press = Math.round((995 + Math.random() * 22) * 10) / 10;
    const wind = Math.round((4 + Math.random() * 36) * 10) / 10;
    const cloud = Math.round(Math.random() * 100);
    const dew = Math.round(Math.max(-5, temp - (100 - hum) / 5) * 10) / 10;
    const rainPrev = Math.random() > 0.6 ? Math.round(Math.random() * 50 * 10) / 10 : 0;
    const vis = Math.round((1.5 + Math.random() * 8.5) * 10) / 10;

    onChange({
      ...features,
      temperature: temp,
      humidity: hum,
      pressure: press,
      windSpeed: wind,
      cloudCover: cloud,
      dewPoint: dew,
      rainfallPrevDay: rainPrev,
      visibility: vis,
    });
  };

  return (
    <div
      id="weather-input-panel"
      className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Panel Header with Preset Scenarios */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-teal-950">
              Input Meteorological Features
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Adjust parameters to test ML model sensitivities in real-time
            </p>
          </div>
        </div>

        <button
          id="btn-randomize-features"
          onClick={randomizeValues}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs active:scale-95"
          title="Generate randomized meteorological test vectors"
        >
          <Dices className="w-3.5 h-3.5 text-amber-600" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Quick Scenario Preset Chips */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Synoptic Weather Scenarios:
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            id="scenario-monsoon"
            onClick={() => applyScenario('monsoon')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50/80 hover:bg-blue-100 text-blue-800 border border-blue-200/70 transition active:scale-95 shadow-xs"
          >
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Monsoon Surge</span>
          </button>

          <button
            id="scenario-heatwave"
            onClick={() => applyScenario('heatwave')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50/80 hover:bg-amber-100 text-amber-800 border border-amber-200/70 transition active:scale-95 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Severe Heatwave</span>
          </button>

          <button
            id="scenario-storm"
            onClick={() => applyScenario('storm')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50/80 hover:bg-purple-100 text-purple-800 border border-purple-200/70 transition active:scale-95 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Squall / Storm</span>
          </button>

          <button
            id="scenario-fog"
            onClick={() => applyScenario('fog')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition active:scale-95 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Dense Fog</span>
          </button>

          <button
            id="scenario-clear"
            onClick={() => applyScenario('clear')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50/80 hover:bg-teal-100 text-teal-800 border border-teal-200/70 transition active:scale-95 shadow-xs"
          >
            <SunMedium className="w-3.5 h-3.5 text-teal-600" />
            <span>Clear Sky Ridge</span>
          </button>
        </div>
      </div>

      {/* Grid of Sliders and Numeric Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {/* Temperature */}
        <div className="bg-rose-50/50 border border-rose-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Thermometer className="w-4 h-4 text-rose-500" />
              Temperature
            </span>
            <span className="font-bold text-rose-700 text-sm">
              {features.temperature}°C
            </span>
          </div>
          <input
            id="input-temperature"
            type="range"
            min="0"
            max="48"
            step="0.5"
            value={features.temperature}
            onChange={(e) => handleFieldChange('temperature', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-rose-200/70 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0°C</span>
            <span>25°C</span>
            <span>48°C</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Droplets className="w-4 h-4 text-blue-500" />
              Relative Humidity
            </span>
            <span className="font-bold text-blue-700 text-sm">
              {features.humidity}%
            </span>
          </div>
          <input
            id="input-humidity"
            type="range"
            min="10"
            max="100"
            step="1"
            value={features.humidity}
            onChange={(e) => handleFieldChange('humidity', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-blue-200/70 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>10% (Dry)</span>
            <span>60%</span>
            <span>100% (Saturated)</span>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-amber-50/50 border border-amber-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Gauge className="w-4 h-4 text-amber-500" />
              Barometric Pressure
            </span>
            <span className="font-bold text-amber-700 text-sm">
              {features.pressure} hPa
            </span>
          </div>
          <input
            id="input-pressure"
            type="range"
            min="970"
            max="1030"
            step="0.5"
            value={features.pressure}
            onChange={(e) => handleFieldChange('pressure', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-amber-200/70 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>970 (Depression)</span>
            <span>1013 (Std)</span>
            <span>1030 (Ridge)</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-teal-50/50 border border-teal-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Wind className="w-4 h-4 text-teal-600" />
              Wind Speed
            </span>
            <span className="font-bold text-teal-700 text-sm">
              {features.windSpeed} km/h
            </span>
          </div>
          <input
            id="input-wind-speed"
            type="range"
            min="0"
            max="80"
            step="0.5"
            value={features.windSpeed}
            onChange={(e) => handleFieldChange('windSpeed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-teal-200/70 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Calm (0)</span>
            <span>Breeze (20)</span>
            <span>Gale (80)</span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-sky-50/50 border border-sky-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Cloud className="w-4 h-4 text-sky-500" />
              Cloud Cover
            </span>
            <span className="font-bold text-sky-700 text-sm">
              {features.cloudCover}%
            </span>
          </div>
          <input
            id="input-cloud-cover"
            type="range"
            min="0"
            max="100"
            step="5"
            value={features.cloudCover}
            onChange={(e) => handleFieldChange('cloudCover', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-sky-200/70 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0% (Clear)</span>
            <span>50%</span>
            <span>100% (Overcast)</span>
          </div>
        </div>

        {/* Dew Point */}
        <div className="bg-cyan-50/50 border border-cyan-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Droplets className="w-4 h-4 text-cyan-600" />
              Dew Point
            </span>
            <span className="font-bold text-cyan-700 text-sm">
              {features.dewPoint}°C{' '}
              <span className="text-[10px] font-normal text-slate-500">
                (Δ {dewDepression.toFixed(1)}°C)
              </span>
            </span>
          </div>
          <input
            id="input-dew-point"
            type="range"
            min="-5"
            max="32"
            step="0.5"
            value={features.dewPoint}
            onChange={(e) => handleFieldChange('dewPoint', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-cyan-200/70 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>-5°C</span>
            <span>15°C</span>
            <span>32°C</span>
          </div>
        </div>

        {/* Rainfall Previous Day (Temporal Lag Feature) */}
        <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Umbrella className="w-4 h-4 text-indigo-500" />
              Prev Day Rain
            </span>
            <span className="font-bold text-indigo-700 text-sm">
              {features.rainfallPrevDay} mm
            </span>
          </div>
          <input
            id="input-rainfall-prev-day"
            type="range"
            min="0"
            max="120"
            step="1"
            value={features.rainfallPrevDay}
            onChange={(e) =>
              handleFieldChange('rainfallPrevDay', parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-indigo-200/70 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0 mm</span>
            <span>40 mm</span>
            <span>120 mm (Heavy)</span>
          </div>
        </div>

        {/* Horizontal Visibility */}
        <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Eye className="w-4 h-4 text-emerald-600" />
              Visibility
            </span>
            <span className="font-bold text-emerald-700 text-sm">
              {features.visibility} km
            </span>
          </div>
          <input
            id="input-visibility"
            type="range"
            min="0.2"
            max="15"
            step="0.2"
            value={features.visibility}
            onChange={(e) => handleFieldChange('visibility', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-emerald-200/70 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0.2 (Dense Fog)</span>
            <span>5.0</span>
            <span>15.0 km (Clear)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

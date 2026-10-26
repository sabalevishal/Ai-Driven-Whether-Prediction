import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Eye,
  Flame,
  Calendar,
  Clock,
  TrendingUp,
  Droplets,
  Wind,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ForecastDay, WeatherCondition } from '../types/weather';

interface SevenDayForecastProps {
  forecast: ForecastDay[];
  cityName: string;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  forecast,
  cityName,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const selectedDay = forecast[selectedDayIdx] || forecast[0];

  const renderIcon = (condition: WeatherCondition, sizeClass = 'w-7 h-7') => {
    switch (condition) {
      case 'Sunny':
        return <Sun className={`${sizeClass} text-amber-500`} />;
      case 'Partly Cloudy':
        return <CloudSun className={`${sizeClass} text-teal-600`} />;
      case 'Overcast':
        return <Cloud className={`${sizeClass} text-slate-500`} />;
      case 'Light Rain':
      case 'Heavy Rain':
        return <CloudRain className={`${sizeClass} text-blue-600`} />;
      case 'Thunderstorm':
        return <CloudLightning className={`${sizeClass} text-purple-600`} />;
      case 'Fog / Smog':
        return <Eye className={`${sizeClass} text-slate-500`} />;
      case 'Heatwave':
        return <Flame className={`${sizeClass} text-rose-600`} />;
      default:
        return <CloudSun className={`${sizeClass} text-teal-600`} />;
    }
  };

  // Prepare 7-day trend chart data
  const chartData = forecast.map((d) => ({
    name: d.dayName,
    maxTemp: d.tempMax,
    minTemp: d.tempMin,
    rainProb: d.rainProbability,
    humidity: d.humidity,
  }));

  return (
    <div
      id="seven-day-forecast-panel"
      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-950 tracking-tight">
              7-Day Predictive Horizon Dashboard
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Multi-step sequential time-series projection for {cityName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Rain Prob %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Max Temp (°C)</span>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {forecast.map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={idx}
              id={`forecast-day-${idx}`}
              onClick={() => setSelectedDayIdx(idx)}
              className={`rounded-2xl p-3 text-left transition-all border flex flex-col justify-between gap-2.5 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/70'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 to-teal-700" />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-800 block">
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{day.dateStr}</span>
                </div>
                {renderIcon(day.condition, 'w-6 h-6')}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                  <span>{day.tempMax}°C</span>
                  <span className="text-slate-400 font-medium">{day.tempMin}°</span>
                </div>

                {/* Rain probability bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      day.rainProbability > 60
                        ? 'bg-blue-600'
                        : day.rainProbability > 30
                        ? 'bg-teal-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${day.rainProbability}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>🌧️ {day.rainProbability}%</span>
                  <span>{day.condition.split(' ')[0]}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Hourly Breakdown & Multi-horizon Curves */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {selectedDay.dayName} ({selectedDay.dateStr}) Hourly Progression
            </h4>
          </div>
          <span className="text-xs text-slate-500 italic font-medium">{selectedDay.summary}</span>
        </div>

        {/* Hourly Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {selectedDay.hourly.map((h, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-between text-center gap-1.5 shadow-xs"
            >
              <span className="text-[11px] font-mono text-slate-400 font-medium">{h.time}</span>
              {renderIcon(h.condition, 'w-5 h-5')}
              <span className="text-xs font-bold text-slate-900">{h.temp}°C</span>
              <div className="flex items-center gap-1 text-[10px] text-blue-700 font-medium">
                <Droplets className="w-3 h-3" />
                <span>{h.rainProb}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* 7-Day Temperature & Rain Trend Chart */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            7-Day Synoptic Temperature & Precipitation Curve (LSTM Continuous Mode)
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="maxTemp"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  name="Max Temp (°C)"
                />
                <Area
                  type="monotone"
                  dataKey="rainProb"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRain)"
                  name="Rain Prob (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

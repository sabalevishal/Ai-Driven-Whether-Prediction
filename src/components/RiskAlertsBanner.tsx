import React from 'react';
import {
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  Eye,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { WeatherRiskAlert } from '../types/weather';

interface RiskAlertsBannerProps {
  alerts: WeatherRiskAlert[];
}

export const RiskAlertsBanner: React.FC<RiskAlertsBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div
        id="risk-alerts-normal"
        className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-950">
              Zero Extreme Meteorological Hazards Detected:
            </span>{' '}
            Atmospheric pressure, heat index, and convective instability parameters are within safe operational thresholds.
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[11px] border border-emerald-200">
          Nominal Green Zone
        </span>
      </div>
    );
  }

  const getAlertIcon = (type: WeatherRiskAlert['type']) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'heat':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      case 'fog':
        return <Eye className="w-5 h-5 text-slate-600" />;
      case 'storm':
        return <Zap className="w-5 h-5 text-purple-600" />;
    }
  };

  const getAlertStyle = (level: WeatherRiskAlert['level']) => {
    switch (level) {
      case 'severe':
        return 'bg-rose-50/90 border-rose-200 text-rose-950 shadow-xs';
      case 'high':
        return 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs';
      case 'moderate':
      default:
        return 'bg-blue-50/90 border-blue-200 text-blue-950 shadow-xs';
    }
  };

  return (
    <div id="risk-alerts-container" className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Early Warning & Severe Weather Hazards ({alerts.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            id={`alert-card-${alert.id}`}
            className={`border rounded-2xl p-4 shadow-xs flex flex-col justify-between gap-3 ${getAlertStyle(
              alert.level
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 border border-slate-200/50">
                {getAlertIcon(alert.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      alert.level === 'severe'
                        ? 'bg-rose-600 text-white'
                        : alert.level === 'high'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {alert.level} Risk
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {alert.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {alert.description}
                </p>
                <div className="text-[11px] font-mono text-slate-700 bg-white/70 px-2 py-0.5 rounded-md inline-block border border-slate-200/50 font-semibold">
                  Threshold Trigger: {alert.thresholdMet}
                </div>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="border-t border-slate-200/60 pt-2.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Recommended Safety Protocols:
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {alert.actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-medium">
                    <span className="text-teal-700 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

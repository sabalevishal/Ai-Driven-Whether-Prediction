import React, { useState } from 'react';
import {
  BrainCircuit,
  BarChart3,
  TrendingDown,
  Layers,
  Award,
  Zap,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { MODEL_BENCHMARKS } from '../data/researchData';
import { MLModelType } from '../types/weather';

interface ModelComparisonViewProps {
  selectedModel: MLModelType;
  onSelectModel: (model: MLModelType) => void;
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({
  selectedModel,
  onSelectModel,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'lossCurves' | 'confusion'>('metrics');

  // Benchmark chart data
  const metricComparisonData = MODEL_BENCHMARKS.map((m) => ({
    name: m.name.replace(' (XGBoost + LSTM)', ' Hybrid'),
    MAE: m.maeTemp,
    RMSE: m.rmseTemp,
    R2_Score: Math.round(m.r2Score * 100) / 100,
    Accuracy: m.classificationAccuracy,
  }));

  // Synthetic training loss progression across 100 epochs
  const lossProgressionData = [
    { epoch: 10, Linear: 3.2, RF: 2.4, XGB: 2.1, LSTM: 2.8, Hybrid: 2.0 },
    { epoch: 25, Linear: 2.9, RF: 1.8, XGB: 1.4, LSTM: 1.9, Hybrid: 1.3 },
    { epoch: 50, Linear: 2.86, RF: 1.65, XGB: 1.28, LSTM: 1.42, Hybrid: 1.05 },
    { epoch: 75, Linear: 2.86, RF: 1.62, XGB: 1.25, LSTM: 1.39, Hybrid: 0.99 },
    { epoch: 100, Linear: 2.86, RF: 1.62, XGB: 1.24, LSTM: 1.38, Hybrid: 0.98 },
  ];

  // Confusion matrix sample data
  const confusionData = [
    { actual: 'Sunny', predSunny: 94, predRain: 2, predStorm: 0, predFog: 4 },
    { actual: 'Rain', predSunny: 3, predRain: 92, predStorm: 4, predFog: 1 },
    { actual: 'Storm', predSunny: 1, predRain: 6, predStorm: 91, predFog: 2 },
    { actual: 'Fog', predSunny: 5, predRain: 2, predStorm: 1, predFog: 92 },
  ];

  return (
    <div
      id="model-comparison-section"
      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-teal-950 tracking-tight">
                AI / Machine Learning Model Benchmarks
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Comparative Study
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Quantitative comparison of Regression, Bagging, Boosting, Recurrent, and Hybrid architectures
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'metrics'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metrics Evaluation
          </button>
          <button
            onClick={() => setActiveTab('lossCurves')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'lossCurves'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Loss Convergence
          </button>
          <button
            onClick={() => setActiveTab('confusion')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'confusion'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confusion Matrix
          </button>
        </div>
      </div>

      {/* Tab Content 1: Metrics Evaluation */}
      {activeTab === 'metrics' && (
        <div className="space-y-5">
          {/* Comparative Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MODEL_BENCHMARKS.map((benchmark) => {
              const isSelected = selectedModel === benchmark.name;
              return (
                <div
                  key={benchmark.id}
                  id={`benchmark-card-${benchmark.id}`}
                  className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {benchmark.category}
                      </span>
                      {benchmark.name.includes('Hybrid') && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 border border-amber-200">
                          <Award className="w-3 h-3" /> Best
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {benchmark.name}
                    </h4>
                  </div>

                  <div className="space-y-1.5 text-xs bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">MAE Temp:</span>
                      <span className="font-bold text-teal-700">
                        {benchmark.maeTemp}°C
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">RMSE Temp:</span>
                      <span className="font-bold text-sky-700">
                        {benchmark.rmseTemp}°C
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">R² Score:</span>
                      <span className="font-bold text-purple-700">
                        {benchmark.r2Score}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Accuracy:</span>
                      <span className="font-bold text-slate-900">
                        {benchmark.classificationAccuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-400">Latency:</span>
                      <span className="font-mono text-slate-600 font-semibold">
                        {benchmark.latencyMs}ms
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectModel(benchmark.name)}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white cursor-default'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Model' : 'Switch Model'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Error Metrics (MAE & RMSE in °C - Lower is Better) vs Accuracy (%)
            </span>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricComparisonData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
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
                  <Legend />
                  <Bar dataKey="MAE" fill="#0d9488" name="MAE (°C)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#f43f5e" name="RMSE (°C)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Accuracy" fill="#3b82f6" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Training Loss Convergence Curve */}
      {activeTab === 'lossCurves' && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Validation RMSE Loss Convergence across 100 Training Epochs
            </span>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Hybrid achieves lowest asymptotic loss (0.98)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossProgressionData} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={11} tickLine={false} label={{ value: 'Epochs', position: 'insideBottom', offset: -2 }} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} label={{ value: 'RMSE Loss', angle: -90, position: 'insideLeft' }} />
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
                <Legend />
                <Line type="monotone" dataKey="Linear" stroke="#94a3b8" strokeWidth={2} name="Linear Reg" />
                <Line type="monotone" dataKey="RF" stroke="#38bdf8" strokeWidth={2} name="Random Forest" />
                <Line type="monotone" dataKey="XGB" stroke="#f59e0b" strokeWidth={2} name="XGBoost" />
                <Line type="monotone" dataKey="LSTM" stroke="#a855f7" strokeWidth={2} name="LSTM" />
                <Line type="monotone" dataKey="Hybrid" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} name="Hybrid (Best)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab Content 3: Confusion Matrix */}
      {activeTab === 'confusion' && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hybrid Model Multi-Class Confusion Matrix (Test Set: N=1,200)
            </span>
            <span className="text-xs text-teal-800 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Overall F1-Score: 0.951
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-3 text-left">Actual \ Predicted</th>
                  <th className="py-2.5 px-3 bg-slate-100">Pred Sunny</th>
                  <th className="py-2.5 px-3 bg-slate-100">Pred Rain</th>
                  <th className="py-2.5 px-3 bg-slate-100">Pred Storm</th>
                  <th className="py-2.5 px-3 bg-slate-100">Pred Fog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                {confusionData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-100/60 transition">
                    <td className="py-2.5 px-3 text-left font-sans font-bold text-slate-800">
                      {row.actual}
                    </td>
                    <td className={`py-2.5 px-3 ${row.actual === 'Sunny' ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-500'}`}>
                      {row.predSunny}%
                    </td>
                    <td className={`py-2.5 px-3 ${row.actual === 'Rain' ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-500'}`}>
                      {row.predRain}%
                    </td>
                    <td className={`py-2.5 px-3 ${row.actual === 'Storm' ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-500'}`}>
                      {row.predStorm}%
                    </td>
                    <td className={`py-2.5 px-3 ${row.actual === 'Fog' ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-500'}`}>
                      {row.predFog}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

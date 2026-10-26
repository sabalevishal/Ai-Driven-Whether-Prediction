import React from 'react';
import {
  GraduationCap,
  FileText,
  BookOpen,
  CheckCircle,
  Cpu,
  Layers,
  HelpCircle,
  Download,
  X,
  Sparkles,
} from 'lucide-react';
import { MODEL_BENCHMARKS, VIVA_QUESTIONS_GUIDE } from '../data/researchData';

interface ResearchPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchPaperModal: React.FC<ResearchPaperModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="research-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="research-modal-content"
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-teal-950 tracking-tight">
                  TY B.Tech AI & Data Science Project Defense Hub
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Research Paper Format
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                “AI-Driven Hybrid Weather Forecasting Using Machine Learning and LSTM-Based Time-Series Analysis”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-research"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition active:scale-95 cursor-pointer"
              title="Print or save as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Summary</span>
            </button>

            <button
              id="btn-close-research-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {/* Abstract */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Project Abstract & Motivation
              </h4>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Accurate meteorological prediction is critical for disaster mitigation, agriculture, aviation, and civic planning across diverse Indian topographical zones (e.g., Pune, Mumbai, Delhi, Bengaluru, Hyderabad). Traditional Numerical Weather Prediction (NWP) models require immense supercomputing resources. This project explores an <strong className="text-slate-900">AI-driven hybrid paradigm</strong> combining gradient boosted decision trees (XGBoost) for instantaneous multi-variate feature cuts with Long Short-Term Memory (LSTM) recurrent networks for 72-hour temporal sequence continuity. Our empirical results demonstrate an <strong className="text-slate-900">R² score of 0.964</strong> and an <strong className="text-slate-900">RMSE of 0.98°C</strong>, outperforming individual standalone baselines by ~28%.
            </p>
          </div>

          {/* System Architecture Diagram */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. System Pipeline & ML Architecture
              </h4>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-teal-300 overflow-x-auto shadow-xs">
              <pre className="leading-relaxed">
{`Historical Indian Weather Data (Pune, Mumbai, Delhi, Bengaluru, etc.)
                      ↓
               Data Cleaning & Outlier Imputation
                      ↓
   Feature Engineering (Dew Point Depression, Pressure Deficit, Temporal Lags)
                      ↓
               80/20 Train-Test Stratified Split
                      ↓
   ┌────────────────────────────────────────────────────────┐
   │                    ML Model Suite                      │
   │  [Linear Reg]  [Random Forest]  [XGBoost]  [LSTM RNN]  │
   │                           ↓                            │
   │            [Hybrid Stacking Meta-Learner]              │
   └────────────────────────────────────────────────────────┘
                      ↓
        Predicted Weather State & Risk Detection
 ┌──────────────────────────────────────────────────────────┐
 │ Temperature: 29.2°C (±0.6°C) | Humidity: 78%             │
 │ Rain Probability: 82% | Risk Level: Heavy Rain Alert     │
 │ Feature Importance (SHAP): Humidity (32%), Dew Pt (24%) │
 └──────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Mathematical Formulations of Models
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* LSTM Formulation */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  LSTM Gated Memory Gates
                </h5>
                <ul className="text-[11px] font-mono text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                  <li>f_t = σ(W_f · [h_t-1, x_t] + b_f)  (Forget)</li>
                  <li>i_t = σ(W_i · [h_t-1, x_t] + b_i)  (Input)</li>
                  <li>C̃_t = tanh(W_c · [h_t-1, x_t] + b_c) (Candidate)</li>
                  <li>C_t = f_t * C_t-1 + i_t * C̃_t    (Cell State)</li>
                  <li>o_t = σ(W_o · [h_t-1, x_t] + b_o)  (Output)</li>
                  <li>h_t = o_t * tanh(C_t)             (Hidden)</li>
                </ul>
              </div>

              {/* XGBoost Formulation */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  XGBoost 2nd Order Taylor Loss
                </h5>
                <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <p>L^(t) ≈ ∑ [l(y_i, ŷ_i^(t-1)) + g_i f_t(x_i) + ½ h_i f_t²(x_i)] + Ω(f_t)</p>
                  <p className="text-[10px] text-slate-500">
                    g_i = ∂_ŷ l(y_i, ŷ^(t-1)), h_i = ∂²_ŷ l(y_i, ŷ^(t-1))
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Model Evaluation Table */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Experimental Benchmark Results Table
              </h4>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-3">Architecture Type</th>
                    <th className="py-2.5 px-3">MAE (°C)</th>
                    <th className="py-2.5 px-3">RMSE (°C)</th>
                    <th className="py-2.5 px-3">R² Score</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {MODEL_BENCHMARKS.map((m) => (
                    <tr
                      key={m.id}
                      className={
                        m.name.includes('Hybrid')
                          ? 'bg-teal-50/80 text-teal-950 font-bold'
                          : 'hover:bg-slate-50 transition'
                      }
                    >
                      <td className="py-2 px-3 font-sans font-semibold text-slate-900">{m.name}</td>
                      <td className="py-2 px-3 font-sans text-slate-500">{m.category}</td>
                      <td className="py-2 px-3">{m.maeTemp}</td>
                      <td className="py-2 px-3">{m.rmseTemp}</td>
                      <td className="py-2 px-3">{m.r2Score}</td>
                      <td className="py-2 px-3">{m.classificationAccuracy}%</td>
                      <td className="py-2 px-3">{m.f1Score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Viva Q&A Guide */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                5. Project Viva Defense Q&A Guide
              </h4>
            </div>

            <div className="space-y-2.5">
              {VIVA_QUESTIONS_GUIDE.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1.5"
                >
                  <span className="font-bold text-slate-900 block text-xs">
                    Q{idx + 1}: {item.q}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

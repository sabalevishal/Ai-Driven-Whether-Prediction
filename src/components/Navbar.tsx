import React from 'react';
import {
  CloudSun,
  BrainCircuit,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  RefreshCw,
  MapPin,
  Cpu,
} from 'lucide-react';
import { MLModelType, CityPreset } from '../types/weather';
import { INDIAN_CITY_PRESETS } from '../data/cityPresets';

interface NavbarProps {
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  selectedModel: MLModelType;
  onSelectModel: (model: MLModelType) => void;
  onOpenAiAssistant: () => void;
  onOpenResearchHub: () => void;
  onOpenDatasetModal: () => void;
  onResetToDefaults: () => void;
}

const MODELS: MLModelType[] = [
  'Linear Regression',
  'Random Forest',
  'XGBoost',
  'LSTM',
  'Hybrid (XGBoost + LSTM)',
];

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  selectedModel,
  onSelectModel,
  onOpenAiAssistant,
  onOpenResearchHub,
  onOpenDatasetModal,
  onResetToDefaults,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo and Project Identity */}
          <div className="flex items-center gap-3">
            <div
              id="logo-badge"
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-800 flex items-center justify-center shadow-md shadow-teal-700/20 ring-1 ring-teal-500/20"
            >
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-teal-950 flex items-center gap-1.5">
                  Atmospheric AI
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70">
                  TY B.Tech AI&DS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Hybrid LSTM-XGBoost Weather Prediction System
              </p>
            </div>
          </div>

          {/* Center Controls: City & ML Model */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* City Preset Selector */}
            <div className="relative flex items-center">
              <label htmlFor="city-select" className="sr-only">
                Select City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-teal-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  id="city-select"
                  value={selectedCity.id}
                  onChange={(e) => {
                    const found = INDIAN_CITY_PRESETS.find((c) => c.id === e.target.value);
                    if (found) onSelectCity(found);
                  }}
                  className="bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl pl-8 pr-7 py-1.5 border border-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium transition cursor-pointer shadow-xs"
                >
                  {INDIAN_CITY_PRESETS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.state.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model Architecture Selector */}
            <div className="relative flex items-center">
              <label htmlFor="model-select" className="sr-only">
                Select ML Model
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-indigo-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => onSelectModel(e.target.value as MLModelType)}
                  className="bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl pl-8 pr-7 py-1.5 border border-slate-200 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition cursor-pointer shadow-xs"
                >
                  {MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons: AI Assistant, Research Hub, Dataset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="btn-ai-assistant"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95"
              title="Open Gemini AI Weather Assistant"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            <button
              id="btn-research-hub"
              onClick={onOpenResearchHub}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition active:scale-95 shadow-xs"
              title="View Research Paper & Viva Defense Hub"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">Research & Viva</span>
            </button>

            <button
              id="btn-dataset-explorer"
              onClick={onOpenDatasetModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
              title="Explore Weather Dataset & Correlation Matrix"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span className="hidden xl:inline">Dataset</span>
            </button>

            <button
              id="btn-reset-defaults"
              onClick={onResetToDefaults}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition shadow-xs"
              title="Reset parameters to city defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

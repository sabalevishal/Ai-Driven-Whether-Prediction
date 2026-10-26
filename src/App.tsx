import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { WeatherInputForm } from './components/WeatherInputForm';
import { PredictionCard } from './components/PredictionCard';
import { RiskAlertsBanner } from './components/RiskAlertsBanner';
import { SevenDayForecast } from './components/SevenDayForecast';
import { ModelComparisonView } from './components/ModelComparisonView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ResearchPaperModal } from './components/ResearchPaperModal';
import { DatasetExplorer } from './components/DatasetExplorer';
import { INDIAN_CITY_PRESETS } from './data/cityPresets';
import { CityPreset, MLModelType, WeatherFeatures } from './types/weather';
import { runWeatherInference, generate7DayForecast } from './utils/mlEngine';
import { Sparkles, BrainCircuit, ExternalLink, X, Loader2, Copy, Check } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(INDIAN_CITY_PRESETS[0]);
  const [selectedModel, setSelectedModel] = useState<MLModelType>('Hybrid (XGBoost + LSTM)');
  const [features, setFeatures] = useState<WeatherFeatures>(INDIAN_CITY_PRESETS[0].defaultFeatures);

  // Modals state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isResearchHubOpen, setIsResearchHubOpen] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);

  // Deep AI Analysis report state
  const [isDeepAnalysisModalOpen, setIsDeepAnalysisModalOpen] = useState(false);
  const [deepAnalysisText, setDeepAnalysisText] = useState<string | null>(null);
  const [isDeepAnalysisLoading, setIsDeepAnalysisLoading] = useState(false);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);

  // Copy analysis to clipboard
  const handleCopyAnalysis = async () => {
    if (!deepAnalysisText) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(deepAnalysisText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = deepAnalysisText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedAnalysis(true);
      setTimeout(() => setCopiedAnalysis(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Handle City Change
  const handleSelectCity = (city: CityPreset) => {
    setSelectedCity(city);
    setFeatures(city.defaultFeatures);
  };

  // Reset to city defaults
  const handleResetDefaults = () => {
    setFeatures(selectedCity.defaultFeatures);
  };

  // Compute live ML prediction
  const prediction = useMemo(() => {
    return runWeatherInference(features, selectedModel);
  }, [features, selectedModel]);

  // Compute 7-day forecast sequence
  const sevenDayForecast = useMemo(() => {
    return generate7DayForecast(features, selectedModel, selectedCity.name);
  }, [features, selectedModel, selectedCity.name]);

  // Run deep AI meteorological analysis with Gemini
  const handleRunDeepAiAnalysis = async () => {
    setIsDeepAnalysisModalOpen(true);
    setIsDeepAnalysisLoading(true);
    setDeepAnalysisText(null);

    try {
      const res = await fetch('/api/gemini/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity.name,
          selectedModel,
          weatherData: {
            temperature: features.temperature,
            humidity: features.humidity,
            pressure: features.pressure,
            windSpeed: features.windSpeed,
            dewPoint: features.dewPoint,
            cloudCover: features.cloudCover,
            rainProbability: prediction.rainProbability,
            visibility: features.visibility,
          },
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setDeepAnalysisText(data.analysis || 'Analysis generated.');
    } catch (err: any) {
      setDeepAnalysisText(
        `Unable to generate deep synoptic analysis. (Details: ${err.message}).`
      );
    } finally {
      setIsDeepAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white font-sans antialiased">
      {/* Header Navigation */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenResearchHub={() => setIsResearchHubOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onResetToDefaults={handleResetDefaults}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Risk Alerts & Early Warning Detection Banner */}
        <RiskAlertsBanner alerts={prediction.riskAlerts} />

        {/* Top Split: Controls vs Hero Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Meteorological Parameter Controls */}
          <div className="lg:col-span-5 space-y-6">
            <WeatherInputForm features={features} onChange={setFeatures} />
          </div>

          {/* Right Column (7 cols): ML Prediction Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <PredictionCard
              prediction={prediction}
              features={features}
              cityName={selectedCity.name}
              onOpenAiAnalysis={handleRunDeepAiAnalysis}
            />

            {/* 7-Day Forecast Horizon */}
            <SevenDayForecast
              forecast={sevenDayForecast}
              cityName={selectedCity.name}
            />
          </div>
        </div>

        {/* Bottom Full-Width: Academic Model Comparison & Benchmarks */}
        <ModelComparisonView
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            Atmospheric AI • TY B.Tech AI & Data Science Capstone Project
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini 3.7 Flash & Search Grounding</span>
            <button
              onClick={() => setIsResearchHubOpen(true)}
              className="hover:text-teal-700 text-teal-600 font-semibold transition underline underline-offset-4"
            >
              Viva Defense Docs
            </button>
          </div>
        </div>
      </footer>

      {/* Gemini AI Weather Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        weatherFeatures={features}
        selectedModel={selectedModel}
        cityName={selectedCity.name}
        rainProbability={prediction.rainProbability}
        predictedTemp={prediction.predictedTemp}
      />

      {/* Research Paper & Viva Defense Hub Modal */}
      <ResearchPaperModal
        isOpen={isResearchHubOpen}
        onClose={() => setIsResearchHubOpen(false)}
      />

      {/* Dataset & Correlation Matrix Modal */}
      <DatasetExplorer
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
      />

      {/* Deep AI Synoptic Analysis Modal */}
      {isDeepAnalysisModalOpen && (
        <div
          id="deep-analysis-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-800 text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-teal-950 tracking-tight">
                    Meteorological & ML Synoptic Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Location: {selectedCity.name} • Model: {selectedModel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDeepAnalysisModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isDeepAnalysisLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <p className="font-medium">Generating synoptic meteorological synthesis via Gemini 3.7 Flash...</p>
                </div>
              ) : (
                <div className="relative group">
                  <div className="flex items-center justify-between pb-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Synoptic Synthesis Content
                    </span>
                    <button
                      id="btn-copy-analysis-inline"
                      onClick={handleCopyAnalysis}
                      disabled={!deepAnalysisText}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
                      title="Copy to Clipboard"
                    >
                      {copiedAnalysis ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-teal-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-sans text-slate-800 leading-relaxed">
                    {deepAnalysisText}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <button
                id="btn-copy-analysis-footer"
                onClick={handleCopyAnalysis}
                disabled={!deepAnalysisText || isDeepAnalysisLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {copiedAnalysis ? (
                  <>
                    <Check className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-700 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setIsDeepAnalysisModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

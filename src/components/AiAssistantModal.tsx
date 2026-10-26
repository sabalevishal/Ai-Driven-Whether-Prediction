import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  ExternalLink,
  Loader2,
  HelpCircle,
  MapPin,
  Flame,
  CloudRain,
  ShieldAlert,
} from 'lucide-react';
import { ChatMessage, WeatherFeatures, MLModelType } from '../types/weather';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherFeatures: WeatherFeatures;
  selectedModel: MLModelType;
  cityName: string;
  rainProbability: number;
  predictedTemp: number;
}

const SUGGESTED_PROMPTS = [
  'Will it rain tomorrow? Should I carry an umbrella?',
  'Explain why the LSTM model predicts rain differently than Random Forest.',
  'Is it safe for highway travel between Mumbai and Pune today?',
  'What agricultural/crop advisory applies to this temperature and humidity?',
  'Explain Dew Point Depression in weather forecasting.',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  weatherFeatures,
  selectedModel,
  cityName,
  rainProbability,
  predictedTemp,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **Meteorological AI Research Assistant** for **${cityName}**.\n\nCurrent Synoptic Profile:\n- **Model**: ${selectedModel}\n- **Predicted Temp**: ${predictedTemp.toFixed(1)}°C\n- **Rainfall Risk**: ${rainProbability}%\n- **Humidity**: ${weatherFeatures.humidity}%\n\nAsk me anything about current storm risks, 7-day projections, travel advisories, or machine learning algorithms!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          weatherContext: {
            city: cityName,
            selectedModel,
            predictedTemp,
            rainProbability,
            features: weatherFeatures,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No analysis available.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Meteorological Assistant Error**: Unable to reach AI server. (Details: ${error.message}). Please check API connectivity.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ai-chat-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="ai-chat-modal-content"
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-700 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-teal-950 tracking-tight">
                  Gemini AI Weather Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Search Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Context: {cityName} • {selectedModel} • {rainProbability}% Rain Risk
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested chips */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto flex gap-1.5 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition shrink-0 active:scale-95 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-700 text-white rounded-tr-none shadow-xs font-medium'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounding Web Sources if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Google Search Grounding Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-white hover:bg-slate-100 text-teal-700 border border-slate-200 transition font-semibold"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[150px]">
                            {src.title || src.uri}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-1 text-[10px] text-right text-slate-400 font-normal">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-700 border border-slate-200 flex items-center gap-2 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                <span>Running meteorological reasoning & search grounding...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask: 'Will it rain tomorrow?', 'Is it safe to travel?', etc..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
            />
            <button
              id="btn-send-ai-message"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

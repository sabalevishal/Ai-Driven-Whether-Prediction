import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Layers,
  X,
} from 'lucide-react';
import { HISTORICAL_SAMPLE_DATA, CORRELATION_MATRIX } from '../data/researchData';
import { HistoricalWeatherRecord } from '../types/weather';

interface DatasetExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'records' | 'correlation'>('records');

  if (!isOpen) return null;

  const filteredData = HISTORICAL_SAMPLE_DATA.filter((item) => {
    const matchesCity = cityFilter === 'All' || item.city === cityFilter;
    const matchesSearch =
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm);
    return matchesCity && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'City',
      'Temperature_C',
      'Humidity_Pct',
      'Pressure_hPa',
      'WindSpeed_kmh',
      'CloudCover_Pct',
      'DewPoint_C',
      'Rainfall_mm',
      'Condition',
    ];
    const rows = HISTORICAL_SAMPLE_DATA.map((r) => [
      r.id,
      r.date,
      r.city,
      r.temperature,
      r.humidity,
      r.pressure,
      r.windSpeed,
      r.cloudCover,
      r.dewPoint,
      r.rainfall,
      `"${r.condition}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'indian_weather_historical_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getHeatmapColor = (val: number) => {
    if (val === 1.0) return 'bg-teal-700 text-white font-bold';
    if (val > 0.7) return 'bg-teal-600/90 text-white font-semibold';
    if (val > 0.4) return 'bg-teal-100 text-teal-950 font-semibold';
    if (val > 0) return 'bg-slate-50 text-slate-700';
    if (val > -0.4) return 'bg-slate-50 text-slate-500';
    if (val > -0.7) return 'bg-rose-100 text-rose-900 font-semibold';
    return 'bg-rose-600 text-white font-bold';
  };

  return (
    <div
      id="dataset-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="dataset-modal-content"
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-teal-950 tracking-tight">
                Historical Weather Training Dataset & Feature Space
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Multi-station dataset spanning Pune, Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-close-dataset-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle & Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex bg-slate-200/70 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('records')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'records'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Records Table ({filteredData.length})
            </button>
            <button
              onClick={() => setViewMode('correlation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'correlation'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pearson Correlation Matrix
            </button>
          </div>

          {viewMode === 'records' && (
            <div className="flex items-center gap-2">
              {/* City filter */}
              <div className="relative">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-white text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="All">All Stations</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search condition/date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-44"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 max-h-[60vh]">
          {viewMode === 'records' ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">Temp (°C)</th>
                    <th className="py-2.5 px-3">Humidity (%)</th>
                    <th className="py-2.5 px-3">Pressure (hPa)</th>
                    <th className="py-2.5 px-3">Wind (km/h)</th>
                    <th className="py-2.5 px-3">Cloud (%)</th>
                    <th className="py-2.5 px-3">Dew Point (°C)</th>
                    <th className="py-2.5 px-3">Rain (mm)</th>
                    <th className="py-2.5 px-3">Ground Truth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 text-slate-400">{row.date}</td>
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">
                        {row.city}
                      </td>
                      <td className="py-2 px-3 font-semibold">{row.temperature}</td>
                      <td className="py-2 px-3">{row.humidity}%</td>
                      <td className="py-2 px-3">{row.pressure}</td>
                      <td className="py-2 px-3">{row.windSpeed}</td>
                      <td className="py-2 px-3">{row.cloudCover}%</td>
                      <td className="py-2 px-3">{row.dewPoint}</td>
                      <td className="py-2 px-3 font-bold text-blue-600">
                        {row.rainfall}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {row.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs text-slate-500 font-medium block">
                Calculated Pearson Correlation Matrix ($r \in [-1, +1]$) highlighting strong collinearity between Relative Humidity, Dew Point, and Precipitation Probability.
              </span>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-center border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-3 text-left">Feature</th>
                      <th className="py-3 px-3">Temp</th>
                      <th className="py-3 px-3">Humidity</th>
                      <th className="py-3 px-3">Pressure</th>
                      <th className="py-3 px-3">Dew Point</th>
                      <th className="py-3 px-3">Rain Prob</th>
                      <th className="py-3 px-3">Cloud Cover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {CORRELATION_MATRIX.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 text-left font-sans font-bold text-slate-800 bg-slate-50">
                          {row.feature}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.Temp)}`}>
                          {row.Temp.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.Humidity)}`}>
                          {row.Humidity.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.Pressure)}`}>
                          {row.Pressure.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.DewPoint)}`}>
                          {row.DewPoint.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.RainProb)}`}>
                          {row.RainProb.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 ${getHeatmapColor(row.CloudCover)}`}>
                          {row.CloudCover.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

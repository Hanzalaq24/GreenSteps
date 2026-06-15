import React from 'react';
import { HistoricalEntry } from '../types';
import { getHistoricalData } from '../utils/carbonCalc';
import { TrendingUp, TrendingDown, Minus, History } from 'lucide-react';

interface HistoricalChartProps {
  currentFootprint: number;
}

export default function HistoricalChart({ currentFootprint }: HistoricalChartProps) {
  const history = getHistoricalData();

  if (history.length < 2) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Monthly Trend</h3>
        </div>
        <p className="text-gray-400 text-sm">
          {history.length === 0
            ? 'Complete your first assessment to start tracking progress.'
            : 'Complete another assessment next month to see your trend.'}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr'].map(month => (
            <div key={month} className="text-center">
              <div className="h-20 bg-white/5 rounded-lg flex items-end justify-center p-1">
                <div className="w-full bg-white/10 rounded" style={{ height: `${Math.random() * 60 + 20}%` }} />
              </div>
              <div className="text-[10px] text-gray-500 mt-1">{month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);
  const maxFootprint = Math.max(...sortedHistory.map(h => h.footprint.total));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold">Monthly Trend</h3>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-32 mb-4">
        {sortedHistory.map((entry, idx) => {
          const height = maxFootprint > 0 ? (entry.footprint.total / maxFootprint) * 100 : 0;
          const isLatest = idx === sortedHistory.length - 1;
          const prevTotal = idx > 0 ? sortedHistory[idx - 1].footprint.total : null;
          const change = prevTotal !== null ? entry.footprint.total - prevTotal : 0;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] text-gray-400">{Math.round(entry.footprint.total)}kg</div>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${isLatest ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent' : ''}`}
                style={{
                  height: `${Math.max(height, 8)}%`,
                  backgroundColor: isLatest ? '#3b82f6' : change < 0 ? '#10b981' : change > 0 ? '#ef4444' : '#6b7280'
                }}
              />
              <div className="text-[10px] text-gray-400">{entry.month}</div>
            </div>
          );
        })}
      </div>

      {/* Trend Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          {sortedHistory.length >= 2 && (
            <div className="flex items-center gap-2">
              {sortedHistory[sortedHistory.length - 1].footprint.total < sortedHistory[sortedHistory.length - 2].footprint.total ? (
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              ) : sortedHistory[sortedHistory.length - 1].footprint.total > sortedHistory[sortedHistory.length - 2].footprint.total ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">
                {sortedHistory.length} month{sortedHistory.length > 1 ? 's' : ''} tracked
              </span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400">Best Month</div>
          <div className="text-sm font-semibold text-emerald-400">
            {Math.round(Math.min(...sortedHistory.map(h => h.footprint.total)))}kg
          </div>
        </div>
      </div>
    </div>
  );
}

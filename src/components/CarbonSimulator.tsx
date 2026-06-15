import React, { useState, useMemo } from 'react';
import { SimulationScenario, CarbonBreakdown, AssessmentAnswers } from '../types';
import { generateSimulationScenarios, calculateCombinedScenario, getCarbonScore } from '../utils/carbonCalc';
import { Zap, TrendingDown, Check, ArrowRight } from 'lucide-react';

interface CarbonSimulatorProps {
  footprint: CarbonBreakdown;
  answers: AssessmentAnswers;
  onProjectionChange: (projected: CarbonBreakdown, savings: number) => void;
}

const categoryColors: Record<string, string> = {
  transportation: '#3b82f6',
  electricity: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6'
};

const categoryLabels: Record<string, string> = {
  transportation: 'Transport',
  electricity: 'Electricity',
  food: 'Food',
  shopping: 'Shopping'
};

export default function CarbonSimulator({ footprint, answers, onProjectionChange }: CarbonSimulatorProps) {
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);

  const scenarios = useMemo(() => generateSimulationScenarios(footprint, answers), [footprint, answers]);

  const { projected, totalSavings } = useMemo(
    () => calculateCombinedScenario(footprint, answers, activeScenarios),
    [footprint, answers, activeScenarios]
  );

  const projectedScore = getCarbonScore(projected);

  React.useEffect(() => {
    onProjectionChange(projected, totalSavings);
  }, [projected, totalSavings]);

  const toggleScenario = (id: string) => {
    setActiveScenarios(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">Carbon Reduction Simulator</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Your current lifestyle choices have a low carbon impact. Great job!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold">Carbon Reduction Simulator</h3>
      </div>
      <p className="text-gray-400 text-xs mb-5">Toggle scenarios below to see projected impact</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {scenarios.map(scenario => {
          const isActive = activeScenarios.includes(scenario.id);
          const color = categoryColors[scenario.category];
          return (
            <button
              key={scenario.id}
              onClick={() => toggleScenario(scenario.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'border-opacity-100 bg-opacity-10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              style={isActive ? { borderColor: color, backgroundColor: `${color}15` } : {}}
            >
              <div className="flex items-start gap-2.5">
                <div className="text-xl mt-0.5">{scenario.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{scenario.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{scenario.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">
                      -{scenario.reductionPercent}% · Save {scenario.monthlySavings}kg/month
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Projected Summary */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-300">Projected Impact</span>
          {activeScenarios.length > 0 && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              {activeScenarios.length} scenario{activeScenarios.length > 1 ? 's' : ''} active
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {(['transportation', 'electricity', 'food', 'shopping'] as const).map(cat => {
            const diff = footprint[cat] - projected[cat];
            return (
              <div key={cat} className="text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{categoryLabels[cat]}</div>
                <div className="text-xs text-gray-500 line-through">{footprint[cat]}kg</div>
                <div className="text-sm font-semibold" style={{ color: categoryColors[cat] }}>
                  {projected[cat]}kg
                </div>
                {diff > 0 && (
                  <div className="text-[10px] text-emerald-400">-{diff}kg</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <div className="text-xs text-gray-400">Total Monthly Savings</div>
            <div className="text-lg font-bold text-emerald-400">
              {totalSavings > 0 ? `-${Math.round(totalSavings)}kg CO₂` : 'No changes'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">New Score</div>
            <div className="text-lg font-bold" style={{
              color: projectedScore > getCarbonScore(footprint) ? '#10b981' : projectedScore < getCarbonScore(footprint) ? '#ef4444' : '#9ca3af'
            }}>
              {activeScenarios.length > 0 ? projectedScore : getCarbonScore(footprint)}/100
            </div>
          </div>
        </div>

        {totalSavings > 0 && (
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{Math.round(totalSavings * 12)}kg CO₂/year</span>
            <span>saved — that's like planting <span className="text-emerald-400 font-semibold">{Math.round(totalSavings * 12 / 22)} trees</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

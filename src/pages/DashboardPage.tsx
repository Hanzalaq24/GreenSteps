import { useState } from 'react';
import { AssessmentAnswers, CarbonBreakdown, HistoricalEntry } from '../types';
import { getCarbonScore, getScoreMessage, getBiggestPolluter, getPolluterPercentage, getRegionComparison, generatePersonalizedInsights } from '../utils/carbonCalc';
import AnimatedCounter from '../components/AnimatedCounter';
import CarbonSimulator from '../components/CarbonSimulator';
import HistoricalChart from '../components/HistoricalChart';
import PersonalizedInsights from '../components/PersonalizedInsights';
import { ArrowLeft, TrendingDown, Target, Zap, Car, Utensils, ShoppingBag, AlertCircle } from 'lucide-react';

interface DashboardPageProps {
  footprint: CarbonBreakdown;
  answers: AssessmentAnswers;
  history: HistoricalEntry[];
  setPage: (p: string) => void;
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;

  const segmentsData = segments.map((seg) => {
    const percentage = (seg.value / total) * 100;
    const startAngle = (cumulative / 100) * 360;
    cumulative += percentage;
    const endAngle = (cumulative / 100) * 360;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const largeArc = percentage > 50 ? 1 : 0;

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const ix1 = 100 + 55 * Math.cos(startRad);
    const iy1 = 100 + 55 * Math.sin(startRad);
    const ix2 = 100 + 55 * Math.cos(endRad);
    const iy2 = 100 + 55 * Math.sin(endRad);

    const path = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A 80 80 ${largeArc} 0 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A 55 55 ${largeArc} 0 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');

    return { ...seg, path, percentage };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-52 h-52">
        {segmentsData.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{seg.label}: {Math.round(seg.percentage)}%</title>
          </path>
        ))}
        <circle cx="100" cy="100" r="45" fill="white" />
        <text x="100" y="95" textAnchor="middle" className="fill-gray-900 text-2xl font-bold" style={{ fontSize: '18px' }}>
          {Math.round(total)}%
        </text>
        <text x="100" y="115" textAnchor="middle" className="fill-gray-500" style={{ fontSize: '10px' }}>
          Breakdown
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-3 mt-6 w-full">
        {segmentsData.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <div>
              <div className="text-xs text-gray-500">{seg.label}</div>
              <div className="text-sm font-bold text-gray-900">{Math.round(seg.percentage)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBar({ label, value, maxValue, color, icon }: { label: string; value: number; maxValue: number; color: string; icon: React.ReactNode }) {
  const percentage = Math.max(5, Math.min(100, (value / maxValue) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{icon}</span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{value}kg CO₂</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage({ footprint, answers, history, setPage }: DashboardPageProps) {
  const score = getCarbonScore(footprint);
  const message = getScoreMessage(score);
  const regionComparison = getRegionComparison(footprint);
  const biggestPolluter = getBiggestPolluter(footprint);
  const percentages = getPolluterPercentage(footprint);
  const target = Math.round(footprint.total * 0.8);
  const reductionNeeded = footprint.total - target;
  const reductionPercent = Math.round((reductionNeeded / footprint.total) * 100);
  const insights = generatePersonalizedInsights(footprint, answers, history);

  const [projectedFootprint, setProjectedFootprint] = useState<CarbonBreakdown | null>(null);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleProjectionChange = (projected: CarbonBreakdown, savings: number) => {
    setProjectedFootprint(projected);
    setTotalSavings(savings);
  };

  const chartSegments = [
    { value: percentages.transportation, color: '#3B82F6', label: 'Transport' },
    { value: percentages.electricity, color: '#F59E0B', label: 'Electricity' },
    { value: percentages.food, color: '#10B981', label: 'Food' },
    { value: percentages.shopping, color: '#EC4899', label: 'Shopping' },
  ];

  const maxCategory = Math.max(footprint.transportation, footprint.electricity, footprint.food, footprint.shopping);

  const scoreBg = score >= 70 ? 'from-green-500 to-emerald-500' : score >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500';

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => setPage('home')}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Carbon Dashboard</h1>
          </div>
          <button
            onClick={() => setPage('actionplan')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-green-600/25 transition-all"
          >
            View Action Plan →
          </button>
        </div>

        {/* Score Card */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${scoreBg} p-8 sm:p-10 text-white mb-8 shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/10 rounded-full translate-y-1/2" />
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-sm font-medium text-white/80 mb-1">Your Carbon Score</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-extrabold">
                    <AnimatedCounter target={score} />
                  </span>
                  <span className="text-2xl text-white/70">/100</span>
                </div>
                <p className="mt-3 text-lg text-white/90">{message}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-xs">🌍 {regionComparison}</span>
                </div>
              </div>
              <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{score}</div>
                  <div className="text-xs text-white/70">Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: 2 columns on desktop */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Monthly Stats */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              This Month
            </h3>
            <div className="space-y-5">
              <div>
                <div className="text-sm text-gray-500 mb-1">Estimated Carbon</div>
                <div className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter target={Math.round(footprint.total)} suffix="kg" /> CO₂
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Target</div>
                <div className="text-2xl font-bold text-green-600">{target}kg CO₂</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Reduction Needed</span>
                  <span className="text-lg font-bold text-green-700">{reductionPercent}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div className="h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: `${100 - reductionPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Polluter Chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Biggest Polluter: {biggestPolluter}
            </h3>
            <DonutChart segments={chartSegments} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Emissions by Category</h3>
            <div className="space-y-5">
              <HorizontalBar label="Transportation" value={Math.round(footprint.transportation)} maxValue={maxCategory} color="#3B82F6" icon={<Car className="w-4 h-4" />} />
              <HorizontalBar label="Electricity" value={Math.round(footprint.electricity)} maxValue={maxCategory} color="#F59E0B" icon={<Zap className="w-4 h-4" />} />
              <HorizontalBar label="Food" value={Math.round(footprint.food)} maxValue={maxCategory} color="#10B981" icon={<Utensils className="w-4 h-4" />} />
              <HorizontalBar label="Shopping" value={Math.round(footprint.shopping)} maxValue={maxCategory} color="#EC4899" icon={<ShoppingBag className="w-4 h-4" />} />
            </div>
          </div>

          {/* Next Goal */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Next Goal
              </h3>
              <div className="text-center py-6">
                <div className="text-5xl font-extrabold text-green-600 mb-2">
                  -{Math.round(reductionNeeded)}kg
                </div>
                <p className="text-gray-600 text-lg">Save more to reach your target</p>
                <p className="text-sm text-gray-500 mt-1">Target: {target}kg CO₂/month</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <p className="text-sm font-semibold text-green-800 mb-2">💡 Quick Win</p>
              <p className="text-sm text-green-700">
                {footprint.transportation > footprint.electricity && footprint.transportation > footprint.food && footprint.transportation > footprint.shopping
                  ? 'Switching to public transport just twice a week could save ~22kg CO₂/month.'
                  : footprint.electricity > footprint.food
                  ? 'Switching all lights to LED could save ~40kg CO₂/month.'
                  : 'Reducing shopping frequency could save ~500kg CO₂/month.'}
              </p>
            </div>
          </div>
        </div>

        {/* Carbon Reduction Simulator */}
        <div className="mb-8">
          <CarbonSimulator
            footprint={footprint}
            answers={answers}
            onProjectionChange={handleProjectionChange}
          />
        </div>

        {/* Projection Comparison */}
        {projectedFootprint && totalSavings > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              🌳 Your Green Journey Projection
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Current Monthly</div>
                <div className="text-2xl font-bold text-gray-900">{Math.round(footprint.total)}kg</div>
                <div className="text-xs text-gray-400">CO₂ per month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Projected Monthly</div>
                <div className="text-2xl font-bold text-green-600">{Math.round(projectedFootprint.total)}kg</div>
                <div className="text-xs text-gray-400">CO₂ per month</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              Implementing these changes for a year saves <span className="text-green-600 font-bold">{Math.round(totalSavings * 12)}kg CO₂</span> — 
              equivalent to planting <span className="text-green-600 font-bold">{Math.round(totalSavings * 12 / 22)} trees</span> 🌳
            </div>
          </div>
        )}

        {/* Historical Trend */}
        <div className="mb-8">
          <HistoricalChart currentFootprint={footprint.total} />
        </div>

        {/* Personalized Insights */}
        <div className="mb-8">
          <PersonalizedInsights insights={insights} />
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setPage('actionplan')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all"
          >
            View Your Personalized Action Plan
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

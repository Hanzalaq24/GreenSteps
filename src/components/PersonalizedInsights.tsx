import React from 'react';
import { PersonalizedInsight } from '../types';
import { AlertTriangle, Lightbulb, Award, TrendingUp, Sparkles } from 'lucide-react';

interface PersonalizedInsightsProps {
  insights: PersonalizedInsight[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string }> = {
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  tip: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  achievement: {
    icon: <Award className="w-4 h-4" />,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  projection: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)'
  }
};

const impactBadge: Record<string, { label: string; color: string }> = {
  high: { label: 'High Impact', color: '#ef4444' },
  medium: { label: 'Medium Impact', color: '#f59e0b' },
  low: { label: 'Low Impact', color: '#6b7280' }
};

export default function PersonalizedInsights({ insights }: PersonalizedInsightsProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Personalized Insights</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Complete an assessment to receive personalized insights about your carbon footprint.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Personalized Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 6).map(insight => {
          const config = typeConfig[insight.type];
          const impact = impactBadge[insight.impact];
          return (
            <div
              key={insight.id}
              className="rounded-xl p-4 border transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5" style={{ color: config.color }}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{insight.title}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${impact.color}20`, color: impact.color }}
                    >
                      {impact.label}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

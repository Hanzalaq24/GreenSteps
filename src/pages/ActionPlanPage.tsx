import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, Leaf, Lightbulb, Flame, Sparkles } from 'lucide-react';
import { ActionItem, EcoChallenge } from '../types';
import { getDefaultChallenges } from '../utils/carbonCalc';

interface ActionPlanPageProps {
  actions: ActionItem[];
  setPage: (p: string) => void;
}

export default function ActionPlanPage({ actions, setPage }: ActionPlanPageProps) {
  const [challenges, setChallenges] = useState<EcoChallenge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('greensteps-challenges');
    if (saved) {
      const parsed = JSON.parse(saved) as EcoChallenge[];
      setChallenges(parsed);
    } else {
      setChallenges(getDefaultChallenges());
    }

    const savedCompleted = localStorage.getItem('greensteps-completed');
    if (savedCompleted) {
      const parsed = JSON.parse(savedCompleted) as string[];
      setCompletedChallenges(parsed);
    }
  }, []);

  useEffect(() => {
    const points = challenges
      .filter((c) => completedChallenges.includes(c.id))
      .reduce((sum, c) => sum + c.points, 0);
    setTotalPoints(points);
  }, [challenges, completedChallenges]);

  const toggleChallenge = (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return;

    if (completedChallenges.includes(id)) {
      setCompletedChallenges(completedChallenges.filter((cId) => cId !== id));
    } else {
      setCompletedChallenges([...completedChallenges, id]);
      setCelebratingId(id);
      setTimeout(() => setCelebratingId(null), 1500);
    }

    localStorage.setItem('greensteps-completed', JSON.stringify(completedChallenges.includes(id)
      ? completedChallenges.filter((cId) => cId !== id)
      : [...completedChallenges, id]
    ));
  };

  const getLevel = () => {
    if (totalPoints >= 60) return { title: 'Climate Champion', emoji: '🏆', color: 'from-purple-600 to-indigo-600' };
    if (totalPoints >= 40) return { title: 'Eco Warrior', emoji: '⚔️', color: 'from-blue-600 to-cyan-600' };
    if (totalPoints >= 20) return { title: 'Green Warrior', emoji: '🌿', color: 'from-green-600 to-emerald-600' };
    return { title: 'Green Beginner', emoji: '🌱', color: 'from-green-500 to-lime-500' };
  };

  const level = getLevel();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setPage('home')}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Personalized Action Plan</h1>
          <p className="text-gray-600 mt-2">Concrete steps to reduce your carbon footprint</p>
        </div>

        {/* Gamification Card */}
        <div className={`rounded-3xl bg-gradient-to-br ${level.color} p-8 text-white mb-8 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-white/70 font-medium mb-1">Your Eco Level</div>
              <div className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
                <span>{level.emoji}</span>
                <span>{level.title}</span>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-3 max-w-xs">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalPoints / 60) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-white/70 mt-1">
                {totalPoints}/60 points to max level
              </div>
            </div>
            <div className="text-center bg-white/20 rounded-2xl px-6 py-4">
              <div className="text-4xl font-extrabold">{totalPoints}</div>
              <div className="text-sm text-white/70">Eco Points</div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Your Action Items
          </h2>

          {Object.entries(groupedActions).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((action, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-5 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{action.title}</h4>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(action.difficulty)}`}>
                        {action.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-2">
                      <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-green-700">Saves {action.savings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Eco Challenges */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Eco Challenges</h2>
              <p className="text-sm text-gray-500">Complete challenges to earn Eco Points!</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {challenges.map((challenge) => {
              const isCompleted = completedChallenges.includes(challenge.id);
              const isCelebrating = celebratingId === challenge.id;
              return (
                <button
                  key={challenge.id}
                  onClick={() => toggleChallenge(challenge.id)}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
                    isCompleted
                      ? 'border-green-300 bg-green-50 shadow-md shadow-green-100'
                      : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-md'
                  } ${isCelebrating ? 'scale-105 ring-4 ring-green-300' : ''}`}
                >
                  {isCelebrating && (
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                      +{challenge.points} ✨
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                      <div className="flex items-center gap-1 mt-3">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-600">+{challenge.points} Eco Points</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">🌍 Every Step Counts</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            If everyone made even one of these changes, we could collectively reduce carbon emissions by millions of tons. You have the power.
          </p>
          <button
            onClick={() => setPage('dashboard')}
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

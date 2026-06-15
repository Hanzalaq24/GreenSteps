import { useState, useEffect } from 'react';
import { AssessmentAnswers, CarbonBreakdown, ActionItem } from './types';
import { calculateCarbonFootprint, generateActionPlan } from './utils/carbonCalc';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import ActionPlanPage from './pages/ActionPlanPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [footprint, setFootprint] = useState<CarbonBreakdown | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('greensteps-answers');
    if (saved) {
      const answers = JSON.parse(saved) as AssessmentAnswers;
      const fp = calculateCarbonFootprint(answers);
      setFootprint(fp);
      setActions(generateActionPlan(answers));
    }
  }, []);

  const handleAssessmentComplete = (answers: AssessmentAnswers) => {
    const fp = calculateCarbonFootprint(answers);
    const actionItems = generateActionPlan(answers);
    setFootprint(fp);
    setActions(actionItems);
    localStorage.setItem('greensteps-answers', JSON.stringify(answers));
    setPage('dashboard');
  };

  // For the demo, show a pre-computed dashboard
  const getDemoFootprint = (): CarbonBreakdown => {
    if (footprint) return footprint;
    return {
      transportation: 180,
      electricity: 1640,
      food: 2500,
      shopping: 1200,
      total: 5520
    };
  };

  const demoFootprint = getDemoFootprint();
  const demoActions = actions.length > 0 ? actions : generateActionPlan({
    travelDistance: 15,
    vehicleType: 'car_petrol',
    electricityBill: 2000,
    foodPreference: 'veg',
    shoppingFrequency: 'monthly'
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation page={page} setPage={setPage} />

      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'assessment' && (
        <AssessmentPage onComplete={handleAssessmentComplete} setPage={setPage} />
      )}
      {page === 'dashboard' && <DashboardPage footprint={demoFootprint} setPage={setPage} />}
      {page === 'actionplan' && <ActionPlanPage actions={demoActions} setPage={setPage} />}
    </div>
  );
}

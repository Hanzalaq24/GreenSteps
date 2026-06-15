import { useState, useEffect } from 'react';
import { AssessmentAnswers, CarbonBreakdown, ActionItem, HistoricalEntry } from './types';
import { calculateCarbonFootprint, generateActionPlan, saveHistoricalEntry, getHistoricalData } from './utils/carbonCalc';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import ActionPlanPage from './pages/ActionPlanPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [footprint, setFootprint] = useState<CarbonBreakdown | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [history, setHistory] = useState<HistoricalEntry[]>([]);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('greensteps-answers');
    if (saved) {
      const parsed = JSON.parse(saved) as AssessmentAnswers;
      const fp = calculateCarbonFootprint(parsed);
      setFootprint(fp);
      setActions(generateActionPlan(parsed));
      setAnswers(parsed);
    }
    setHistory(getHistoricalData());
  }, []);

  const handleAssessmentComplete = (newAnswers: AssessmentAnswers) => {
    const fp = calculateCarbonFootprint(newAnswers);
    const actionItems = generateActionPlan(newAnswers);
    setFootprint(fp);
    setActions(actionItems);
    setAnswers(newAnswers);
    localStorage.setItem('greensteps-answers', JSON.stringify(newAnswers));
    saveHistoricalEntry(newAnswers, fp);
    setHistory(getHistoricalData());
    setPage('dashboard');
  };

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

  const getDemoAnswers = (): AssessmentAnswers => {
    if (answers) return answers;
    return {
      travelDistance: 15,
      vehicleType: 'car_petrol',
      electricityBill: 2000,
      foodPreference: 'veg',
      shoppingFrequency: 'monthly'
    };
  };

  const demoFootprint = getDemoFootprint();
  const demoAnswers = getDemoAnswers();
  const demoActions = actions.length > 0 ? actions : generateActionPlan(demoAnswers);

  return (
    <div className="min-h-screen bg-white">
      <Navigation page={page} setPage={setPage} />

      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'assessment' && (
        <AssessmentPage onComplete={handleAssessmentComplete} setPage={setPage} />
      )}
      {page === 'dashboard' && (
        <DashboardPage
          footprint={demoFootprint}
          answers={demoAnswers}
          history={history}
          setPage={setPage}
        />
      )}
      {page === 'actionplan' && <ActionPlanPage actions={demoActions} setPage={setPage} />}
    </div>
  );
}

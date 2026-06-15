import { AssessmentAnswers, CarbonBreakdown, ActionItem, EcoChallenge, SimulationScenario, HistoricalEntry, PersonalizedInsight } from '../types';

// Emission factors (kg CO2)
const EMISSION_FACTORS = {
  // per km
  transport: {
    walk: 0,
    cycle: 0,
    public: 0.05,    // bus/train per km
    bike: 0.1,       // motorcycle
    car_petrol: 0.21,
    car_diesel: 0.17,
    car_ev: 0.05,
    auto: 0.12
  },
  // per rupee electricity bill
  electricity: 0.82,
  // per month base
  food: {
    vegan: 1500,
    veg: 2500,
    omnivore: 3800,
    non_veg: 3300
  },
  // per month base
  shopping: {
    rare: 500,
    monthly: 1200,
    weekly: 2500,
    daily: 4500
  }
};

export function calculateCarbonFootprint(answers: AssessmentAnswers): CarbonBreakdown {
  const dailyTransport = answers.travelDistance * EMISSION_FACTORS.transport[answers.vehicleType];
  const monthlyTransport = dailyTransport * 30;
  
  const monthlyElectricity = answers.electricityBill * EMISSION_FACTORS.electricity;
  const monthlyFood = EMISSION_FACTORS.food[answers.foodPreference];
  const monthlyShopping = EMISSION_FACTORS.shopping[answers.shoppingFrequency];
  
  const total = monthlyTransport + monthlyElectricity + monthlyFood + monthlyShopping;

  return {
    transportation: Math.round(monthlyTransport * 100) / 100,
    electricity: Math.round(monthlyElectricity * 100) / 100,
    food: Math.round(monthlyFood * 100) / 100,
    shopping: Math.round(monthlyShopping * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

export function getCarbonScore(footprint: CarbonBreakdown): number {
  const maxFootprint = 12000;
  const score = Math.max(5, Math.min(100, Math.round(100 - (footprint.total / maxFootprint) * 100)));
  return score;
}

export function getScoreMessage(score: number): string {
  if (score >= 85) return "Excellent! You're a climate leader! 🌟";
  if (score >= 70) return "Great job! Above average for your region 👍";
  if (score >= 50) return "Good start, but there's room for improvement 💪";
  if (score >= 30) return "Your footprint is higher than average. Let's fix that! ⚡";
  return "Your carbon footprint needs attention. Let's take action! 🚨";
}

export function getRegionComparison(footprint: CarbonBreakdown): string {
  const indianAverage = 800;
  const diff = footprint.total - indianAverage;
  if (diff < -200) return "Much below Indian average";
  if (diff < 0) return "Slightly below Indian average";
  if (diff < 200) return "Close to Indian average";
  if (diff < 1000) return "Above Indian average";
  return "Significantly above Indian average";
}

export function getBiggestPolluter(footprint: CarbonBreakdown): string {
  const entries = [
    { name: 'Transportation', value: footprint.transportation },
    { name: 'Electricity', value: footprint.electricity },
    { name: 'Food', value: footprint.food },
    { name: 'Shopping', value: footprint.shopping }
  ];
  entries.sort((a, b) => b.value - a.value);
  return entries[0].name;
}

export function getPolluterPercentage(footprint: CarbonBreakdown): Record<string, number> {
  const total = footprint.total || 1; // Prevent division by zero
  return {
    transportation: Math.round((footprint.transportation / total) * 100),
    electricity: Math.round((footprint.electricity / total) * 100),
    food: Math.round((footprint.food / total) * 100),
    shopping: Math.round((footprint.shopping / total) * 100)
  };
}

// ===== HISTORICAL TRACKING =====

export function saveHistoricalEntry(answers: AssessmentAnswers, footprint: CarbonBreakdown): void {
  const history = getHistoricalData();
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const newEntry: HistoricalEntry = {
    date: now.toISOString(),
    month: monthNames[now.getMonth()],
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
    answers,
    footprint,
    score: getCarbonScore(footprint)
  };

  // Check if entry for this month already exists
  const existingIndex = history.findIndex(
    e => e.monthIndex === now.getMonth() && e.year === now.getFullYear()
  );

  if (existingIndex >= 0) {
    history[existingIndex] = newEntry;
  } else {
    history.push(newEntry);
  }

  localStorage.setItem('greensteps-history', JSON.stringify(history));
}

export function getHistoricalData(): HistoricalEntry[] {
  try {
    const saved = localStorage.getItem('greensteps-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Corrupted data — return empty
  }
  return [];
}

export function getMonthlyTrend(): { month: string; total: number; score: number }[] {
  const history = getHistoricalData();
  return history
    .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
    .map(entry => ({
      month: entry.month,
      total: entry.footprint.total,
      score: entry.score
    }));
}

// ===== CARBON REDUCTION SIMULATOR =====

export function generateSimulationScenarios(footprint: CarbonBreakdown, answers: AssessmentAnswers): SimulationScenario[] {
  const scenarios: SimulationScenario[] = [];

  // Transportation scenarios
  if (answers.vehicleType === 'car_petrol' || answers.vehicleType === 'car_diesel') {
    const currentTransport = footprint.transportation;
    
    scenarios.push({
      id: 'public-transport',
      name: 'Switch to Public Transport',
      description: `Replace your ${answers.vehicleType === 'car_petrol' ? 'petrol' : 'diesel'} car with bus/train for daily commute`,
      icon: '🚌',
      category: 'transportation',
      reductionPercent: 76,
      currentEmissions: currentTransport,
      projectedEmissions: Math.round(currentTransport * 0.24),
      monthlySavings: Math.round(currentTransport * 0.76),
      annualSavings: Math.round(currentTransport * 0.76 * 12)
    });

    scenarios.push({
      id: 'carpool',
      name: 'Start Carpooling',
      description: 'Share your daily commute with 1 colleague',
      icon: '🚗',
      category: 'transportation',
      reductionPercent: 50,
      currentEmissions: currentTransport,
      projectedEmissions: Math.round(currentTransport * 0.5),
      monthlySavings: Math.round(currentTransport * 0.5),
      annualSavings: Math.round(currentTransport * 0.5 * 12)
    });

    scenarios.push({
      id: 'ev-switch',
      name: 'Switch to Electric Vehicle',
      description: 'Replace your current car with an EV',
      icon: '⚡',
      category: 'transportation',
      reductionPercent: 76,
      currentEmissions: currentTransport,
      projectedEmissions: Math.round(currentTransport * 0.24),
      monthlySavings: Math.round(currentTransport * 0.76),
      annualSavings: Math.round(currentTransport * 0.76 * 12)
    });
  } else if (answers.vehicleType === 'bike') {
    scenarios.push({
      id: 'bus-long-trips',
      name: 'Use Bus for Long Trips',
      description: 'For trips over 10km, use public transport instead of motorbike',
      icon: '🚌',
      category: 'transportation',
      reductionPercent: 50,
      currentEmissions: footprint.transportation,
      projectedEmissions: Math.round(footprint.transportation * 0.5),
      monthlySavings: Math.round(footprint.transportation * 0.5),
      annualSavings: Math.round(footprint.transportation * 0.5 * 12)
    });
  }

  // Electricity scenarios
  scenarios.push({
    id: 'led-lights',
    name: 'Switch to LED Lighting',
    description: 'Replace all bulbs with LED lights - saves 75% lighting energy',
    icon: '💡',
    category: 'electricity',
    reductionPercent: 15,
    currentEmissions: footprint.electricity,
    projectedEmissions: Math.round(footprint.electricity * 0.85),
    monthlySavings: Math.round(footprint.electricity * 0.15),
    annualSavings: Math.round(footprint.electricity * 0.15 * 12)
  });

  scenarios.push({
    id: 'solar-panels',
    name: 'Install Solar Panels',
    description: '1kW rooftop solar can offset 80% of electricity emissions',
    icon: '☀️',
    category: 'electricity',
    reductionPercent: 80,
    currentEmissions: footprint.electricity,
    projectedEmissions: Math.round(footprint.electricity * 0.2),
    monthlySavings: Math.round(footprint.electricity * 0.8),
    annualSavings: Math.round(footprint.electricity * 0.8 * 12)
  });

  scenarios.push({
    id: 'smart-plugs',
    name: 'Use Smart Plugs',
    description: 'Eliminate phantom loads by automating power-off for idle devices',
    icon: '🔌',
    category: 'electricity',
    reductionPercent: 10,
    currentEmissions: footprint.electricity,
    projectedEmissions: Math.round(footprint.electricity * 0.9),
    monthlySavings: Math.round(footprint.electricity * 0.1),
    annualSavings: Math.round(footprint.electricity * 0.1 * 12)
  });

  // Food scenarios
  if (answers.foodPreference === 'non_veg' || answers.foodPreference === 'omnivore') {
    scenarios.push({
      id: 'meatless-monday',
      name: 'Meatless Mondays',
      description: 'Go vegetarian 1 day per week',
      icon: '🥗',
      category: 'food',
      reductionPercent: 14,
      currentEmissions: footprint.food,
      projectedEmissions: Math.round(footprint.food * 0.86),
      monthlySavings: Math.round(footprint.food * 0.14),
      annualSavings: Math.round(footprint.food * 0.14 * 12)
    });

    scenarios.push({
      id: 'plant-based',
      name: 'Go Fully Vegetarian',
      description: 'Switch to a vegetarian diet',
      icon: '🌱',
      category: 'food',
      reductionPercent: 34,
      currentEmissions: footprint.food,
      projectedEmissions: Math.round(footprint.food * 0.66),
      monthlySavings: Math.round(footprint.food * 0.34),
      annualSavings: Math.round(footprint.food * 0.34 * 12)
    });
  }

  // Shopping scenarios
  if (answers.shoppingFrequency === 'daily' || answers.shoppingFrequency === 'weekly') {
    scenarios.push({
      id: 'mindful-shopping',
      name: 'Mindful Shopping',
      description: 'Reduce shopping frequency by 50%',
      icon: '🛍️',
      category: 'shopping',
      reductionPercent: 50,
      currentEmissions: footprint.shopping,
      projectedEmissions: Math.round(footprint.shopping * 0.5),
      monthlySavings: Math.round(footprint.shopping * 0.5),
      annualSavings: Math.round(footprint.shopping * 0.5 * 12)
    });

    scenarios.push({
      id: 'second-hand',
      name: 'Buy Second-hand',
      description: 'Choose pre-owned items over new',
      icon: '♻️',
      category: 'shopping',
      reductionPercent: 60,
      currentEmissions: footprint.shopping,
      projectedEmissions: Math.round(footprint.shopping * 0.4),
      monthlySavings: Math.round(footprint.shopping * 0.6),
      annualSavings: Math.round(footprint.shopping * 0.6 * 12)
    });
  }

  return scenarios;
}

// ===== PERSONALIZED INSIGHTS =====

export function generatePersonalizedInsights(footprint: CarbonBreakdown, answers: AssessmentAnswers, history: HistoricalEntry[]): PersonalizedInsight[] {
  const insights: PersonalizedInsight[] = [];
  const percentages = getPolluterPercentage(footprint);

  // Transportation insights
  if (percentages.transportation > 30) {
    insights.push({
      id: 'transport-high',
      type: 'warning',
      title: 'Transportation Dominates Your Footprint',
      description: `Your transportation contributes ${percentages.transportation}% of total emissions (${Math.round(footprint.transportation)}kg CO₂/month). This is your biggest opportunity for reduction.`,
      impact: 'high',
      category: 'transportation',
      actionable: true
    });
  }

  if (answers.vehicleType === 'car_petrol' || answers.vehicleType === 'car_diesel') {
    const switchSavings = Math.round(footprint.transportation * 0.76);
    insights.push({
      id: 'transport-switch',
      type: 'tip',
      title: 'Public Transport Could Save You Big',
      description: `Switching to public transport twice a week could reduce your transport emissions by ${switchSavings}kg CO₂/month — that's like planting ${Math.round(switchSavings / 22)} trees annually!`,
      impact: 'high',
      category: 'transportation',
      actionable: true
    });
  }

  // Electricity insights
  if (answers.electricityBill > 3000) {
    insights.push({
      id: 'electricity-high',
      type: 'warning',
      title: 'High Electricity Consumption',
      description: `Your ₹${answers.electricityBill}/month bill generates ${Math.round(footprint.electricity)}kg CO₂. The average Indian household pays ₹2,000/month.`,
      impact: 'medium',
      category: 'electricity',
      actionable: true
    });
  }

  // Food insights
  if (percentages.food > 35) {
    insights.push({
      id: 'food-dominant',
      type: 'tip',
      title: 'Food is Your Largest Emission Source',
      description: `Your food choices generate ${percentages.food}% of your carbon footprint. Try Meatless Mondays to reduce this by ~14%.`,
      impact: 'medium',
      category: 'food',
      actionable: true
    });
  }

  // Shopping insights
  if (answers.shoppingFrequency === 'daily' || answers.shoppingFrequency === 'weekly') {
    insights.push({
      id: 'shopping-excessive',
      type: 'warning',
      title: 'Frequent Shopping Has High Impact',
      description: `Shopping ${answers.shoppingFrequency} generates ${Math.round(footprint.shopping)}kg CO₂/month. Consider buying second-hand or reducing frequency.`,
      impact: 'medium',
      category: 'shopping',
      actionable: true
    });
  }

  // Historical trend insights
  if (history.length >= 2) {
    const sortedHistory = [...history].sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);
    const latest = sortedHistory[sortedHistory.length - 1];
    const previous = sortedHistory[sortedHistory.length - 2];
    const change = latest.footprint.total - previous.footprint.total;
    const changePercent = Math.round((change / previous.footprint.total) * 100);

    if (change < 0) {
      insights.push({
        id: 'trend-improving',
        type: 'achievement',
        title: 'Great Progress!',
        description: `Your carbon footprint decreased by ${Math.abs(changePercent)}% (${Math.abs(Math.round(change))}kg CO₂) compared to last month. Keep it up!`,
        impact: 'high',
        category: 'general',
        actionable: false
      });
    } else if (change > 0) {
      insights.push({
        id: 'trend-worsening',
        type: 'warning',
        title: 'Footprint Increased',
        description: `Your carbon footprint increased by ${changePercent}% (+${Math.round(change)}kg CO₂) compared to last month. Review your recent changes.`,
        impact: 'high',
        category: 'general',
        actionable: true
      });
    }
  }

  // Score-based achievements
  const score = getCarbonScore(footprint);
  if (score >= 80) {
    insights.push({
      id: 'score-achievement',
      type: 'achievement',
      title: 'Climate Leader Status!',
      description: `Your score of ${score}/100 puts you in the top ${100 - score}% of users. Share your journey to inspire others!`,
      impact: 'low',
      category: 'general',
      actionable: false
    });
  }

  // Projection insight
  if (history.length === 0) {
    insights.push({
      id: 'first-assessment',
      type: 'projection',
      title: 'Track Your Progress',
      description: 'This is your first assessment. Complete monthly check-ins to see your progress and unlock personalized trend insights.',
      impact: 'low',
      category: 'general',
      actionable: false
    });
  }

  // Sort by impact
  const impactOrder = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

  return insights;
}

// ===== COMBINED SIMULATION =====

export function calculateCombinedScenario(
  footprint: CarbonBreakdown,
  answers: AssessmentAnswers,
  activeScenarios: string[]
): { projected: CarbonBreakdown; totalSavings: number } {
  const scenarios = generateSimulationScenarios(footprint, answers);
  const active = scenarios.filter(s => activeScenarios.includes(s.id));

  let transportReduction = 0;
  let electricityReduction = 0;
  let foodReduction = 0;
  let shoppingReduction = 0;

  active.forEach(scenario => {
    switch (scenario.category) {
      case 'transportation':
        transportReduction = Math.max(transportReduction, scenario.reductionPercent);
        break;
      case 'electricity':
        electricityReduction = Math.max(electricityReduction, scenario.reductionPercent);
        break;
      case 'food':
        foodReduction = Math.max(foodReduction, scenario.reductionPercent);
        break;
      case 'shopping':
        shoppingReduction = Math.max(shoppingReduction, scenario.reductionPercent);
        break;
    }
  });

  const projected: CarbonBreakdown = {
    transportation: Math.round(footprint.transportation * (1 - transportReduction / 100)),
    electricity: Math.round(footprint.electricity * (1 - electricityReduction / 100)),
    food: Math.round(footprint.food * (1 - foodReduction / 100)),
    shopping: Math.round(footprint.shopping * (1 - shoppingReduction / 100)),
    total: 0
  };
  projected.total = projected.transportation + projected.electricity + projected.food + projected.shopping;

  const totalSavings = footprint.total - projected.total;

  return { projected, totalSavings };
}

export function generateActionPlan(answers: AssessmentAnswers): ActionItem[] {
  const actions: ActionItem[] = [];

  if (answers.vehicleType === 'car_petrol' || answers.vehicleType === 'car_diesel') {
    actions.push({
      category: 'Transportation',
      title: 'Switch to Public Transport 2x/week',
      description: `Replace ${answers.travelDistance}km car trips with bus/train twice a week.`,
      savings: `~${Math.round(answers.travelDistance * EMISSION_FACTORS.transport[answers.vehicleType] * 2 * 4)}kg CO₂/month`,
      difficulty: 'easy'
    });
    actions.push({
      category: 'Transportation',
      title: 'Carpool for Daily Commute',
      description: 'Share rides with colleagues. Even 1 passenger cuts per-person emissions by 50%.',
      savings: `~${Math.round(answers.travelDistance * EMISSION_FACTORS.transport[answers.vehicleType] * 30 * 0.5)}kg CO₂/month`,
      difficulty: 'medium'
    });
  } else if (answers.vehicleType === 'bike') {
    actions.push({
      category: 'Transportation',
      title: 'Use Bus for Long Trips',
      description: 'For trips over 10km, use buses or trains instead of your bike.',
      savings: `~${Math.round(answers.travelDistance * 0.05 * 30 * 0.3)}kg CO₂/month`,
      difficulty: 'easy'
    });
  }

  if (answers.electricityBill > 2000) {
    actions.push({
      category: 'Electricity',
      title: 'Switch to LED Lights',
      description: 'Replace all bulbs with LED. Saves up to 75% lighting energy.',
      savings: '~40kg CO₂/month',
      difficulty: 'easy'
    });
    actions.push({
      category: 'Electricity',
      title: 'Unplug Phantom Loads',
      description: 'Devices on standby still consume power. Use smart plugs to cut idle consumption.',
      savings: '~30kg CO₂/month',
      difficulty: 'easy'
    });
  } else {
    actions.push({
      category: 'Electricity',
      title: 'Consider Solar Panels',
      description: 'Even a 1kW rooftop solar setup can offset a large portion of your bill.',
      savings: '~100kg CO₂/month',
      difficulty: 'hard'
    });
  }

  if (answers.foodPreference === 'non_veg' || answers.foodPreference === 'omnivore') {
    actions.push({
      category: 'Food',
      title: 'Try Meatless Mondays',
      description: 'Going vegetarian just 1 day/week can reduce your food carbon footprint significantly.',
      savings: '~150kg CO₂/month',
      difficulty: 'easy'
    });
    actions.push({
      category: 'Food',
      title: 'Eat Local & Seasonal',
      description: 'Transport of imported food adds to emissions. Choose local produce.',
      savings: '~80kg CO₂/month',
      difficulty: 'easy'
    });
  } else {
    actions.push({
      category: 'Food',
      title: 'Reduce Food Waste',
      description: 'Plan meals, store food properly. India wastes 68 million tons of food yearly.',
      savings: '~100kg CO₂/month',
      difficulty: 'medium'
    });
  }

  if (answers.shoppingFrequency === 'daily' || answers.shoppingFrequency === 'weekly') {
    actions.push({
      category: 'Shopping',
      title: 'Shop Mindfully',
      description: 'Before buying, ask: Do I really need this? Choose quality over quantity.',
      savings: '~500kg CO₂/month',
      difficulty: 'medium'
    });
    actions.push({
      category: 'Shopping',
      title: 'Buy Second-hand',
      description: 'Pre-owned clothing and electronics drastically reduce manufacturing emissions.',
      savings: '~300kg CO₂/month',
      difficulty: 'easy'
    });
  }

  actions.push({
    category: 'Lifestyle',
    title: 'Plant a Tree This Month',
    description: 'One tree absorbs ~22kg of CO₂ per year. Start a mini garden at home.',
    savings: '~22kg CO₂/year per tree',
    difficulty: 'easy'
  });

  return actions;
}

export function getDefaultChallenges(): EcoChallenge[] {
  return [
    { id: '1', title: 'Public Transport Day', description: 'Use only public transport for one full day', points: 10, icon: '🚌', completed: false },
    { id: '2', title: 'Reusable Bottle', description: 'Carry a reusable water bottle for 7 days straight', points: 5, icon: '🧴', completed: false },
    { id: '3', title: 'Light Off Challenge', description: 'Turn off unused lights and fans for a week', points: 5, icon: '💡', completed: false },
    { id: '4', title: 'Meatless Week', description: 'Go vegetarian for an entire week', points: 15, icon: '🥗', completed: false },
    { id: '5', title: 'No Plastic Day', description: 'Avoid all single-use plastics for one day', points: 8, icon: '🚫', completed: false },
    { id: '6', title: 'Bike/Cycle Trip', description: 'Cycle or walk instead of using a vehicle for a trip', points: 7, icon: '🚲', completed: false },
    { id: '7', title: 'Digital Detox', description: 'Reduce screen time by 2 hours for 3 days (saves energy)', points: 3, icon: '📱', completed: false },
    { id: '8', title: 'Zero Waste Meal', description: 'Prepare a meal with zero food waste', points: 6, icon: '🍽️', completed: false },
    { id: '9', title: 'Unplug Challenge', description: 'Unplug all devices when not in use for 24 hours', points: 4, icon: '🔌', completed: false },
    { id: '10', title: 'Eco Spread', description: 'Share GreenSteps with 3 friends', points: 10, icon: '🌱', completed: false },
  ];
}

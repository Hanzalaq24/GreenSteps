import { AssessmentAnswers, CarbonBreakdown, ActionItem, EcoChallenge } from '../types';

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
  // Indian average monthly: ~800 kg CO2
  // Score out of 100, lower footprint = higher score
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
  const total = footprint.total;
  return {
    transportation: Math.round((footprint.transportation / total) * 100),
    electricity: Math.round((footprint.electricity / total) * 100),
    food: Math.round((footprint.food / total) * 100),
    shopping: Math.round((footprint.shopping / total) * 100)
  };
}

export function generateActionPlan(answers: AssessmentAnswers): ActionItem[] {
  const actions: ActionItem[] = [];

  // Transportation actions
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

  // Electricity actions
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

  // Food actions
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

  // Shopping actions
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

  // Always add these
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

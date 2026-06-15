export interface AssessmentAnswers {
  travelDistance: number;
  vehicleType: 'walk' | 'cycle' | 'public' | 'bike' | 'car_petrol' | 'car_diesel' | 'car_ev' | 'auto';
  electricityBill: number;
  foodPreference: 'veg' | 'non_veg' | 'omnivore' | 'vegan';
  shoppingFrequency: 'rare' | 'monthly' | 'weekly' | 'daily';
}

export interface CarbonBreakdown {
  transportation: number;
  electricity: number;
  food: number;
  shopping: number;
  total: number;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
}

export interface ActionItem {
  category: string;
  title: string;
  description: string;
  savings: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

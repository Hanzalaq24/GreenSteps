import { generateActionPlan, getDefaultChallenges } from '../utils/carbonCalc';
import { AssessmentAnswers } from '../types';

describe('Recommendation Engine', () => {
  describe('generateActionPlan', () => {
    it('should generate transportation actions for car users', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 20,
        vehicleType: 'car_petrol',
        electricityBill: 1000,
        foodPreference: 'veg',
        shoppingFrequency: 'monthly'
      };
      
      const actions = generateActionPlan(answers);
      const transportationActions = actions.filter(a => a.category === 'Transportation');
      
      expect(transportationActions.length).toBeGreaterThan(0);
    });

    it('should include electricity actions for high bill', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 5,
        vehicleType: 'cycle',
        electricityBill: 3000,
        foodPreference: 'vegan',
        shoppingFrequency: 'rare'
      };
      
      const actions = generateActionPlan(answers);
      const electricityActions = actions.filter(a => a.category === 'Electricity');
      
      expect(electricityActions.length).toBeGreaterThan(0);
      expect(electricityActions.some(a => a.title.includes('LED'))).toBe(true);
    });

    it('should suggest meatless mondays for non-veg eaters', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 1000,
        foodPreference: 'non_veg',
        shoppingFrequency: 'rare'
      };
      
      const actions = generateActionPlan(answers);
      const foodActions = actions.filter(a => a.category === 'Food');
      
      expect(foodActions.some(a => a.title.includes('Meatless'))).toBe(true);
    });

    it('should suggest shopping mindfulness for frequent shoppers', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 500,
        foodPreference: 'vegan',
        shoppingFrequency: 'daily'
      };
      
      const actions = generateActionPlan(answers);
      const shoppingActions = actions.filter(a => a.category === 'Shopping');
      
      expect(shoppingActions.length).toBeGreaterThan(0);
      expect(shoppingActions.some(a => a.title.includes('Mindful'))).toBe(true);
    });

    it('should always include tree planting action', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 500,
        foodPreference: 'vegan',
        shoppingFrequency: 'rare'
      };
      
      const actions = generateActionPlan(answers);
      
      expect(actions.some(a => a.title.includes('Tree'))).toBe(true);
    });

    it('should include savings estimates', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 10,
        vehicleType: 'bike',
        electricityBill: 2000,
        foodPreference: 'omnivore',
        shoppingFrequency: 'weekly'
      };
      
      const actions = generateActionPlan(answers);
      
      actions.forEach(action => {
        expect(action.savings).toBeDefined();
        expect(action.savings.length).toBeGreaterThan(0);
      });
    });

    it('should assign difficulty levels', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 15,
        vehicleType: 'car_diesel',
        electricityBill: 2500,
        foodPreference: 'non_veg',
        shoppingFrequency: 'daily'
      };
      
      const actions = generateActionPlan(answers);
      
      actions.forEach(action => {
        expect(['easy', 'medium', 'hard']).toContain(action.difficulty);
      });
    });
  });

  describe('getDefaultChallenges', () => {
    it('should return array of challenges', () => {
      const challenges = getDefaultChallenges();
      
      expect(Array.isArray(challenges)).toBe(true);
      expect(challenges.length).toBeGreaterThan(0);
    });

    it('should have unique ids', () => {
      const challenges = getDefaultChallenges();
      const ids = challenges.map(c => c.id);
      const uniqueIds = new Set(ids);
      
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have required properties', () => {
      const challenges = getDefaultChallenges();
      
      challenges.forEach(challenge => {
        expect(challenge.id).toBeDefined();
        expect(challenge.title).toBeDefined();
        expect(challenge.description).toBeDefined();
        expect(challenge.points).toBeGreaterThan(0);
        expect(challenge.icon).toBeDefined();
        expect(challenge.completed).toBe(false);
      });
    });

    it('should include eco-themed challenges', () => {
      const challenges = getDefaultChallenges();
      
      expect(challenges.some(c => c.title.includes('Transport'))).toBe(true);
      expect(challenges.some(c => c.title.includes('Challenge') || c.title.includes('Week'))).toBe(true);
    });
  });
});

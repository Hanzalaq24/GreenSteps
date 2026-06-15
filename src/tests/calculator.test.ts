import { calculateCarbonFootprint, getCarbonScore, getScoreMessage, getBiggestPolluter, getPolluterPercentage } from '../utils/carbonCalc';
import { AssessmentAnswers } from '../types';

describe('Carbon Calculator', () => {
  describe('calculateCarbonFootprint', () => {
    it('should calculate correct footprint for car commuter', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 15,
        vehicleType: 'car_petrol',
        electricityBill: 2000,
        foodPreference: 'veg',
        shoppingFrequency: 'monthly'
      };
      
      const result = calculateCarbonFootprint(answers);
      
      expect(result).toBeDefined();
      expect(result.transportation).toBeGreaterThan(0);
      expect(result.electricity).toBeGreaterThan(0);
      expect(result.food).toBeGreaterThan(0);
      expect(result.shopping).toBeGreaterThan(0);
      expect(result.total).toEqual(result.transportation + result.electricity + result.food + result.shopping);
    });

    it('should return zero transportation for walking', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 10,
        vehicleType: 'walk',
        electricityBill: 2000,
        foodPreference: 'veg',
        shoppingFrequency: 'monthly'
      };
      
      const result = calculateCarbonFootprint(answers);
      
      expect(result.transportation).toBe(0);
    });

    it('should handle electricity bill calculation correctly', () => {
      const answers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 1000,
        foodPreference: 'vegan',
        shoppingFrequency: 'rare'
      };
      
      const result = calculateCarbonFootprint(answers);
      
      // electricity: 1000 * 0.82 = 820
      expect(result.electricity).toBe(820);
    });

    it('should calculate higher footprint for non-veg diet', () => {
      const vegAnswers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 0,
        foodPreference: 'veg',
        shoppingFrequency: 'rare'
      };
      
      const nonVegAnswers: AssessmentAnswers = {
        ...vegAnswers,
        foodPreference: 'non_veg'
      };
      
      const vegResult = calculateCarbonFootprint(vegAnswers);
      const nonVegResult = calculateCarbonFootprint(nonVegAnswers);
      
      expect(nonVegResult.food).toBeGreaterThan(vegResult.food);
    });

    it('should reflect shopping frequency impact', () => {
      const baseAnswers: AssessmentAnswers = {
        travelDistance: 0,
        vehicleType: 'walk',
        electricityBill: 0,
        foodPreference: 'vegan',
        shoppingFrequency: 'rare'
      };
      
      const dailyAnswers: AssessmentAnswers = {
        ...baseAnswers,
        shoppingFrequency: 'daily'
      };
      
      const baseResult = calculateCarbonFootprint(baseAnswers);
      const dailyResult = calculateCarbonFootprint(dailyAnswers);
      
      expect(dailyResult.shopping).toBeGreaterThan(baseResult.shopping);
    });
  });

  describe('getCarbonScore', () => {
    it('should return high score for low footprint', () => {
      const lowFootprint = {
        transportation: 10,
        electricity: 100,
        food: 500,
        shopping: 100,
        total: 710
      };
      
      const score = getCarbonScore(lowFootprint);
      
      expect(score).toBeGreaterThan(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return low score for high footprint', () => {
      const highFootprint = {
        transportation: 5000,
        electricity: 5000,
        food: 5000,
        shopping: 5000,
        total: 20000
      };
      
      const score = getCarbonScore(highFootprint);
      
      expect(score).toBeLessThan(30);
      expect(score).toBeGreaterThanOrEqual(5);
    });

    it('should score between 5-100 always', () => {
      const extremeFootprint = {
        transportation: 100000,
        electricity: 100000,
        food: 100000,
        shopping: 100000,
        total: 400000
      };
      
      const score = getCarbonScore(extremeFootprint);
      
      expect(score).toBeGreaterThanOrEqual(5);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getScoreMessage', () => {
    it('should return excellent message for score 85+', () => {
      const message = getScoreMessage(90);
      expect(message).toContain('Excellent');
    });

    it('should return great message for score 70-84', () => {
      const message = getScoreMessage(75);
      expect(message).toContain('Great');
    });

    it('should return good start message for score 50-69', () => {
      const message = getScoreMessage(60);
      expect(message).toContain('Good');
    });

    it('should suggest action for low scores', () => {
      const lowMessage = getScoreMessage(20);
      expect(lowMessage.length).toBeGreaterThan(0);
    });
  });

  describe('getBiggestPolluter', () => {
    it('should identify transportation as biggest polluter', () => {
      const footprint = {
        transportation: 500,
        electricity: 100,
        food: 100,
        shopping: 100,
        total: 800
      };
      
      const biggest = getBiggestPolluter(footprint);
      expect(biggest).toBe('Transportation');
    });

    it('should identify food as biggest polluter', () => {
      const footprint = {
        transportation: 100,
        electricity: 100,
        food: 2500,
        shopping: 100,
        total: 2800
      };
      
      const biggest = getBiggestPolluter(footprint);
      expect(biggest).toBe('Food');
    });
  });

  describe('getPolluterPercentage', () => {
    it('should calculate percentages correctly', () => {
      const footprint = {
        transportation: 100,
        electricity: 100,
        food: 200,
        shopping: 100,
        total: 500
      };
      
      const percentages = getPolluterPercentage(footprint);
      
      expect(percentages.transportation).toBe(20);
      expect(percentages.electricity).toBe(20);
      expect(percentages.food).toBe(40);
      expect(percentages.shopping).toBe(20);
    });

    it('should sum to 100 percent', () => {
      const footprint = {
        transportation: 250,
        electricity: 800,
        food: 1500,
        shopping: 800,
        total: 3350
      };
      
      const percentages = getPolluterPercentage(footprint);
      const sum = Object.values(percentages).reduce((a, b) => a + b, 0);
      
      expect(sum).toBe(100);
    });
  });
});

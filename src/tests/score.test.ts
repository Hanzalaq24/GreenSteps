import { getScoreMessage, getRegionComparison, getCarbonScore } from '../utils/carbonCalc';
import { CarbonBreakdown } from '../types';

describe('Scoring System', () => {
  describe('Score Calculation', () => {
    it('should calculate score on 0-100 scale', () => {
      const footprints: CarbonBreakdown[] = [
        { transportation: 10, electricity: 50, food: 500, shopping: 100, total: 660 },
        { transportation: 200, electricity: 500, food: 1000, shopping: 300, total: 2000 },
        { transportation: 500, electricity: 2000, food: 3000, shopping: 1500, total: 7000 }
      ];

      footprints.forEach(footprint => {
        const score = getCarbonScore(footprint);
        expect(score).toBeGreaterThanOrEqual(5);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('should give higher scores for lower footprints', () => {
      const lowFootprint: CarbonBreakdown = {
        transportation: 10,
        electricity: 100,
        food: 500,
        shopping: 50,
        total: 660
      };

      const highFootprint: CarbonBreakdown = {
        transportation: 300,
        electricity: 1500,
        food: 3000,
        shopping: 1000,
        total: 5800
      };

      const lowScore = getCarbonScore(lowFootprint);
      const highScore = getCarbonScore(highFootprint);

      expect(lowScore).toBeGreaterThan(highScore);
    });

    it('should reflect realistic indian average', () => {
      const indianAverage: CarbonBreakdown = {
        transportation: 150,
        electricity: 656,
        food: 1500,
        shopping: 500,
        total: 2806
      };

      const score = getCarbonScore(indianAverage);

      expect(score).toBeGreaterThan(30);
      expect(score).toBeLessThan(70);
    });
  });

  describe('Score Messages', () => {
    it('should provide encouragement for good scores', () => {
      const excellentMessage = getScoreMessage(90);
      const greatMessage = getScoreMessage(75);
      const goodMessage = getScoreMessage(55);

      expect(excellentMessage).toContain('🌟');
      expect(greatMessage).toContain('👍');
      expect(goodMessage).toContain('💪');
    });

    it('should motivate improvement for poor scores', () => {
      const needsImprovementMessage = getScoreMessage(30);
      const criticalMessage = getScoreMessage(10);

      expect(needsImprovementMessage.length).toBeGreaterThan(0);
      expect(criticalMessage.length).toBeGreaterThan(0);
    });

    it('should have consistent message boundaries', () => {
      // Score 85+ should return excellent
      expect(getScoreMessage(85)).toContain('Excellent');
      expect(getScoreMessage(100)).toContain('Excellent');

      // Score 70-84 should return great
      expect(getScoreMessage(70)).toContain('Great');
      expect(getScoreMessage(84)).toContain('Great');

      // Score 50-69 should return good
      expect(getScoreMessage(50)).toContain('Good');
      expect(getScoreMessage(69)).toContain('Good');

      // Score 30-49 should suggest action
      expect(getScoreMessage(30)).toContain('higher');
      expect(getScoreMessage(49)).toContain('higher');

      // Score below 30 should be urgent
      expect(getScoreMessage(5)).toContain('attention');
      expect(getScoreMessage(29)).toContain('attention');
    });
  });

  describe('Regional Comparison', () => {
    it('should compare against indian average accurately', () => {
      const belowAverage: CarbonBreakdown = {
        transportation: 50,
        electricity: 200,
        food: 800,
        shopping: 100,
        total: 1150
      };

      const closeTo: CarbonBreakdown = {
        transportation: 150,
        electricity: 656,
        food: 1500,
        shopping: 500,
        total: 2806
      };

      const aboveAverage: CarbonBreakdown = {
        transportation: 300,
        electricity: 1500,
        food: 3000,
        shopping: 1000,
        total: 5800
      };

      const farAbove: CarbonBreakdown = {
        transportation: 500,
        electricity: 2500,
        food: 4000,
        shopping: 2000,
        total: 9000
      };

      expect(getRegionComparison(belowAverage)).toContain('below');
      expect(getRegionComparison(closeTo)).toContain('Close');
      expect(getRegionComparison(aboveAverage)).toContain('Above');
      expect(getRegionComparison(farAbove)).toContain('Significantly');
    });

    it('should use indian average of 800kg correctly', () => {
      const slightlyBelow: CarbonBreakdown = {
        transportation: 100,
        electricity: 200,
        food: 400,
        shopping: 50,
        total: 750
      };

      const slightlyAbove: CarbonBreakdown = {
        transportation: 200,
        electricity: 300,
        food: 600,
        shopping: 100,
        total: 1200
      };

      expect(getRegionComparison(slightlyBelow)).toContain('below');
      expect(getRegionComparison(slightlyAbove)).toContain('Close');
    });

    it('should differentiate between slightly and much below average', () => {
      const muchBelow: CarbonBreakdown = {
        transportation: 10,
        electricity: 50,
        food: 200,
        shopping: 20,
        total: 280
      };

      const slightlyBelow: CarbonBreakdown = {
        transportation: 100,
        electricity: 300,
        food: 600,
        shopping: 150,
        total: 1150
      };

      const comparisonMuch = getRegionComparison(muchBelow);
      const comparisonSlightly = getRegionComparison(slightlyBelow);

      expect(comparisonMuch).toContain('Much');
      expect(comparisonSlightly).toContain('Slightly');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero footprint', () => {
      const zeroFootprint: CarbonBreakdown = {
        transportation: 0,
        electricity: 0,
        food: 0,
        shopping: 0,
        total: 0
      };

      const score = getCarbonScore(zeroFootprint);
      expect(score).toBe(100);
    });

    it('should handle extremely high footprint', () => {
      const extremeFootprint: CarbonBreakdown = {
        transportation: 10000,
        electricity: 10000,
        food: 10000,
        shopping: 10000,
        total: 40000
      };

      const score = getCarbonScore(extremeFootprint);
      expect(score).toBeGreaterThanOrEqual(5);
      expect(score).toBeLessThan(20);
    });
  });
});

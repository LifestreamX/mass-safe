/**
 * Calculate safety score based on crime statistics
 * Score ranges from 0-100, higher is safer
 */

export interface CrimeStats {
  violentCrimes: number;
  propertyCrimes: number;
  population: number;
}

export interface SafetyScoreResult {
  score: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
}

export function calculateSafetyScore(stats: CrimeStats): SafetyScoreResult {
  const { violentCrimes, propertyCrimes, population } = stats;

  // Avoid division by zero
  if (population === 0) {
    return {
      score: 0,
      violentCrimeRate: 0,
      propertyCrimeRate: 0,
      rating: 'poor',
      color: '#ef4444',
    };
  }

  // Calculate crime rates per 1000 residents
  const violentCrimeRate = (violentCrimes / population) * 1000;
  const propertyCrimeRate = (propertyCrimes / population) * 1000;

  // Calculate safety score
  // Violent crimes weighted more heavily (2x)
  let score = 100 - (violentCrimeRate * 2 + propertyCrimeRate);

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine rating and color
  let rating: SafetyScoreResult['rating'];
  let color: string;

  if (score >= 80) {
    rating = 'excellent';
    color = '#10b981'; // green
  } else if (score >= 60) {
    rating = 'good';
    color = '#f59e0b'; // yellow
  } else if (score >= 40) {
    rating = 'fair';
    color = '#fb923c'; // orange
  } else {
    rating = 'poor';
    color = '#ef4444'; // red
  }

  return {
    score: Math.round(score * 10) / 10, // round to 1 decimal
    violentCrimeRate: Math.round(violentCrimeRate * 100) / 100,
    propertyCrimeRate: Math.round(propertyCrimeRate * 100) / 100,
    rating,
    color,
  };
}

/**
 * Generate a human-readable summary of safety data
 */
export function generateSafetySummary(
  cityName: string,
  safetyScore: SafetyScoreResult,
  massAverageScore: number = 72,
): string {
  const { score, rating, violentCrimeRate, propertyCrimeRate } = safetyScore;

  const comparisonText =
    score > massAverageScore
      ? 'lower crime than'
      : score < massAverageScore
        ? 'higher crime than'
        : 'similar crime levels to';

  const violentCrimeText =
    violentCrimeRate < 2
      ? 'very low violent crime'
      : violentCrimeRate < 4
        ? 'low violent crime'
        : violentCrimeRate < 6
          ? 'moderate violent crime'
          : 'higher violent crime';

  const propertyCrimeText =
    propertyCrimeRate < 10
      ? 'very low property crime'
      : propertyCrimeRate < 20
        ? 'low property crime'
        : propertyCrimeRate < 30
          ? 'moderate property crime'
          : 'higher property crime';

  return `${cityName}, MA has ${comparisonText} the Massachusetts average. The city experiences ${violentCrimeText} and ${propertyCrimeText}. Overall, ${cityName} receives a MassSafe score of ${score} out of 100, rated as ${rating}.`;
}

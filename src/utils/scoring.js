export const SCORING = {
  CORRECT_ANSWER: {
    gamified: 100,
    control: 10
  },
  BONUS_MULTIPLIERS: {
    STREAK_3: 1.2,
    STREAK_5: 1.5,
    STREAK_10: 2.0,
    SPEED_FAST: 1.3,
    SPEED_VERY_FAST: 1.5,
    DIFFICULTY_MEDIUM: 1.2,
    DIFFICULTY_HARD: 1.5,
    PERFECT_CHAPTER: 2.0
  },
  ACHIEVEMENTS: {
    FIRST_CORRECT: { points: 50, title: "First Success", icon: "FS" },
    STREAK_5: { points: 200, title: "On Fire", icon: "OF" },
    STREAK_10: { points: 500, title: "Unstoppable", icon: "UN" },
    SPEED_DEMON: { points: 300, title: "Speed Demon", icon: "SD" },
    PERFECT_CHAPTER: { points: 1000, title: "Chapter Master", icon: "CM" },
    KNOWLEDGE_SEEKER: { points: 100, title: "Knowledge Seeker", icon: "KS" }
  }
};

export function calculateScore(isCorrect, mode, bonusFactors = {}) {
  if (!isCorrect) return { points: 0, bonuses: [] };

  let basePoints = SCORING.CORRECT_ANSWER[mode] || SCORING.CORRECT_ANSWER.control;
  let totalMultiplier = 1;
  let bonuses = [];

  if (mode === 'gamified') {
    if (bonusFactors.streak >= 10) {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.STREAK_10;
      bonuses.push({ type: 'streak', value: '10x Streak', multiplier: SCORING.BONUS_MULTIPLIERS.STREAK_10 });
    } else if (bonusFactors.streak >= 5) {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.STREAK_5;
      bonuses.push({ type: 'streak', value: '5x Streak', multiplier: SCORING.BONUS_MULTIPLIERS.STREAK_5 });
    } else if (bonusFactors.streak >= 3) {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.STREAK_3;
      bonuses.push({ type: 'streak', value: '3x Streak', multiplier: SCORING.BONUS_MULTIPLIERS.STREAK_3 });
    }

    if (bonusFactors.responseTime < 3) {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.SPEED_VERY_FAST;
      bonuses.push({ type: 'speed', value: 'Lightning Fast', multiplier: SCORING.BONUS_MULTIPLIERS.SPEED_VERY_FAST });
    } else if (bonusFactors.responseTime < 5) {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.SPEED_FAST;
      bonuses.push({ type: 'speed', value: 'Quick Answer', multiplier: SCORING.BONUS_MULTIPLIERS.SPEED_FAST });
    }

    if (bonusFactors.difficulty === 'hard') {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.DIFFICULTY_HARD;
      bonuses.push({ type: 'difficulty', value: 'Hard Question', multiplier: SCORING.BONUS_MULTIPLIERS.DIFFICULTY_HARD });
    } else if (bonusFactors.difficulty === 'medium') {
      totalMultiplier *= SCORING.BONUS_MULTIPLIERS.DIFFICULTY_MEDIUM;
      bonuses.push({ type: 'difficulty', value: 'Medium Question', multiplier: SCORING.BONUS_MULTIPLIERS.DIFFICULTY_MEDIUM });
    }
  }

  const finalPoints = Math.round(basePoints * totalMultiplier);
  
  return {
    points: finalPoints,
    basePoints,
    multiplier: totalMultiplier,
    bonuses
  };
}

export function checkAchievements(stats) {
  const newAchievements = [];

  if (stats.totalCorrect === 1 && !stats.achievements.includes('FIRST_CORRECT')) {
    newAchievements.push('FIRST_CORRECT');
  }

  if (stats.currentStreak === 5 && !stats.achievements.includes('STREAK_5')) {
    newAchievements.push('STREAK_5');
  }

  if (stats.currentStreak === 10 && !stats.achievements.includes('STREAK_10')) {
    newAchievements.push('STREAK_10');
  }

  if (stats.fastAnswers >= 5 && !stats.achievements.includes('SPEED_DEMON')) {
    newAchievements.push('SPEED_DEMON');
  }

  if (stats.perfectChapters > 0 && !stats.achievements.includes('PERFECT_CHAPTER')) {
    newAchievements.push('PERFECT_CHAPTER');
  }

  return newAchievements;
}

export function getLevel(totalScore) {
  if (totalScore >= 10000) return { level: 'Pharmaceutical Expert', icon: 'PE', color: '#FFD700' };
  if (totalScore >= 5000) return { level: 'Drug Specialist', icon: 'DS', color: '#9B59B6' };
  if (totalScore >= 2500) return { level: 'Medicine Master', icon: 'MM', color: '#3498DB' };
  if (totalScore >= 1000) return { level: 'Pharmacology Pro', icon: 'PP', color: '#E74C3C' };
  if (totalScore >= 500) return { level: 'Drug Detective', icon: 'DD', color: '#F39C12' };
  if (totalScore >= 200) return { level: 'Pill Apprentice', icon: 'PA', color: '#27AE60' };
  return { level: 'Medical Student', icon: 'MS', color: '#95A5A6' };
}
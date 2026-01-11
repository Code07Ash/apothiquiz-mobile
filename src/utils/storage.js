import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_STATS: 'user_stats',
  QUIZ_SESSIONS: 'quiz_sessions',
  CHAPTER_PROGRESS: 'chapter_progress',
  ACHIEVEMENTS: 'achievements',
  USER_PREFERENCES: 'user_preferences'
};

export async function saveQuizSession(session) {
  try {
    const sessions = await getQuizSessions();
    sessions.push({
      ...session,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_SESSIONS, JSON.stringify(sessions));
    
    // Update user stats
    await updateUserStats(session);
    
    return true;
  } catch (error) {
    console.error('Error saving quiz session:', error);
    return false;
  }
}

export async function getQuizSessions() {
  try {
    const sessions = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting quiz sessions:', error);
    return [];
  }
}

export async function getUserStats() {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    return stats ? JSON.parse(stats) : {
      totalScore: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      currentStreak: 0,
      longestStreak: 0,
      fastAnswers: 0,
      perfectChapters: 0,
      achievements: [],
      chaptersCompleted: [],
      averageResponseTime: 0,
      gamifiedSessions: 0,
      controlSessions: 0,
      lastPlayedDate: null
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {};
  }
}

export async function updateUserStats(session) {
  try {
    const currentStats = await getUserStats();
    
    const updatedStats = {
      ...currentStats,
      totalScore: currentStats.totalScore + session.finalScore,
      totalQuestions: currentStats.totalQuestions + session.totalQuestions,
      totalCorrect: currentStats.totalCorrect + session.correctAnswers,
      currentStreak: session.endedWithCorrect ? currentStats.currentStreak + 1 : 0,
      longestStreak: Math.max(currentStats.longestStreak, session.longestStreak || 0),
      fastAnswers: currentStats.fastAnswers + (session.fastAnswers || 0),
      perfectChapters: currentStats.perfectChapters + (session.perfectScore ? 1 : 0),
      achievements: [...new Set([...currentStats.achievements, ...(session.newAchievements || [])])],
      averageResponseTime: calculateAverageResponseTime(currentStats, session),
      gamifiedSessions: currentStats.gamifiedSessions + (session.mode === 'gamified' ? 1 : 0),
      controlSessions: currentStats.controlSessions + (session.mode === 'control' ? 1 : 0),
      lastPlayedDate: new Date().toISOString()
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return null;
  }
}

export async function getChapterProgress(chapterId = null) {
  try {
    const progress = await AsyncStorage.getItem(STORAGE_KEYS.CHAPTER_PROGRESS);
    const allProgress = progress ? JSON.parse(progress) : {};
    
    if (chapterId) {
      return allProgress[chapterId] || {
        attempts: 0,
        bestScore: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        totalCorrect: 0,
        completed: false,
        accuracy: 0
      };
    }
    
    return allProgress;
  } catch (error) {
    console.error('Error getting chapter progress:', error);
    return chapterId ? {} : {};
  }
}

export async function updateChapterProgress(chapterId, score, totalQuestions, correctAnswers) {
  try {
    const progress = await getChapterProgress();
    
    if (!progress[chapterId]) {
      progress[chapterId] = {
        attempts: 0,
        bestScore: 0,
        totalQuestions: 0,
        completedQuestions: 0,
        totalCorrect: 0,
        completed: false,
        accuracy: 0
      };
    }

    progress[chapterId].attempts += 1;
    progress[chapterId].bestScore = Math.max(progress[chapterId].bestScore, score);
    progress[chapterId].totalQuestions = Math.max(progress[chapterId].totalQuestions, totalQuestions);
    progress[chapterId].completedQuestions = Math.max(progress[chapterId].completedQuestions, totalQuestions);
    progress[chapterId].totalCorrect += correctAnswers;
    progress[chapterId].accuracy = Math.round((progress[chapterId].totalCorrect / (progress[chapterId].attempts * totalQuestions)) * 100);
    progress[chapterId].completed = progress[chapterId].accuracy >= 80; // 80% accuracy threshold

    await AsyncStorage.setItem(STORAGE_KEYS.CHAPTER_PROGRESS, JSON.stringify(progress));
    return progress[chapterId];
  } catch (error) {
    console.error('Error updating chapter progress:', error);
    return null;
  }
}

export async function getUserPreferences() {
  try {
    const prefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      soundEnabled: true,
      hapticEnabled: true,
      darkMode: false,
      preferredMode: 'gamified'
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
}

export async function updateUserPreferences(preferences) {
  try {
    const currentPrefs = await getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
    return updatedPrefs;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
}

export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

function calculateAverageResponseTime(currentStats, session) {
  const totalSessions = currentStats.gamifiedSessions + currentStats.controlSessions;
  if (totalSessions === 0) return session.averageResponseTime || 0;
  
  return (
    (currentStats.averageResponseTime * totalSessions + (session.averageResponseTime || 0)) / 
    (totalSessions + 1)
  );
}
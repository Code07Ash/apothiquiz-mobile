import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getLevel } from '../src/utils/scoring';
import { getUserStats } from '../src/utils/storage';
import { getChapterById } from '../src/data/chapters';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const router = useRouter();
  const { score, total, correct, mode, streak, time, chapterId } = useLocalSearchParams();
  
  const [userStats, setUserStats] = useState(null);
  const [chapterInfo, setChapterInfo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stats = await getUserStats();
    setUserStats(stats);
    
    if (chapterId && chapterId !== 'mixed') {
      const chapter = getChapterById(parseInt(chapterId));
      setChapterInfo(chapter);
    }
  };

  const scoreNum = parseInt(score);
  const totalNum = parseInt(total);
  const correctNum = parseInt(correct);
  const streakNum = parseInt(streak);
  const timeNum = parseInt(time);
  
  const percentage = Math.round((correctNum / totalNum) * 100);
  const levelInfo = getLevel(scoreNum);
  
  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect! Outstanding knowledge!";
    if (percentage >= 80) return "Excellent work! You're mastering this!";
    if (percentage >= 60) return "Good job! Keep practicing!";
    if (percentage >= 40) return "Not bad! Room for improvement!";
    return "Keep studying! You'll get better!";
  };

  const getPerformanceColor = () => {
    if (percentage >= 80) return '#27AE60';
    if (percentage >= 60) return '#F39C12';
    return '#E74C3C';
  };

  const shareResults = async () => {
    try {
      const message = `I just scored ${scoreNum} points in Med Classify!\n` +
                     `${correctNum}/${totalNum} correct answers (${percentage}%)\n` +
                     `Mode: ${mode === 'gamified' ? 'Gamified' : 'Study Mode'}\n` +
                     `${mode === 'gamified' ? `Best streak: ${streakNum}\n` : ''}` +
                     `Time: ${timeNum}s\n\n` +
                     `Challenge yourself with drug classification!`;
      
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const StatCard = ({ title, value, subtitle, color = '#3498DB' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const AchievementBadge = ({ icon, title, description }) => (
    <View style={styles.achievementBadge}>
      <Text style={styles.achievementIcon}>{icon}</Text>
      <View style={styles.achievementText}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={mode === 'gamified' ? '#FF6B6B' : '#4ECDC4'} />
      
      <LinearGradient
        colors={mode === 'gamified' ? ['#FF6B6B', '#FF8E53'] : ['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Quiz Complete!</Text>
        <Text style={styles.headerSubtitle}>
          {chapterInfo ? chapterInfo.title : 'Mixed Quiz'} • {mode === 'gamified' ? 'Gamified' : 'Study Mode'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainScoreCard}>
          <LinearGradient
            colors={[getPerformanceColor(), getPerformanceColor() + '80']}
            style={styles.scoreGradient}
          >
            <Text style={styles.mainScore}>{scoreNum}</Text>
            <Text style={styles.scoreLabel}>Total Score</Text>
            <Text style={styles.performanceMessage}>{getPerformanceMessage()}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Accuracy"
              value={`${percentage}%`}
              subtitle={`${correctNum} out of ${totalNum}`}
              color={getPerformanceColor()}
            />
            
            <StatCard
              title="Time Taken"
              value={`${timeNum}s`}
              subtitle={`${Math.round(timeNum / totalNum)}s per question`}
              color="#9B59B6"
            />
            
            {mode === 'gamified' && (
              <StatCard
                title="Best Streak"
                value={streakNum}
                subtitle="Consecutive correct"
                color="#E67E22"
              />
            )}
            
            <StatCard
              title="Level"
              value={levelInfo.icon}
              subtitle={levelInfo.level}
              color={levelInfo.color}
            />
          </View>
        </View>

        {mode === 'gamified' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements Earned</Text>
            
            <View style={styles.achievementsContainer}>
              {percentage === 100 && (
                <AchievementBadge
                  icon="PS"
                  title="Perfect Score!"
                  description="Answered all questions correctly"
                />
              )}
              
              {streakNum >= 5 && (
                <AchievementBadge
                  icon="OF"
                  title="On Fire!"
                  description={`${streakNum} question streak`}
                />
              )}
              
              {timeNum / totalNum < 10 && (
                <AchievementBadge
                  icon="SD"
                  title="Speed Demon"
                  description="Quick thinking!"
                />
              )}
              
              {percentage >= 80 && (
                <AchievementBadge
                  icon="EX"
                  title="Excellence"
                  description="Outstanding performance"
                />
              )}
            </View>
          </View>
        )}

        {userStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Total Score</Text>
                <Text style={styles.progressValue}>{userStats.totalScore}</Text>
              </View>
              
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Questions Answered</Text>
                <Text style={styles.progressValue}>{userStats.totalQuestions}</Text>
              </View>
              
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Overall Accuracy</Text>
                <Text style={styles.progressValue}>
                  {userStats.totalQuestions > 0 ? 
                    Math.round((userStats.totalCorrect / userStats.totalQuestions) * 100) : 0}%
                </Text>
              </View>
              
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Best Streak</Text>
                <Text style={styles.progressValue}>{userStats.longestStreak}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <LinearGradient
              colors={mode === 'gamified' ? ['#FF6B6B', '#FF8E53'] : ['#4ECDC4', '#44A08D']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push({
              pathname: '/quiz',
              params: { mode, chapterId }
            })}
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={shareResults}
          >
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/analytics')}
          >
            <Text style={styles.secondaryButtonText}>View Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainScoreCard: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreGradient: {
    padding: 30,
    alignItems: 'center',
  },
  mainScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  performanceMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#95A5A6',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementBadge: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: 15,
    fontWeight: 'bold',
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  progressCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  progressLabel: {
    fontSize: 16,
    color: '#2C3E50',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  actionsContainer: {
    gap: 15,
    paddingBottom: 30,
  },
  primaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
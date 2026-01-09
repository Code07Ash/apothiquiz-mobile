import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getUserStats, getQuizSessions, getChapterProgress } from '../src/utils/storage';
import { chapters } from '../src/data/chapters';
import { getLevel } from '../src/utils/scoring';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [chapterProgress, setChapterProgress] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    const stats = await getUserStats();
    const sessionData = await getQuizSessions();
    const progress = await getChapterProgress();
    
    setUserStats(stats);
    setSessions(sessionData);
    setChapterProgress(progress);
  };

  const getAccuracyRate = () => {
    if (!userStats || userStats.totalQuestions === 0) return 0;
    return Math.round((userStats.totalCorrect / userStats.totalQuestions) * 100);
  };

  const getRecentSessions = () => {
    return sessions.slice(-5).reverse();
  };

  const getChapterStats = () => {
    return chapters.map(chapter => {
      const progress = chapterProgress[chapter.id];
      return {
        ...chapter,
        attempts: progress?.attempts || 0,
        accuracy: progress ? Math.round((progress.totalCorrect / Math.max(progress.totalQuestions, 1)) * 100) : 0,
        bestScore: progress?.bestScore || 0,
        completed: progress?.completed || false
      };
    });
  };

  const getModeComparison = () => {
    const gamifiedSessions = sessions.filter(s => s.mode === 'gamified');
    const controlSessions = sessions.filter(s => s.mode === 'control');
    
    const gamifiedAvg = gamifiedSessions.length > 0 ? 
      gamifiedSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / gamifiedSessions.length * 100 : 0;
    
    const controlAvg = controlSessions.length > 0 ? 
      controlSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / controlSessions.length * 100 : 0;
    
    return { gamifiedAvg: Math.round(gamifiedAvg), controlAvg: Math.round(controlAvg) };
  };

  const StatCard = ({ title, value, subtitle, color = '#3498DB', icon }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ percentage, color = '#3498DB' }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const OverviewTab = () => {
    const levelInfo = getLevel(userStats?.totalScore || 0);
    const accuracyRate = getAccuracyRate();
    
    return (
      <View>
        <View style={styles.levelCard}>
          <LinearGradient
            colors={[levelInfo.color, levelInfo.color + '80']}
            style={styles.levelGradient}
          >
            <Text style={styles.levelIcon}>{levelInfo.icon}</Text>
            <Text style={styles.levelTitle}>{levelInfo.level}</Text>
            <Text style={styles.levelScore}>{userStats?.totalScore || 0} points</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Score"
              value={userStats?.totalScore || 0}
              subtitle="All-time points"
              color="#E74C3C"
              icon="TS"
            />
            <StatCard
              title="Accuracy Rate"
              value={`${accuracyRate}%`}
              subtitle={`${userStats?.totalCorrect || 0}/${userStats?.totalQuestions || 0} correct`}
              color="#27AE60"
              icon="AR"
            />
            <StatCard
              title="Best Streak"
              value={userStats?.longestStreak || 0}
              subtitle="Consecutive correct"
              color="#F39C12"
              icon="BS"
            />
            <StatCard
              title="Total Sessions"
              value={(userStats?.gamifiedSessions || 0) + (userStats?.controlSessions || 0)}
              subtitle="Quizzes completed"
              color="#9B59B6"
              icon="TS"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {getRecentSessions().map((session, index) => (
            <View key={session.id || index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionMode}>
                  {session.mode === 'gamified' ? 'Gamified' : 'Study Mode'}
                </Text>
                <Text style={styles.sessionDate}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.sessionStats}>
                <Text style={styles.sessionScore}>{session.finalScore} pts</Text>
                <Text style={styles.sessionAccuracy}>
                  {Math.round((session.correctAnswers / session.totalQuestions) * 100)}% accuracy
                </Text>
                <Text style={styles.sessionTime}>{Math.round(session.totalTime)}s</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const ChaptersTab = () => {
    const chapterStats = getChapterStats();
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chapter Progress</Text>
        {chapterStats.map(chapter => (
          <View key={chapter.id} style={styles.chapterCard}>
            <View style={styles.chapterHeader}>
              <Text style={styles.chapterIcon}>{chapter.icon}</Text>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterAttempts}>{chapter.attempts} attempts</Text>
              </View>
              <View style={styles.chapterStats}>
                <Text style={styles.chapterAccuracy}>{chapter.accuracy}%</Text>
                {chapter.completed && <Text style={styles.completedBadge}>✓</Text>}
              </View>
            </View>
            <ProgressBar percentage={chapter.accuracy} color={chapter.color} />
          </View>
        ))}
      </View>
    );
  };

  const ComparisonTab = () => {
    const { gamifiedAvg, controlAvg } = getModeComparison();
    
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode Comparison</Text>
          
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Average Accuracy</Text>
            
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Gamified Mode</Text>
                <Text style={[styles.comparisonValue, { color: '#FF6B6B' }]}>{gamifiedAvg}%</Text>
                <ProgressBar percentage={gamifiedAvg} color="#FF6B6B" />
              </View>
              
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Study Mode</Text>
                <Text style={[styles.comparisonValue, { color: '#4ECDC4' }]}>{controlAvg}%</Text>
                <ProgressBar percentage={controlAvg} color="#4ECDC4" />
              </View>
            </View>
          </View>

          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Session Count</Text>
            
            <View style={styles.comparisonRow}>
              <StatCard
                title="Gamified Sessions"
                value={userStats?.gamifiedSessions || 0}
                color="#FF6B6B"
                icon="GS"
              />
              <StatCard
                title="Study Sessions"
                value={userStats?.controlSessions || 0}
                color="#4ECDC4"
                icon="SS"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!userStats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Track your learning progress</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TabButton
          title="Overview"
          isActive={selectedTab === 'overview'}
          onPress={() => setSelectedTab('overview')}
        />
        <TabButton
          title="Chapters"
          isActive={selectedTab === 'chapters'}
          onPress={() => setSelectedTab('chapters')}
        />
        <TabButton
          title="Comparison"
          isActive={selectedTab === 'comparison'}
          onPress={() => setSelectedTab('comparison')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && <OverviewTab />}
        {selectedTab === 'chapters' && <ChaptersTab />}
        {selectedTab === 'comparison' && <ComparisonTab />}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#2C3E50',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#3498DB',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelCard: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  levelGradient: {
    padding: 25,
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  levelScore: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
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
  sessionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionMode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  sessionDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  sessionAccuracy: {
    fontSize: 14,
    color: '#27AE60',
  },
  sessionTime: {
    fontSize: 14,
    color: '#95A5A6',
  },
  chapterCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chapterIcon: {
    fontSize: 16,
    marginRight: 12,
    fontWeight: 'bold',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  chapterAttempts: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  chapterStats: {
    alignItems: 'flex-end',
  },
  chapterAccuracy: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  completedBadge: {
    fontSize: 16,
    marginTop: 2,
    color: '#27AE60',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  comparisonCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  comparisonRow: {
    gap: 15,
  },
  comparisonItem: {
    marginBottom: 15,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
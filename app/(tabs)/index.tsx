import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { chapters } from '../../src/data/chapters';
import { getUserStats, getChapterProgress } from '../../src/utils/storage';
import { getCurrentUser, logoutUser } from '../auth';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState('gamified');
  const [userStats, setUserStats] = useState(null);
  const [chapterProgress, setChapterProgress] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const stats = await getUserStats();
    const progress = await getChapterProgress();
    const user = await getCurrentUser();
    setUserStats(stats);
    setChapterProgress(progress);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const startQuiz = (chapterId = null) => {
    const params = { mode: selectedMode };
    if (chapterId) params.chapterId = chapterId.toString();
    
    router.push({
      pathname: '/quiz',
      params
    });
  };

  const ModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'gamified' && styles.modeButtonActive,
          { backgroundColor: selectedMode === 'gamified' ? '#FF6B6B' : '#f0f0f0' }
        ]}
        onPress={() => setSelectedMode('gamified')}
      >
        <Text style={[
          styles.modeButtonText,
          selectedMode === 'gamified' && styles.modeButtonTextActive
        ]}>
          Gamified
        </Text>
        <Text style={[
          styles.modeDescription,
          selectedMode === 'gamified' && { color: 'white' }
        ]}>
          Points, streaks & achievements
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'control' && styles.modeButtonActive,
          { backgroundColor: selectedMode === 'control' ? '#4ECDC4' : '#f0f0f0' }
        ]}
        onPress={() => setSelectedMode('control')}
      >
        <Text style={[
          styles.modeButtonText,
          selectedMode === 'control' && styles.modeButtonTextActive
        ]}>
          Study Mode
        </Text>
        <Text style={[
          styles.modeDescription,
          selectedMode === 'control' && { color: 'white' }
        ]}>
          Focus on learning
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ChapterCard = ({ chapter }) => {
    const progress = chapterProgress[chapter.id];
    const completionRate = progress ? 
      Math.round((progress.totalCorrect / Math.max(progress.totalQuestions, 1)) * 100) : 0;

    return (
      <TouchableOpacity
        style={styles.chapterCard}
        onPress={() => startQuiz(chapter.id)}
      >
        <LinearGradient
          colors={[chapter.color, chapter.color + '80']}
          style={styles.chapterGradient}
        >
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterIcon}>{chapter.icon}</Text>
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.chapterDescription}>{chapter.description}</Text>
            </View>
          </View>
          
          <View style={styles.chapterStats}>
            <Text style={styles.drugCount}>{chapter.drugs.length} drugs</Text>
            {progress && (
              <Text style={styles.completionRate}>{completionRate}% mastered</Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const StatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats?.totalScore || 0}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats?.totalCorrect || 0}</Text>
          <Text style={styles.statLabel}>Correct Answers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appTitle}>Med Classify</Text>
            <Text style={styles.appSubtitle}>Master Drug Classification</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {currentUser && (
          <Text style={styles.welcomeText}>
            Welcome, {currentUser.firstName} {currentUser.lastName}
          </Text>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userStats && <StatsCard />}
        
        <ModeSelector />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Chapter</Text>
          {chapters.map(chapter => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.allChaptersButton}
          onPress={() => startQuiz()}
        >
          <LinearGradient
            colors={selectedMode === 'gamified' ? ['#FF6B6B', '#FF8E53'] : ['#4ECDC4', '#44A08D']}
            style={styles.allChaptersGradient}
          >
            <Text style={styles.allChaptersText}>
              Start Mixed Quiz ({selectedMode === 'gamified' ? 'Gamified' : 'Study Mode'})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => router.push('/analytics')}
        >
          <Text style={styles.analyticsText}>View Analytics</Text>
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
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C3E50',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  modeSelector: {
    flexDirection: 'row',
    marginVertical: 20,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  modeDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  chapterCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chapterGradient: {
    padding: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chapterIcon: {
    fontSize: 20,
    marginRight: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  chapterDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  chapterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drugCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  completionRate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  allChaptersButton: {
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  allChaptersGradient: {
    padding: 18,
    alignItems: 'center',
  },
  allChaptersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  analyticsButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  analyticsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { chapters } from '../src/data/chapters';
import { getChapterProgress, getUserStats } from '../src/utils/storage';

export default function ChaptersScreen() {
  const router = useRouter();
  const [chapterProgress, setChapterProgress] = useState({});
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    loadChapterProgress();
  }, []);

  const loadChapterProgress = async () => {
    const stats = await getUserStats();
    setUserStats(stats);
    
    const progress = {};
    for (const chapter of chapters) {
      const chapterStats = await getChapterProgress(chapter.id);
      progress[chapter.id] = chapterStats;
    }
    setChapterProgress(progress);
  };

  const getCompletionPercentage = (chapterId) => {
    const progress = chapterProgress[chapterId];
    if (!progress || !progress.totalQuestions) return 0;
    return Math.round((progress.completedQuestions / progress.totalQuestions) * 100);
  };

  const isChapterCompleted = (chapterId) => {
    return getCompletionPercentage(chapterId) >= 80; // 80% completion threshold
  };

  const startChapterQuiz = (chapterId, mode) => {
    router.push({
      pathname: '/quiz',
      params: { chapterId: chapterId.toString(), mode }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chapters</Text>
        <Text style={styles.headerSubtitle}>
          {Object.values(chapterProgress).filter(p => p && p.completed).length} / {chapters.length} Completed
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {chapters.map((chapter) => {
          const completionPercentage = getCompletionPercentage(chapter.id);
          const isCompleted = isChapterCompleted(chapter.id);
          
          return (
            <View key={chapter.id} style={styles.chapterCard}>
              <LinearGradient
                colors={[chapter.color, `${chapter.color}CC`]}
                style={styles.chapterGradient}
              >
                <View style={styles.chapterHeader}>
                  <View style={styles.chapterIcon}>
                    <Text style={styles.chapterIconText}>{chapter.icon}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterDescription}>{chapter.description}</Text>
                    <Text style={styles.drugCount}>{chapter.drugs.length} drugs</Text>
                  </View>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${completionPercentage}%`, backgroundColor: 'white' }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{completionPercentage}% Complete</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.modeButton, styles.gamifiedButton]}
                    onPress={() => startChapterQuiz(chapter.id, 'gamified')}
                  >
                    <Text style={styles.buttonText}>Gamified Mode</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modeButton, styles.studyButton]}
                    onPress={() => startChapterQuiz(chapter.id, 'control')}
                  >
                    <Text style={styles.buttonText}>Study Mode</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.mixedQuizCard}
          onPress={() => router.push('/quiz?mode=gamified')}
        >
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.mixedQuizGradient}
          >
            <Text style={styles.mixedQuizTitle}>Mixed Quiz</Text>
            <Text style={styles.mixedQuizSubtitle}>Questions from all chapters</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modeButton, styles.gamifiedButton]}
                onPress={() => router.push('/quiz?mode=gamified')}
              >
                <Text style={styles.buttonText}>Gamified</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modeButton, styles.studyButton]}
                onPress={() => router.push('/quiz?mode=control')}
              >
                <Text style={styles.buttonText}>Study</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    paddingTop: 10,
    paddingBottom: 20,
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
    padding: 20,
  },
  chapterCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  chapterGradient: {
    padding: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chapterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chapterIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
    marginBottom: 3,
  },
  drugCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  completedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  gamifiedButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  studyButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mixedQuizCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mixedQuizGradient: {
    padding: 20,
    alignItems: 'center',
  },
  mixedQuizTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  mixedQuizSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
});
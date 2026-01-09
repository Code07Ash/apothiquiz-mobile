import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { chapters, getAllDrugs, getDrugsByChapter } from '../src/data/chapters';
import { calculateScore, checkAchievements, getLevel } from '../src/utils/scoring';
import { saveQuizSession, getUserStats } from '../src/utils/storage';

const { width, height } = Dimensions.get('window');

export default function QuizScreen() {
  const router = useRouter();
  const { mode, chapterId } = useLocalSearchParams();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);
  const [bonusAnimations, setBonusAnimations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeQuiz();
    loadUserStats();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTime(Date.now());
      animateProgress();
    }
  }, [currentIndex, questions]);

  const loadUserStats = async () => {
    const stats = await getUserStats();
    setUserStats(stats);
  };

  const initializeQuiz = () => {
    let quizQuestions;
    
    if (chapterId) {
      quizQuestions = getDrugsByChapter(parseInt(chapterId));
    } else {
      quizQuestions = getAllDrugs();
    }
    
    const shuffled = quizQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animateScore = (points) => {
    Animated.sequence([
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateStreak = () => {
    Animated.sequence([
      Animated.timing(streakAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(streakAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showBonusAnimation = (bonus) => {
    const id = Date.now();
    setBonusAnimations(prev => [...prev, { id, ...bonus }]);
    
    setTimeout(() => {
      setBonusAnimations(prev => prev.filter(b => b.id !== id));
    }, 2000);
  };

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctClass;
    const responseTime = (Date.now() - questionStartTime) / 1000;
    
    setResponseTimes(prev => [...prev, responseTime]);

    if (mode === 'gamified') {
      Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Success : Haptics.ImpactFeedbackStyle.Error);
    }

    let newStreak = streak;
    if (isCorrect) {
      newStreak = streak + 1;
      setStreak(newStreak);
      setLongestStreak(Math.max(longestStreak, newStreak));
      setCorrectAnswers(prev => prev + 1);
      
      if (mode === 'gamified') {
        animateStreak();
      }
    } else {
      setStreak(0);
    }

    const bonusFactors = {
      streak: newStreak,
      responseTime,
      difficulty: currentQuestion.difficulty
    };

    const scoreResult = calculateScore(isCorrect, mode, bonusFactors);
    const newScore = score + scoreResult.points;
    setScore(newScore);

    if (mode === 'gamified' && isCorrect) {
      animateScore(scoreResult.points);
      
      scoreResult.bonuses.forEach((bonus, index) => {
        setTimeout(() => showBonusAnimation(bonus), index * 200);
      });
    }

    if (mode === 'gamified') {
      const newAchievements = checkAchievements({
        totalCorrect: correctAnswers + (isCorrect ? 1 : 0),
        currentStreak: newStreak,
        fastAnswers: responseTimes.filter(t => t < 5).length + (responseTime < 5 ? 1 : 0),
        perfectChapters: 0,
        achievements: achievements
      });

      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);
        newAchievements.forEach(achievement => {
          Alert.alert('Achievement Unlocked', achievement.replace('_', ' '));
        });
      }
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishQuiz(newScore, correctAnswers + (isCorrect ? 1 : 0), newStreak);
      }
    }, mode === 'gamified' ? 1500 : 800);
  };

  const finishQuiz = async (finalScore, totalCorrect, finalStreak) => {
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    const session = {
      mode,
      chapterId: chapterId ? parseInt(chapterId) : null,
      finalScore,
      totalQuestions: questions.length,
      correctAnswers: totalCorrect,
      longestStreak: longestStreak,
      totalTime,
      averageResponseTime,
      fastAnswers: responseTimes.filter(t => t < 5).length,
      perfectScore: totalCorrect === questions.length,
      newAchievements: achievements,
      endedWithCorrect: finalStreak > 0
    };

    await saveQuizSession(session);

    router.push({
      pathname: '/result',
      params: {
        score: finalScore.toString(),
        total: questions.length.toString(),
        correct: totalCorrect.toString(),
        mode,
        streak: longestStreak.toString(),
        time: Math.round(totalTime).toString(),
        chapterId: chapterId || 'mixed'
      }
    });
  };

  const toggleHint = () => {
    if (mode === 'gamified') {
      setShowHint(!showHint);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const levelInfo = getLevel(score);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={mode === 'gamified' ? '#FF6B6B' : '#4ECDC4'} />
      
      <LinearGradient
        colors={mode === 'gamified' ? ['#FF6B6B', '#FF8E53'] : ['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {questions.length}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Animated.View
              style={[
                styles.statItem,
                {
                  transform: [{
                    scale: scoreAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  }],
                },
              ]}
            >
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </Animated.View>

            {mode === 'gamified' && (
              <Animated.View
                style={[
                  styles.statItem,
                  {
                    transform: [{
                      scale: streakAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    }],
                  },
                ]}
              >
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </Animated.View>
            )}

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{levelInfo.icon}</Text>
              <Text style={styles.statLabel}>{levelInfo.level}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Classify this drug:</Text>
          <Text style={styles.drugName}>{currentQuestion.name}</Text>
          
          {mode === 'gamified' && (
            <TouchableOpacity style={styles.hintButton} onPress={toggleHint}>
              <Text style={styles.hintButtonText}>Hint</Text>
            </TouchableOpacity>
          )}
          
          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{currentQuestion.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                { backgroundColor: mode === 'gamified' ? '#FF6B6B' : '#4ECDC4' }
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {bonusAnimations.map(bonus => (
        <Animated.View
          key={bonus.id}
          style={[
            styles.bonusAnimation,
            {
              opacity: 1,
              transform: [{ translateY: -50 }],
            },
          ]}
        >
          <Text style={styles.bonusText}>+{bonus.value}</Text>
        </Animated.View>
      ))}
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  drugName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  hintButton: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  hintButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hintContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  hintText: {
    fontSize: 14,
    color: '#856404',
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bonusAnimation: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.5 - 50,
    zIndex: 1000,
  },
  bonusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F39C12',
    textAlign: 'center',
  },
});
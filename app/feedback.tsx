import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { saveQuizSession } from '../src/utils/storage';

export default function FeedbackScreen() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState('');
  const [engagement, setEngagement] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [enjoyment, setEnjoyment] = useState(0);
  const [learning, setLearning] = useState(0);
  const [comments, setComments] = useState('');
  const [demographics, setDemographics] = useState({
    age: '',
    education: '',
    experience: ''
  });

  const submitFeedback = async () => {
    if (!selectedMode || engagement === 0 || difficulty === 0 || enjoyment === 0 || learning === 0) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    const feedbackData = {
      mode: selectedMode,
      ratings: {
        engagement,
        difficulty,
        enjoyment,
        learning
      },
      comments,
      demographics,
      timestamp: new Date().toISOString()
    };

    try {
      await saveQuizSession({
        ...feedbackData,
        type: 'feedback'
      });

      Alert.alert(
        'Thank You!', 
        'Your feedback has been submitted successfully.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const RatingScale = ({ title, value, onValueChange, labels }: {
    title: string;
    value: number;
    onValueChange: (value: number) => void;
    labels: [string, string];
  }) => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.ratingScale}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              value === rating && styles.ratingButtonActive
            ]}
            onPress={() => onValueChange(rating)}
          >
            <Text style={[
              styles.ratingButtonText,
              value === rating && styles.ratingButtonTextActive
            ]}>
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.ratingLabels}>
        <Text style={styles.ratingLabel}>{labels[0]}</Text>
        <Text style={styles.ratingLabel}>{labels[1]}</Text>
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
        <Text style={styles.headerTitle}>User Experience Feedback</Text>
        <Text style={styles.headerSubtitle}>Help us improve Med Classify</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Which mode did you just use?</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'gamified' && styles.modeButtonActive
              ]}
              onPress={() => setSelectedMode('gamified')}
            >
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'gamified' && styles.modeButtonTextActive
              ]}>
                Gamified Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'control' && styles.modeButtonActive
              ]}
              onPress={() => setSelectedMode('control')}
            >
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'control' && styles.modeButtonTextActive
              ]}>
                Study Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          
          <RatingScale
            title="How engaging was the quiz?"
            value={engagement}
            onValueChange={setEngagement}
            labels={['Not engaging', 'Very engaging']}
          />

          <RatingScale
            title="How difficult were the questions?"
            value={difficulty}
            onValueChange={setDifficulty}
            labels={['Too easy', 'Too difficult']}
          />

          <RatingScale
            title="How much did you enjoy the experience?"
            value={enjoyment}
            onValueChange={setEnjoyment}
            labels={['Not enjoyable', 'Very enjoyable']}
          />

          <RatingScale
            title="How effective was it for learning?"
            value={learning}
            onValueChange={setLearning}
            labels={['Not effective', 'Very effective']}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background Information (Optional)</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age Range</Text>
            <View style={styles.optionsRow}>
              {['18-25', '26-35', '36-45', '46+'].map(age => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.optionButton,
                    demographics.age === age && styles.optionButtonActive
                  ]}
                  onPress={() => setDemographics(prev => ({ ...prev, age }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    demographics.age === age && styles.optionButtonTextActive
                  ]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Education Level</Text>
            <View style={styles.optionsRow}>
              {['High School', 'Bachelor\'s', 'Master\'s', 'PhD/MD'].map(edu => (
                <TouchableOpacity
                  key={edu}
                  style={[
                    styles.optionButton,
                    demographics.education === edu && styles.optionButtonActive
                  ]}
                  onPress={() => setDemographics(prev => ({ ...prev, education: edu }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    demographics.education === edu && styles.optionButtonTextActive
                  ]}>
                    {edu}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Medical/Pharmacy Experience</Text>
            <View style={styles.optionsRow}>
              {['None', 'Student', 'Professional', 'Expert'].map(exp => (
                <TouchableOpacity
                  key={exp}
                  style={[
                    styles.optionButton,
                    demographics.experience === exp && styles.optionButtonActive
                  ]}
                  onPress={() => setDemographics(prev => ({ ...prev, experience: exp }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    demographics.experience === exp && styles.optionButtonTextActive
                  ]}>
                    {exp}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts, suggestions, or any issues you encountered..."
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
          <LinearGradient
            colors={['#27AE60', '#2ECC71']}
            style={styles.submitGradient}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  ratingScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#3498DB',
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  ratingButtonTextActive: {
    color: 'white',
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  optionButtonTextActive: {
    color: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minHeight: 100,
  },
  submitButton: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  skipButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
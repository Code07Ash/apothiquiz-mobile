import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { drugs } from '../src/data/drugs';

export default function QuizScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const currentQuestion = drugs[currentIndex];

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === currentQuestion.correctClass;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex < drugs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push({
        pathname: '/result',
        params: {
          score: isCorrect ? score + 1 : score,
          total: drugs.length,
          mode,
        },
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        Drug: {currentQuestion.name}
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Mode: {mode === 'gamified' ? 'Gamified' : 'Non-Gamified'}
      </Text>

      {currentQuestion.options.map((option) => (
        <View key={option} style={{ marginVertical: 6, width: '100%' }}>
          <Button
            title={option}
            onPress={() => handleAnswer(option)}
          />
        </View>
      ))}
    </View>
  );
}
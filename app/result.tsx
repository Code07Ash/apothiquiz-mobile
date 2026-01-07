import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function ResultScreen() {
  const router = useRouter();
  const { score, total, mode } = useLocalSearchParams<{
    score: string;
    total: string;
    mode: string;
  }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Quiz Completed
      </Text>

      <Text style={{ fontSize: 18 }}>
        Score: {score} / {total}
      </Text>

      <Text style={{ marginTop: 10 }}>
        Mode: {mode === 'gamified' ? 'Gamified' : 'Non-Gamified'}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Back to Home" onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        ApothiQuiz Mobile
      </Text>

      <Button
        title="Start Gamified Quiz"
        onPress={() => router.push('/quiz?mode=gamified')}
      />

      <Button
        title="Start Non-Gamified Quiz"
        onPress={() => router.push('/quiz?mode=control')}
      />

      <Button
        title="View Analytics"
        onPress={() => router.push('/analytics')}
      />
    </View>
  );
}
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
      <Stack.Screen name="result" options={{ title: 'Result' }} />
    </Stack>
  );
}
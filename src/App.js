import { Button, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        ApothiQuiz Mobile
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Gamified Drug Classification
      </Text>

      <Button title="Start Quiz" onPress={() => {}} />
    </View>
  );
}
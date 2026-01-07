import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        ApothiQuiz Mobile
      </Text>

      <Text style={{ marginVertical: 16 }}>
        Gamified Drug Classification
      </Text>

      <Button title="Start Quiz" onPress={() => {}} />
    </View>
  );
}
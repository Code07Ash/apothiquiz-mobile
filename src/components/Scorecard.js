import { View, Text } from "react-native";

export default function ScoreCard({ score, level }) {
  return (
    <View>
      <Text>Score: {score}</Text>
      <Text>Level: {level}</Text>
    </View>
  );
}
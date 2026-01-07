import { View, Text } from "react-native";

export default function BadgeList({ score }) {
  if (score < 50) return null;
  return (
    <View>
      <Text>🏅 High Performer</Text>
    </View>
  );
}
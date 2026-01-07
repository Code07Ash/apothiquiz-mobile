import { View, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Gamified Mode"
        onPress={() =>
          navigation.navigate("Quiz", { mode: "gamified" })
        }
      />

      <Button
        title="Non-Gamified Mode"
        onPress={() =>
          navigation.navigate("Quiz", { mode: "plain" })
        }
      />
    </View>
  );
}
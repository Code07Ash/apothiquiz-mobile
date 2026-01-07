import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Feedback({ navigation }) {
  const [feedback, setFeedback] = useState("");

  async function submitFeedback() {
    const old =
      JSON.parse(await AsyncStorage.getItem("feedback")) || [];

    old.push({
      text: feedback,
      timestamp: new Date().toISOString()
    });

    await AsyncStorage.setItem("feedback", JSON.stringify(old));

    navigation.navigate("Home");
  }

  return (
    <View>
      <Text>How was your experience?</Text>

      <TextInput
        placeholder="Write your feedback here"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      <Button
        title="Submit Feedback"
        onPress={submitFeedback}
        disabled={!feedback.trim()}
      />
    </View>
  );
}
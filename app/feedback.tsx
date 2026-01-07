import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  async function submitFeedback() {
    const stored = await AsyncStorage.getItem("feedback");
    const old = stored ? JSON.parse(stored) : [];

    old.push({
      text: feedback,
      timestamp: new Date().toISOString()
    });

    await AsyncStorage.setItem("feedback", JSON.stringify(old));
    router.replace("/");
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
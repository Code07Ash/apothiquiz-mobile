import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View>
      <Button title="Mode 1" onPress={() => { /* existing logic */ }} />
      <Button title="Mode 2" onPress={() => { /* existing logic */ }} />
      <Button
        title="View Analytics"
        onPress={() => router.push("/analytics")}
      />
    </View>
  );
}
import { Text } from "react-native";

export default function AIHelper() {
  const tips = [
    "Drugs ending in -olol are beta blockers.",
    "Cillins are usually antibiotics.",
    "Group drugs by therapeutic class."
  ];
  return (
    <Text>
      Tip: {tips[Math.floor(Math.random() * tips.length)]}
    </Text>
  );
}
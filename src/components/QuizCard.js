import { Button, Text, View } from "react-native";

export default function QuestionCard({ question, options, onAnswer }) {
  return (
    <View>
      <Text>{question}</Text>
      {options.map(opt => (
        <Button
          key={opt}
          title={opt}
          onPress={() => onAnswer(opt)}
        />
      ))}
    </View>
  );
}
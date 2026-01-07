import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import { fetchDrugNames } from "../api/drugApi";
import drugClasses from "../constants/drugClasses.json";

import { calculatePoints, getLevel } from "../utils/scoring";
import { saveSession } from "../utils/storage";

import AIHelper from "../components/AIHelper";
import BadgeList from "../components/BadgeList";
import QuestionCard from "../components/QuestionCard";
import ScoreCard from "../components/ScoreCard";

export default function QuizScreen({ route, navigation }) {
  const { mode } = route.params;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const drugs = await fetchDrugNames(5);

      const qs = drugs
        .filter(d => drugClasses[d.name])
        .map(d => ({
          question: `Classify the drug: ${d.name}`,
          correct: drugClasses[d.name],
          options: shuffle([
            drugClasses[d.name],
            "Antibiotic",
            "Analgesic",
            "Antiviral"
          ])
        }));

      setQuestions(qs);
    }

    loadQuiz();
  }, []);

  function handleAnswer(answer) {
    const correct =
      answer === questions[current].correct;

    const pts = calculatePoints(correct, mode);
    setScore(prev => prev + pts);

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
    } else {
      endQuiz();
    }
  }

  async function endQuiz() {
    await saveSession({
      mode,
      score,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString()
    });

    setFinished(true);
  }

  return (
    <View>
      {!finished && questions.length > 0 && (
        <>
          <QuestionCard
            question={questions[current].question}
            options={questions[current].options}
            onAnswer={handleAnswer}
          />

          <ScoreCard
            score={score}
            level={getLevel(score)}
          />

          {mode === "gamified" && <BadgeList score={score} />}
          {mode === "gamified" && <AIHelper />}
        </>
      )}

      {finished && (
        <>
          <Text>Quiz Completed</Text>
          <Text>Your Score: {score}</Text>

          <Button
            title="Give Feedback"
            onPress={() => navigation.navigate("Feedback")}
          />
        </>
      )}
    </View>
  );
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
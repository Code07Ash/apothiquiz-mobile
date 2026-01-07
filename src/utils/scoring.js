export function calculatePoints(correct, mode) {
  if (!correct) return 0;
  return mode === "gamified" ? 10 : 1;
}

export function getLevel(score) {
  if (score >= 100) return "Expert";
  if (score >= 50) return "Intermediate";
  return "Beginner";
}
export function normalizeSpanish(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const userNorm = normalizeSpanish(userAnswer);
  const correctNorm = normalizeSpanish(correctAnswer);
  return userNorm.length > 0 && userNorm === correctNorm;
}

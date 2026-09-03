/**
 * Brooke, J. (1996). SUS: A retrospective. Journal of Usability Studies, 8(2), 29-40.
 * Exact wording, fixed order — do not modify or randomize (standardized instrument).
 */
export const SUS_ITEMS: string[] = [
  "I think I would like to use this system frequently.",
  "I found this system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];

/**
 * Standard Brooke SUS scoring: odd items contribute (value - 1), even items
 * contribute (5 - value), summed and multiplied by 2.5 for a 0-100 score.
 * (The "(sum - 10) * 2.5" shortcut is not equivalent unless responses are
 * symmetric, so the full per-item formula is used here.)
 */
export function calculateSusScore(responses: number[]): number {
  if (responses.some((r) => r < 1 || r > 5)) return 0;
  const total = responses.reduce((sum, value, index) => {
    const isOdd = index % 2 === 0; // items 1,3,5,7,9 (0-indexed: 0,2,4,6,8)
    return sum + (isOdd ? value - 1 : 5 - value);
  }, 0);
  return total * 2.5;
}

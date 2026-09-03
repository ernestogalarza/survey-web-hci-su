import type { NasaTlxData } from "@/types/survey";

/**
 * Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX (Task Load
 * Index). Advances in Psychology, 52, 139-183. All six dimensions, 1-21 scale.
 */
export interface NasaTlxDimension {
  key: keyof NasaTlxData;
  label: string;
  question: string;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
}

export const NASA_TLX_DIMENSIONS: NasaTlxDimension[] = [
  {
    key: "mentalDemand",
    label: "Mental Demand",
    question: "How mentally demanding was the task?",
    lowLabel: "Low (1)",
    midLabel: "Middle (11)",
    highLabel: "High (21)",
  },
  {
    key: "physicalDemand",
    label: "Physical Demand",
    question: "How physically demanding was the task?",
    lowLabel: "Low (1)",
    midLabel: "Middle (11)",
    highLabel: "High (21)",
  },
  {
    key: "temporalDemand",
    label: "Temporal Demand",
    question: "How rushed or pressured did you feel?",
    lowLabel: "Low (1)",
    midLabel: "Middle (11)",
    highLabel: "High (21)",
  },
  {
    key: "performance",
    label: "Performance",
    question: "How successful were you in accomplishing the task?",
    lowLabel: "Poor (1)",
    midLabel: "Moderate (11)",
    highLabel: "Perfect (21)",
  },
  {
    key: "effort",
    label: "Effort",
    question: "How hard did you have to work to accomplish your performance?",
    lowLabel: "Low (1)",
    midLabel: "Middle (11)",
    highLabel: "High (21)",
  },
  {
    key: "frustration",
    label: "Frustration",
    question: "How insecure, discouraged, or frustrated did you feel?",
    lowLabel: "Low (1)",
    midLabel: "Middle (11)",
    highLabel: "High (21)",
  },
];

export function calculateNasaTlxScore(data: NasaTlxData): number {
  const values = Object.values(data);
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length / 21) * 100;
}

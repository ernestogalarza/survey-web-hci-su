import type { QualitativeData } from "@/types/survey";

export interface QualitativeQuestionDef {
  key: keyof QualitativeData;
  question: string;
}

export const QUALITATIVE_QUESTIONS: QualitativeQuestionDef[] = [
  {
    key: "preference",
    question: "Which visual interface did you prefer (Condition A: Text Labels or Condition B: 3D Models), and why?",
  },
  {
    key: "cognitive_load",
    question: "Did you find the visual information in either condition overwhelming or distracting? Please explain.",
  },
  {
    key: "interaction",
    question: "How natural did the physical 'poke' gesture feel? Did you experience any confusion on what to touch?",
  },
  {
    key: "focus_memory",
    question: "Which visual setup made it easier to focus on remembering the Spanish words, and why?",
  },
  {
    key: "issues",
    question: "Did you experience any physical discomfort, visual fatigue, or technical issues?",
  },
  {
    key: "comments",
    question: "Any other comments or suggestions?",
  },
];

export const QUALITATIVE_CHAR_LIMIT = 500;

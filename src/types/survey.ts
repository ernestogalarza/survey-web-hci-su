export type Condition = "A" | "B";
export type ConditionOrder = "A-B" | "B-A";
export type QuestionType = "progressive_hints" | "direct_mc";

export interface VocabWord {
  id: string;
  spanish: string;
  english: string;
  emoji: string;
  condition: Condition;
  questionType: QuestionType;
  /** English definition shown as Hint 2 (progressive hints only) */
  definitionHint: string;
  /** Three wrong Spanish options used to build the multiple-choice step */
  distractors: [string, string, string];
}

export interface Attempt {
  level: number;
  answer: string;
  correct: boolean;
  timestamp: number;
  responseTimeMs: number;
}

export interface QuestionResult {
  questionId: string;
  word: string;
  condition: Condition;
  questionType: QuestionType;
  levelReached: number;
  finalAnswer: string;
  isCorrect: boolean;
  attempts: Attempt[];
}

export interface NasaTlxData {
  mentalDemand: number;
  physicalDemand: number;
  temporalDemand: number;
  performance: number;
  effort: number;
  frustration: number;
}

export const NASA_TLX_DEFAULT: NasaTlxData = {
  mentalDemand: 11,
  physicalDemand: 11,
  temporalDemand: 11,
  performance: 11,
  effort: 11,
  frustration: 11,
};

export interface QualitativeData {
  preference: string;
  cognitive_load: string;
  interaction: string;
  focus_memory: string;
  issues: string;
  comments: string;
}

export const QUALITATIVE_DEFAULT: QualitativeData = {
  preference: "",
  cognitive_load: "",
  interaction: "",
  focus_memory: "",
  issues: "",
  comments: "",
};

/** SUS responses: fixed-length array of 10, 0 = unanswered, 1-5 = Likert value */
export type SusResponses = number[];

export interface SessionData {
  participantId: string;
  timestamp: string;
  conditionOrder: ConditionOrder;
  started: boolean;
  postTestA: Record<string, QuestionResult>;
  postTestB: Record<string, QuestionResult>;
  nasaTlxA: NasaTlxData;
  nasaTlxB: NasaTlxData;
  susA: SusResponses;
  susB: SusResponses;
  qualitative: QualitativeData;
}

export function createEmptySession(): SessionData {
  return {
    participantId: "",
    timestamp: "",
    conditionOrder: "A-B",
    started: false,
    postTestA: {},
    postTestB: {},
    nasaTlxA: { ...NASA_TLX_DEFAULT },
    nasaTlxB: { ...NASA_TLX_DEFAULT },
    susA: new Array(10).fill(0),
    susB: new Array(10).fill(0),
    qualitative: { ...QUALITATIVE_DEFAULT },
  };
}

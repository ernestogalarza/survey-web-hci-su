import { SUS_ITEMS } from "@/data/susItems";
import { NASA_TLX_DIMENSIONS } from "@/data/nasaTlxDimensions";
import { QUALITATIVE_QUESTIONS } from "@/data/qualitativeQuestions";
import type { SessionData } from "@/types/survey";

const COLUMNS = [
  "Participant_ID",
  "Session_Date",
  "Condition_Order",
  "Question_ID",
  "Condition",
  "Question_Type",
  "Word_Spanish",
  "Level_Reached",
  "Final_Answer",
  "Is_Correct",
  "NASA_Dimension",
  "NASA_Value",
  "SUS_Item",
  "SUS_Value",
  "Qualitative_Question",
  "Qualitative_Response",
  "Attempts_JSON",
] as const;

type Row = Record<(typeof COLUMNS)[number], string>;

function emptyRow(session: SessionData): Row {
  return {
    Participant_ID: session.participantId,
    Session_Date: session.timestamp,
    Condition_Order: session.conditionOrder,
    Question_ID: "",
    Condition: "",
    Question_Type: "",
    Word_Spanish: "",
    Level_Reached: "",
    Final_Answer: "",
    Is_Correct: "",
    NASA_Dimension: "",
    NASA_Value: "",
    SUS_Item: "",
    SUS_Value: "",
    Qualitative_Question: "",
    Qualitative_Response: "",
    Attempts_JSON: "",
  };
}

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsvRows(session: SessionData): Row[] {
  const rows: Row[] = [];

  for (const postTest of [session.postTestA, session.postTestB]) {
    for (const result of Object.values(postTest)) {
      rows.push({
        ...emptyRow(session),
        Question_ID: result.questionId,
        Condition: result.condition,
        Question_Type: result.questionType,
        Word_Spanish: result.word,
        Level_Reached: String(result.levelReached),
        Final_Answer: result.finalAnswer,
        Is_Correct: String(result.isCorrect),
        Attempts_JSON: JSON.stringify(result.attempts),
      });
    }
  }

  for (const [condition, nasa] of [
    ["A", session.nasaTlxA],
    ["B", session.nasaTlxB],
  ] as const) {
    for (const dim of NASA_TLX_DIMENSIONS) {
      rows.push({
        ...emptyRow(session),
        Condition: condition,
        NASA_Dimension: dim.label,
        NASA_Value: String(nasa[dim.key]),
      });
    }
  }

  for (const [condition, sus] of [
    ["A", session.susA],
    ["B", session.susB],
  ] as const) {
    SUS_ITEMS.forEach((item, index) => {
      rows.push({
        ...emptyRow(session),
        Condition: condition,
        SUS_Item: item,
        SUS_Value: String(sus[index] ?? 0),
      });
    });
  }

  for (const q of QUALITATIVE_QUESTIONS) {
    rows.push({
      ...emptyRow(session),
      Qualitative_Question: q.question,
      Qualitative_Response: session.qualitative[q.key],
    });
  }

  return rows;
}

export function generateCsv(session: SessionData): string {
  const rows = buildCsvRows(session);
  const lines = [
    COLUMNS.join(","),
    ...rows.map((row) => COLUMNS.map((col) => escapeCsvField(row[col])).join(",")),
  ];
  return lines.join("\n");
}

export function csvFilename(session: SessionData): string {
  const date = session.timestamp ? new Date(session.timestamp) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const timePart = `${pad(date.getHours())}${pad(date.getMinutes())}`;
  const participant = session.participantId || "unknown";
  return `participant_${participant}_session_${datePart}_${timePart}.csv`;
}

export function downloadCsv(session: SessionData): void {
  const csv = generateCsv(session);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = csvFilename(session);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

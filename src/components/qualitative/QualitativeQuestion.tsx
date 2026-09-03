"use client";

import { QUALITATIVE_CHAR_LIMIT } from "@/data/qualitativeQuestions";

interface QualitativeQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
}

export function QualitativeQuestion({ question, value, onChange }: QualitativeQuestionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#2c3e50]">{question}</h2>
      <textarea
        value={value}
        maxLength={QUALITATIVE_CHAR_LIMIT}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Type your answer here…"
        className="w-full resize-none rounded-lg border-2 border-[#bdc3c7] px-3.5 py-3 text-base transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] focus:outline-none"
      />
      <span className="self-end text-xs text-[#2c3e50]/60">
        {value.length}/{QUALITATIVE_CHAR_LIMIT}
      </span>
    </div>
  );
}

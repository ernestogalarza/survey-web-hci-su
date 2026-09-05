"use client";

import { calculateNasaTlxScore } from "@/data/nasaTlxDimensions";
import { calculateSusScore } from "@/data/susItems";
import { downloadCsv } from "@/lib/csvExport";
import type { SessionData } from "@/types/survey";

interface SurveyCompleteProps {
  session: SessionData;
  onReview: () => void;
}

export function SurveyComplete({ session, onReview }: SurveyCompleteProps) {
  const susAScore = calculateSusScore(session.susA);
  const susBScore = calculateSusScore(session.susB);
  const nasaAScore = calculateNasaTlxScore(session.nasaTlxA);
  const nasaBScore = calculateNasaTlxScore(session.nasaTlxB);

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-xl font-bold text-[#2c3e50]">Session Complete ✅</h1>
        <p className="mt-2 text-sm text-[#2c3e50]/70">
          Thank you, {session.participantId}. Your responses have been saved.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-[#f9f9f9] p-3">
            <dt className="text-[#2c3e50]/60">SUS score A</dt>
            <dd className="text-lg font-bold text-[#2c3e50]">{susAScore.toFixed(1)}</dd>
          </div>
          <div className="rounded-lg bg-[#f9f9f9] p-3">
            <dt className="text-[#2c3e50]/60">SUS score B</dt>
            <dd className="text-lg font-bold text-[#2c3e50]">{susBScore.toFixed(1)}</dd>
          </div>
          <div className="rounded-lg bg-[#f9f9f9] p-3">
            <dt className="text-[#2c3e50]/60">NASA-TLX A</dt>
            <dd className="text-lg font-bold text-[#2c3e50]">{nasaAScore.toFixed(1)}</dd>
          </div>
          <div className="rounded-lg bg-[#f9f9f9] p-3">
            <dt className="text-[#2c3e50]/60">NASA-TLX B</dt>
            <dd className="text-lg font-bold text-[#2c3e50]">{nasaBScore.toFixed(1)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => downloadCsv(session)}
            className="rounded-lg bg-linear-to-br from-[#3498db] to-[#2980b9] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(52,152,219,0.4)]"
          >
            ⬇ Export CSV
          </button>
          <button
            type="button"
            onClick={onReview}
            className="rounded-lg border-2 border-[#bdc3c7] px-6 py-3.5 font-semibold text-[#2c3e50] transition-colors hover:border-[#3498db] hover:text-[#3498db]"
          >
            ← Review Answers
          </button>
        </div>
      </div>
    </div>
  );
}

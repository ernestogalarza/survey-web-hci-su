import { wordsForCondition } from "@/data/vocabulary";
import type { Condition, QuestionResult } from "@/types/survey";
import { VocabImage } from "./VocabImage";

interface PostTestSummaryProps {
  condition: Condition;
  results: Record<string, QuestionResult>;
}

function formatPercent(numerator: number, denominator: number): string {
  if (denominator === 0) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export function PostTestSummary({ condition, results }: PostTestSummaryProps) {
  const words = wordsForCondition(condition);
  const answered = words.map((word) => ({ word, result: results[word.id] })).filter((w) => w.result);

  const level1Attempts = answered.filter(({ result }) =>
    result!.attempts.some((a) => a.level === 1),
  );
  const level1Correct = level1Attempts.filter(
    ({ result }) => result!.attempts.find((a) => a.level === 1)!.correct,
  ).length;

  const mcAttempts = answered.filter(({ word }) => word.questionType === "direct_mc");
  const mcCorrect = mcAttempts.filter(({ result }) => result!.isCorrect).length;

  const overallCorrect = answered.filter(({ result }) => result!.isCorrect).length;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-[#2c3e50]">
          📊 Condition {condition} Post-Test Summary
        </h2>
        <p className="mt-1 text-sm text-[#2c3e50]/70">
          {answered.length} of {words.length} words answered
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[#f9f9f9] p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/60">
            Free Recall Accuracy
          </p>
          <p className="mt-1 text-2xl font-bold text-[#2c3e50]">
            {formatPercent(level1Correct, level1Attempts.length)}
          </p>
          <p className="text-xs text-[#2c3e50]/50">Level 1, unaided</p>
        </div>
        <div className="rounded-lg bg-[#f9f9f9] p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/60">
            Multiple Choice Accuracy
          </p>
          <p className="mt-1 text-2xl font-bold text-[#2c3e50]">
            {formatPercent(mcCorrect, mcAttempts.length)}
          </p>
          <p className="text-xs text-[#2c3e50]/50">Recognition level</p>
        </div>
        <div className="rounded-lg bg-[#f9f9f9] p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/60">
            Overall Accuracy
          </p>
          <p className="mt-1 text-2xl font-bold text-[#2c3e50]">
            {overallCorrect} / {answered.length}
          </p>
          <p className="text-xs text-[#2c3e50]/50">
            correct ({formatPercent(overallCorrect, answered.length)})
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2c3e50]/60">
          Your Answers
        </h3>
        <ul className="mt-2 divide-y divide-[#ecf0f1]">
          {words.map((word) => {
            const result = results[word.id];
            return (
              <li key={word.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-[#2c3e50]">
                  <VocabImage word={word} size="sm" />
                  <span className="capitalize">{word.spanish}</span>
                  <span className="text-[#2c3e50]/50">({word.english})</span>
                </span>
                {result ? (
                  <span className="text-xs text-[#2c3e50]/50">
                    Answered · Level {result.levelReached}
                  </span>
                ) : (
                  <span className="text-xs text-[#2c3e50]/40">Not answered</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

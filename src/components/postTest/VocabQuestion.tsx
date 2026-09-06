"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Attempt, QuestionResult, VocabWord } from "@/types/survey";
import { checkAnswer } from "@/lib/fuzzyMatch";
import { firstLetterHint, maxStageFor } from "@/data/vocabulary";
import { AudioButton } from "./AudioButton";
import { VocabImage } from "./VocabImage";

interface VocabQuestionProps {
  word: VocabWord;
  result: QuestionResult | undefined;
  onUpdate: (result: QuestionResult) => void;
  audioEnabled: boolean;
}

const MAX_HINTS = 2;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildAttempt(level: number, answer: string, correct: boolean, startedAt: number): Attempt {
  const now = Date.now();
  return {
    level,
    answer,
    correct,
    timestamp: now,
    responseTimeMs: now - startedAt,
  };
}

export function VocabQuestion({ word, result, onUpdate, audioEnabled }: VocabQuestionProps) {
  const maxStage = maxStageFor(word);
  const isDirectMc = word.questionType === "direct_mc";

  const [attempts, setAttempts] = useState<Attempt[]>(result?.attempts ?? []);
  const [textValue, setTextValue] = useState("");
  const [finalResult, setFinalResult] = useState<QuestionResult | null>(result ?? null);
  // Hints are requested on demand by the participant — they are never forced
  // after an incorrect attempt. 0 = no hint shown, up to MAX_HINTS.
  const [hintsRevealed, setHintsRevealed] = useState(0);

  // direct_mc has a single recognition step; progressive_hints' current
  // level is derived from how many hints the participant has asked for.
  const currentLevel = isDirectMc ? maxStage : hintsRevealed + 1;

  const levelShownAt = useRef(0);
  useEffect(() => {
    levelShownAt.current = Date.now();
  }, [currentLevel]);

  const mcOptions = useMemo(
    () => shuffle([word.spanish, ...word.distractors]),
    [word.spanish, word.distractors],
  );

  const completed = finalResult !== null;
  // Per Johnson-Glenberg (2018) & Ibrahim et al. (2018): showing correctness
  // feedback during the task contaminates the embodied-memory measure. No
  // level (including the multiple-choice/recognition level) reveals whether
  // the response was correct; only the aggregate result is shown at the end
  // of the post-test.

  function finish(level: number, answer: string, allAttempts: Attempt[], isCorrect: boolean) {
    const finished: QuestionResult = {
      questionId: word.id,
      word: word.spanish,
      condition: word.condition,
      questionType: word.questionType,
      levelReached: level,
      finalAnswer: answer,
      isCorrect,
      attempts: allAttempts,
    };
    setFinalResult(finished);
    onUpdate(finished);
  }

  function handleTextSubmit() {
    const value = textValue.trim();
    if (!value || completed) return;
    const isCorrect = checkAnswer(value, word.spanish);
    const newAttempts = [...attempts, buildAttempt(currentLevel, value, isCorrect, levelShownAt.current)];
    setAttempts(newAttempts);
    setTextValue("");
    if (isCorrect) {
      finish(currentLevel, value, newAttempts, true);
    }
    // Incorrect: stay silent, no feedback — the participant may request a
    // hint or keep trying freely.
  }

  function handleShowHint() {
    setHintsRevealed((h) => Math.min(h + 1, MAX_HINTS));
  }

  function handleSkip() {
    if (completed) return;
    finish(currentLevel, textValue.trim(), attempts, false);
  }

  function handleSelectOption(option: string) {
    if (completed) return;
    const isCorrect = checkAnswer(option, word.spanish);
    const newAttempts = [...attempts, buildAttempt(currentLevel, option, isCorrect, levelShownAt.current)];
    setAttempts(newAttempts);
    finish(currentLevel, option, newAttempts, isCorrect);
  }

  const badgeLabel = isDirectMc ? "📋 Direct Multiple Choice" : "🔍 Progressive Hints";

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#ecf7ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2980b9]">
          {badgeLabel}
        </span>
        {completed && (
          <span className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/60">
            Level {finalResult?.levelReached} reached
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl bg-[#f9f9f9] py-8">
        <VocabImage word={word} size="lg" />
        <AudioButton text={word.spanish} enabled={audioEnabled} />
      </div>

      {completed ? (
        <div className="rounded-lg bg-[#f9f9f9] p-4 text-center">
          <p className="text-sm font-medium text-[#2c3e50]">Your response has been recorded.</p>
        </div>
      ) : isDirectMc ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[#2c3e50]">Select the correct Spanish word:</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {mcOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                className="min-h-11 rounded-lg border-2 border-[#bdc3c7] px-4 py-3 text-left font-medium capitalize text-[#2c3e50] transition-colors hover:border-[#3498db] hover:bg-[#ecf7ff]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hintsRevealed >= 1 && (
            <div className="rounded-lg bg-[#ecf7ff] p-3 text-sm text-[#2c3e50]">
              <p>Hint 1: {firstLetterHint(word.spanish)}</p>
              {hintsRevealed >= 2 && <p>Hint 2: {word.definitionHint}</p>}
            </div>
          )}
          <p className="text-sm font-medium text-[#2c3e50]">Write the Spanish word you remember</p>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Escribe tu respuesta…"
            className="w-full rounded-lg border-2 border-[#bdc3c7] px-3.5 py-3 text-base transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className="rounded-lg bg-linear-to-br from-[#3498db] to-[#2980b9] px-5 py-3 font-semibold text-white transition-transform hover:enabled:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
            {hintsRevealed < MAX_HINTS && (
              <button
                type="button"
                onClick={handleShowHint}
                className="rounded-lg border-2 border-[#f39c12] px-4 py-2.5 font-semibold text-[#e67e22] transition-colors hover:bg-[#f39c12]/10"
              >
                💡 {hintsRevealed === 0 ? "Show hint" : "Show another hint"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#2c3e50]/50 transition-colors hover:text-[#e74c3c]"
            >
              I don&apos;t know / Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

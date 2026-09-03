"use client";

import { useState } from "react";
import type { ConditionOrder } from "@/types/survey";

interface SurveySetupProps {
  onStart: (participantId: string, conditionOrder: ConditionOrder) => void;
}

export function SurveySetup({ onStart }: SurveySetupProps) {
  const [participantId, setParticipantId] = useState("");
  const [conditionOrder, setConditionOrder] = useState<ConditionOrder>("A-B");

  const canStart = participantId.trim().length > 0;

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-xl font-bold text-[#2c3e50]">
          MR Thesis Questionnaire System
        </h1>
        <p className="mt-2 text-sm text-[#2c3e50]/70">
          Spanish vocabulary acquisition via Mixed Reality — session setup
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/70">
              Participant ID
            </span>
            <input
              type="text"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder="e.g. P001"
              className="w-full rounded-lg border-2 border-[#bdc3c7] px-3.5 py-3 text-base transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/70">
              Condition Order
            </span>
            <select
              value={conditionOrder}
              onChange={(e) => setConditionOrder(e.target.value as ConditionOrder)}
              className="w-full rounded-lg border-2 border-[#bdc3c7] px-3.5 py-3 text-base transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] focus:outline-none"
            >
              <option value="A-B">A → B (Spatial Labeling first)</option>
              <option value="B-A">B → A (Object Augmented first)</option>
            </select>
          </label>

          <button
            type="button"
            disabled={!canStart}
            onClick={() => onStart(participantId.trim(), conditionOrder)}
            className="mt-2 rounded-lg bg-linear-to-br from-[#3498db] to-[#2980b9] px-6 py-3.5 font-semibold text-white transition-transform hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_4px_12px_rgba(52,152,219,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { ConditionOrder, SessionData } from "@/types/survey";

interface StoredSession {
  session: SessionData;
  currentStep: number;
}

interface SurveySetupProps {
  onStart: (participantId: string, conditionOrder: ConditionOrder) => void;
  onResume: (session: SessionData, currentStep: number) => void;
}

export function SurveySetup({ onStart, onResume }: SurveySetupProps) {
  const [participantId, setParticipantId] = useState("");
  const [conditionOrder, setConditionOrder] = useState<ConditionOrder>("A-B");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const canStart = participantId.trim().length > 0;

  async function handleStart() {
    const id = participantId.trim();
    if (!id) return;
    setIsChecking(true);
    try {
      const res = await fetch(`/api/sessions?participantId=${encodeURIComponent(id)}`);
      const found = res.ok ? ((await res.json()) as StoredSession | null) : null;
      if (found) {
        onResume(found.session, found.currentStep);
      } else {
        onStart(id, conditionOrder);
      }
    } catch {
      // Lookup failed (offline, etc.) — fall back to starting fresh rather
      // than blocking the participant.
      onStart(id, conditionOrder);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleDeleteAllData() {
    const confirmed = window.confirm(
      "This permanently deletes ALL collected participant responses from the server (every session saved so far). This cannot be undone. Continue?",
    );
    if (!confirmed) return;
    setIsDeleting(true);
    setDeleteStatus(null);
    try {
      const res = await fetch("/api/sessions", { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      setDeleteStatus("All collected data has been deleted.");
    } catch {
      setDeleteStatus("Could not delete data — check your connection and try again.");
    } finally {
      setIsDeleting(false);
    }
  }

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
            <span className="text-xs text-[#2c3e50]/50">
              Re-entering an ID that already has saved progress resumes it automatically.
            </span>
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
            disabled={!canStart || isChecking}
            onClick={handleStart}
            className="mt-2 rounded-lg bg-linear-to-br from-[#3498db] to-[#2980b9] px-6 py-3.5 font-semibold text-white transition-transform hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_4px_12px_rgba(52,152,219,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChecking ? "Checking for saved progress…" : "Start Session"}
          </button>
        </div>

        <div className="mt-8 border-t border-[#ecf0f1] pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/50">
            Researcher options
          </p>
          <button
            type="button"
            onClick={handleDeleteAllData}
            disabled={isDeleting}
            className="mt-2 text-xs font-semibold text-[#e74c3c]/70 underline-offset-2 transition-colors hover:text-[#e74c3c] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            🗑 {isDeleting ? "Deleting…" : "Clear all collected data"}
          </button>
          {deleteStatus && (
            <p className="mt-1.5 text-xs text-[#2c3e50]/60">{deleteStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}

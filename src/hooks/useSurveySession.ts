"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createEmptySession,
  type Condition,
  type ConditionOrder,
  type NasaTlxData,
  type QualitativeData,
  type QuestionResult,
  type SessionData,
} from "@/types/survey";
import { SECTIONS, TOTAL_STEPS, firstStepOfSection, sectionForStep } from "@/lib/steps";

const STORAGE_KEY = "mr-thesis-survey-session";

interface PersistedState {
  session: SessionData;
  currentStep: number;
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function useSurveySession() {
  const [session, setSession] = useState<SessionData>(() => createEmptySession());
  const [currentStep, setCurrentStep] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    // One-time sync from localStorage on mount. A lazy useState initializer
    // can't read localStorage here without causing an SSR/CSR hydration
    // mismatch (the server has no access to the browser's stored session).
    const persisted = loadPersisted();
    if (persisted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(persisted.session);
      setCurrentStep(persisted.currentStep);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const payload: PersistedState = { session, currentStep };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [session, currentStep]);

  // Continuously mirrors the in-progress session to the server (debounced),
  // so answers survive switching to another participant or closing the
  // browser entirely — not just a reload of the same tab (localStorage only
  // covers that). Re-entering the same participant ID on the setup screen
  // fetches this saved record to resume exactly where they left off.
  useEffect(() => {
    if (!hydrated.current || !session.started) return;
    const timeout = setTimeout(() => {
      fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, currentStep }),
      }).catch(() => {
        // Best-effort only: localStorage on this device remains the fallback.
      });
    }, 800);
    return () => clearTimeout(timeout);
  }, [session, currentStep]);

  const startSession = useCallback((participantId: string, conditionOrder: ConditionOrder) => {
    setSession((prev) => ({
      ...prev,
      participantId,
      conditionOrder,
      timestamp: new Date().toISOString(),
      started: true,
    }));
    setCurrentStep(0);
  }, []);

  const resetSession = useCallback(() => {
    setSession(createEmptySession());
    setCurrentStep(0);
  }, []);

  // Restarts the same participant from question 1 — keeps their ID and
  // condition order, but wipes all recorded answers. Distinct from
  // resetSession, which also clears the participant ID (used to switch
  // to a different participant).
  const restartCurrentParticipant = useCallback(() => {
    setSession((prev) => ({
      ...createEmptySession(),
      participantId: prev.participantId,
      conditionOrder: prev.conditionOrder,
      timestamp: new Date().toISOString(),
      started: true,
    }));
    setCurrentStep(0);
  }, []);

  // Hydrates local state from a record fetched from the server (see
  // SurveySetup), so a participant can pick up exactly where they left off.
  const resumeSession = useCallback((resumedSession: SessionData, resumedStep: number) => {
    setSession(resumedSession);
    setCurrentStep(resumedStep);
  }, []);

  const updatePostTestResult = useCallback((condition: Condition, result: QuestionResult) => {
    setSession((prev) => ({
      ...prev,
      [condition === "A" ? "postTestA" : "postTestB"]: {
        ...(condition === "A" ? prev.postTestA : prev.postTestB),
        [result.questionId]: result,
      },
    }));
  }, []);

  const updateNasaTlx = useCallback(
    (condition: Condition, key: keyof NasaTlxData, value: number) => {
      setSession((prev) => {
        const field = condition === "A" ? "nasaTlxA" : "nasaTlxB";
        return { ...prev, [field]: { ...prev[field], [key]: value } };
      });
    },
    [],
  );

  const updateSus = useCallback((condition: Condition, index: number, value: number) => {
    setSession((prev) => {
      const field = condition === "A" ? "susA" : "susB";
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  }, []);

  const updateQualitative = useCallback((key: keyof QualitativeData, value: string) => {
    setSession((prev) => ({
      ...prev,
      qualitative: { ...prev.qualitative, [key]: value },
    }));
  }, []);

  const isFirstStep = currentStep <= 0;
  const isLastStep = currentStep >= TOTAL_STEPS - 1;

  const goNext = useCallback(() => {
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrevious = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }, []);

  const goToSection = useCallback((sectionIndex: number) => {
    setCurrentStep(firstStepOfSection(sectionIndex));
  }, []);

  const location = sectionForStep(currentStep);

  return {
    session,
    currentStep,
    location,
    sections: SECTIONS,
    totalSteps: TOTAL_STEPS,
    isFirstStep,
    isLastStep,
    startSession,
    resetSession,
    restartCurrentParticipant,
    resumeSession,
    updatePostTestResult,
    updateNasaTlx,
    updateSus,
    updateQualitative,
    goNext,
    goPrevious,
    goToSection,
  };
}

"use client";

import { useState } from "react";
import { useSurveySession } from "@/hooks/useSurveySession";
import { wordsForCondition } from "@/data/vocabulary";
import { NASA_TLX_DIMENSIONS } from "@/data/nasaTlxDimensions";
import { SUS_ITEMS } from "@/data/susItems";
import { QUALITATIVE_QUESTIONS } from "@/data/qualitativeQuestions";
import { SurveySetup } from "./SurveySetup";
import { SurveyComplete } from "./SurveyComplete";
import { TabNav } from "./TabNav";
import { ProgressBar } from "./ProgressBar";
import { NavButtons } from "./NavButtons";
import { VocabQuestion } from "./postTest/VocabQuestion";
import { PostTestSummary } from "./postTest/PostTestSummary";
import { NasaTlxSlider } from "./nasaTlx/NasaTlxSlider";
import { SusLikert } from "./sus/SusLikert";
import { QualitativeQuestion } from "./qualitative/QualitativeQuestion";

export function SurveyApp() {
  const {
    session,
    location,
    sections,
    isFirstStep,
    isLastStep,
    startSession,
    resetSession,
    updatePostTestResult,
    updateNasaTlx,
    updateSus,
    updateQualitative,
    goNext,
    goPrevious,
    goToSection,
  } = useSurveySession();

  const [showComplete, setShowComplete] = useState(false);

  if (!session.started) {
    return <SurveySetup onStart={startSession} />;
  }

  if (showComplete) {
    return <SurveyComplete session={session} onReview={() => setShowComplete(false)} />;
  }

  const { section, localIndex } = location;

  function handleNext() {
    if (isLastStep) {
      setShowComplete(true);
    } else {
      goNext();
    }
  }

  function handleRestart() {
    const confirmed = window.confirm(
      "Esto borrará todas las respuestas del participante actual y volverá a la pantalla de inicio. ¿Deseas continuar?",
    );
    if (!confirmed) return;
    resetSession();
    setShowComplete(false);
  }

  function renderStepContent() {
    switch (section.key) {
      case "postTestA":
      case "postTestB": {
        const condition = section.key === "postTestA" ? "A" : "B";
        const words = wordsForCondition(condition);
        const results = condition === "A" ? session.postTestA : session.postTestB;
        if (localIndex >= words.length) {
          return <PostTestSummary condition={condition} results={results} />;
        }
        const word = words[localIndex];
        return (
          <VocabQuestion
            key={word.id}
            word={word}
            result={results[word.id]}
            onUpdate={(r) => updatePostTestResult(condition, r)}
          />
        );
      }
      case "nasaTlxA":
      case "nasaTlxB": {
        const condition = section.key === "nasaTlxA" ? "A" : "B";
        const dimension = NASA_TLX_DIMENSIONS[localIndex];
        const data = condition === "A" ? session.nasaTlxA : session.nasaTlxB;
        return (
          <NasaTlxSlider
            key={dimension.key}
            dimension={dimension}
            value={data[dimension.key]}
            onChange={(value) => updateNasaTlx(condition, dimension.key, value)}
          />
        );
      }
      case "susA":
      case "susB": {
        const condition = section.key === "susA" ? "A" : "B";
        const responses = condition === "A" ? session.susA : session.susB;
        return (
          <SusLikert
            key={localIndex}
            itemNumber={localIndex + 1}
            itemText={SUS_ITEMS[localIndex]}
            value={responses[localIndex]}
            onChange={(value) => updateSus(condition, localIndex, value)}
          />
        );
      }
      case "qualitative": {
        const q = QUALITATIVE_QUESTIONS[localIndex];
        return (
          <QualitativeQuestion
            key={q.key}
            question={q.question}
            value={session.qualitative[q.key]}
            onChange={(value) => updateQualitative(q.key, value)}
          />
        );
      }
      default:
        return null;
    }
  }

  const progressLabels: Record<string, string> = {
    postTestA: "Question",
    postTestB: "Question",
    nasaTlxA: "Dimension",
    nasaTlxB: "Dimension",
    susA: "Item",
    susB: "Item",
    qualitative: "Question",
  };

  const isPostTest = section.key === "postTestA" || section.key === "postTestB";
  const questionCount = section.count - 1; // last slot in post-test sections is the summary
  const isSummaryStep = isPostTest && localIndex >= questionCount;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-linear-to-br from-[#667eea] to-[#764ba2]">
      <div className="flex items-center justify-between gap-3 bg-[#1f2d3a] px-4 py-2 text-xs text-white/70">
        <span>
          Participant: <strong className="text-white">{session.participantId}</strong>
        </span>
        <button
          type="button"
          onClick={handleRestart}
          className="shrink-0 rounded-md border border-white/25 px-2.5 py-1 font-semibold text-white/90 transition-colors hover:border-white/60 hover:text-white"
        >
          🔁 Change participant / Restart
        </button>
      </div>
      <TabNav sections={sections} activeIndex={location.sectionIndex} onSelect={goToSection} />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <ProgressBar
          label={
            isSummaryStep
              ? "Summary"
              : `${progressLabels[section.key]} ${localIndex + 1} of ${isPostTest ? questionCount : section.count}`
          }
          current={isSummaryStep ? questionCount : localIndex + 1}
          total={isPostTest ? questionCount : section.count}
        />
        {renderStepContent()}
        <NavButtons
          onPrevious={goPrevious}
          onNext={handleNext}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  );
}

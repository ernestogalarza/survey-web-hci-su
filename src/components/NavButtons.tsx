interface NavButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function NavButtons({ onPrevious, onNext, isFirstStep, isLastStep }: NavButtonsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="rounded-lg border-2 border-[#bdc3c7] px-6 py-3.5 font-semibold text-[#2c3e50] transition-colors hover:enabled:border-[#3498db] hover:enabled:text-[#3498db] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        className="rounded-lg bg-linear-to-br from-[#3498db] to-[#2980b9] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(52,152,219,0.4)]"
      >
        {isLastStep ? "Complete Session" : "Next →"}
      </button>
    </div>
  );
}

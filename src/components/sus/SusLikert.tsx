"use client";

interface SusLikertProps {
  itemNumber: number;
  itemText: string;
  value: number;
  onChange: (value: number) => void;
}

const LIKERT_LABELS: Record<number, string> = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

export function SusLikert({ itemNumber, itemText, value, onChange }: SusLikertProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#2980b9]">
          Item {itemNumber} of 10
        </span>
        <h2 className="mt-1 text-lg font-semibold text-[#2c3e50]">{itemText}</h2>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border-2 py-3 font-semibold transition-colors ${
              value === num
                ? "border-[#3498db] bg-[#3498db] text-white"
                : "border-[#bdc3c7] text-[#2c3e50] hover:border-[#3498db] hover:bg-[#ecf7ff]"
            }`}
          >
            <span className="text-lg">{num}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[#2c3e50]/60">
        <span>{LIKERT_LABELS[1]}</span>
        <span>{LIKERT_LABELS[5]}</span>
      </div>
    </div>
  );
}

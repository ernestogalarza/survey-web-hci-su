"use client";

import type { NasaTlxDimension } from "@/data/nasaTlxDimensions";

interface NasaTlxSliderProps {
  dimension: NasaTlxDimension;
  value: number;
  onChange: (value: number) => void;
}

export function NasaTlxSlider({ dimension, value, onChange }: NasaTlxSliderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-[#2c3e50]">{dimension.label}</h2>
        <p className="mt-1 text-sm text-[#2c3e50]/70">{dimension.question}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/70">
            Your rating
          </span>
          <span className="rounded-full bg-[#3498db] px-3 py-1 text-sm font-bold text-white">
            {value}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={21}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="nasa-slider w-full"
        />
        <div className="flex justify-between text-xs text-[#2c3e50]/60">
          <span>{dimension.lowLabel}</span>
          <span>{dimension.midLabel}</span>
          <span>{dimension.highLabel}</span>
        </div>
      </div>
    </div>
  );
}

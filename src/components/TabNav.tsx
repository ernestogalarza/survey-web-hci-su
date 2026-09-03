"use client";

import type { SectionMeta } from "@/lib/steps";

interface TabNavProps {
  sections: SectionMeta[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function TabNav({ sections, activeIndex, onSelect }: TabNavProps) {
  return (
    <nav className="flex overflow-x-auto bg-[#2c3e50]" aria-label="Survey sections">
      {sections.map((section, index) => (
        <button
          key={section.key}
          type="button"
          onClick={() => onSelect(index)}
          className={`min-w-max flex-1 whitespace-nowrap px-4 py-3.5 text-sm font-semibold transition-colors ${
            index === activeIndex
              ? "bg-[#3498db] text-white"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          {section.tabLabel}
        </button>
      ))}
    </nav>
  );
}

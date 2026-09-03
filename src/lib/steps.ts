export type SectionKey =
  | "postTestA"
  | "postTestB"
  | "nasaTlxA"
  | "nasaTlxB"
  | "susA"
  | "susB"
  | "qualitative";

export interface SectionMeta {
  key: SectionKey;
  tabLabel: string;
  count: number;
}

// Post-Test counts include one extra step for the per-condition summary
// screen shown after the 12th vocabulary question (localIndex 12).
export const SECTIONS: SectionMeta[] = [
  { key: "postTestA", tabLabel: "Post-Test A", count: 13 },
  { key: "postTestB", tabLabel: "Post-Test B", count: 13 },
  { key: "nasaTlxA", tabLabel: "NASA-TLX A", count: 6 },
  { key: "nasaTlxB", tabLabel: "NASA-TLX B", count: 6 },
  { key: "susA", tabLabel: "SUS A", count: 10 },
  { key: "susB", tabLabel: "SUS B", count: 10 },
  { key: "qualitative", tabLabel: "Qualitative", count: 4 },
];

export const TOTAL_STEPS = SECTIONS.reduce((sum, s) => sum + s.count, 0);

export interface StepLocation {
  section: SectionMeta;
  sectionIndex: number;
  localIndex: number;
}

export function sectionForStep(globalIndex: number): StepLocation {
  let remaining = globalIndex;
  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    if (remaining < section.count) {
      return { section, sectionIndex: i, localIndex: remaining };
    }
    remaining -= section.count;
  }
  const lastIndex = SECTIONS.length - 1;
  const last = SECTIONS[lastIndex];
  return { section: last, sectionIndex: lastIndex, localIndex: last.count - 1 };
}

export function firstStepOfSection(sectionIndex: number): number {
  let sum = 0;
  for (let i = 0; i < sectionIndex; i++) sum += SECTIONS[i].count;
  return sum;
}

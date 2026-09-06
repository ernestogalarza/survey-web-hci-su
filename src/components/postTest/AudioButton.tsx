"use client";

import { useState } from "react";
import { speakSpanish } from "@/lib/audio";

interface AudioButtonProps {
  text: string;
  enabled: boolean;
}

export function AudioButton({ text, enabled }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    if (isPlaying) return;
    setIsPlaying(true);
    speakSpanish(text, () => setIsPlaying(false));
  }

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPlaying}
      className="inline-flex items-center gap-2 rounded-lg bg-[#ecf7ff] px-4 py-2.5 text-sm font-semibold text-[#2980b9] transition-colors hover:enabled:bg-[#3498db] hover:enabled:text-white disabled:opacity-70"
    >
      {isPlaying ? "🔊 Playing…" : "🔊 Listen to Word"}
    </button>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import type { VocabWord } from "@/types/survey";

interface VocabImageProps {
  word: VocabWord;
  size?: "lg" | "sm";
}

const SIZE = {
  lg: { px: 192, emoji: "text-7xl", img: "rounded-xl bg-white object-contain" },
  sm: { px: 32, emoji: "text-xl", img: "rounded bg-white object-contain" },
};

/**
 * Shows the pre-fetched stock photo for a word (see
 * scripts/generate-images.mjs); falls back to the emoji if the image is
 * missing or fails to load.
 */
export function VocabImage({ word, size = "lg" }: VocabImageProps) {
  const [failed, setFailed] = useState(false);
  const { px, emoji, img } = SIZE[size];

  if (failed) {
    return (
      <span className={emoji} aria-hidden>
        {word.emoji}
      </span>
    );
  }

  return (
    <Image
      src={`/images/${word.id}.jpg`}
      alt={word.english}
      width={px}
      height={px}
      onError={() => setFailed(true)}
      className={img}
      style={{ width: px, height: px }}
    />
  );
}

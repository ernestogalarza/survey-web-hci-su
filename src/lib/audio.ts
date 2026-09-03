/**
 * Turns a Spanish word into the filename used for its pre-rendered audio,
 * e.g. "oso de peluche" -> "oso-de-peluche". Must match the slugify logic
 * in scripts/generate-audio.mjs.
 */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function speakWithBrowserTts(text: string, onPlaybackEnd: () => void): void {
  if (!window.speechSynthesis) {
    window.setTimeout(onPlaybackEnd, 2000);
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es";
    utterance.rate = 0.7;
    utterance.onend = onPlaybackEnd;
    utterance.onerror = onPlaybackEnd;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    window.setTimeout(onPlaybackEnd, 2000);
  }
}

/**
 * Plays Spanish pronunciation for `text`. Prefers a pre-rendered recording
 * from Google Cloud Text-to-Speech (see scripts/generate-audio.mjs) for
 * consistent, natural-sounding audio; falls back to the browser's Web
 * Speech API if the recording is missing or fails to play.
 */
export function speakSpanish(
  text: string,
  onPlaybackEnd: () => void,
): void {
  if (typeof window === "undefined") return;

  const audio = new Audio(`/audio/${slugify(text)}.mp3`);
  audio.onended = onPlaybackEnd;
  audio.onerror = () => speakWithBrowserTts(text, onPlaybackEnd);
  audio.play().catch(() => speakWithBrowserTts(text, onPlaybackEnd));
}

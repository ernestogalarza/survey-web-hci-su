// One-off script: pre-renders every vocabulary word to /public/audio/*.mp3
// using Google Cloud Text-to-Speech (Neural2 voice), so playback in the app
// never depends on the browser's built-in speech engine.
//
// Usage: GOOGLE_TTS_API_KEY=xxx node scripts/generate-audio.mjs

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "audio");
const VOICE_NAME = "es-US-Neural2-A";

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function loadVocabulary() {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(path.join(__dirname, "..", "src", "data", "vocabulary.ts"), "utf8"),
  );
  const words = [...source.matchAll(/spanish:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(words)];
}

async function synthesize(apiKey, text) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "es-US", name: VOICE_NAME },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`TTS request failed for "${text}": ${res.status} ${await res.text()}`);
  }

  const { audioContent } = await res.json();
  return Buffer.from(audioContent, "base64");
}

async function main() {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_TTS_API_KEY environment variable.");
    process.exit(1);
  }

  const words = await loadVocabulary();
  await mkdir(OUT_DIR, { recursive: true });

  for (const word of words) {
    const filePath = path.join(OUT_DIR, `${slugify(word)}.mp3`);
    process.stdout.write(`Generating ${word}... `);
    const audio = await synthesize(apiKey, word);
    await writeFile(filePath, audio);
    console.log("done");
  }

  console.log(`\nGenerated ${words.length} audio files in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

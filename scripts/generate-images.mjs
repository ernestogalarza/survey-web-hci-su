// One-off script: pre-renders a stock photo for every vocabulary word to
// /public/images/<id>.jpg using the Pexels API, replacing the emoji
// placeholders with real images.
//
// Usage: PEXELS_API_KEY=xxx node scripts/generate-images.mjs

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images");

async function loadVocabulary() {
  const source = await readFile(
    path.join(__dirname, "..", "src", "data", "vocabulary.ts"),
    "utf8",
  );
  const ids = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  const englishWords = [...source.matchAll(/english:\s*"([^"]+)"/g)].map((m) => m[1]);
  return ids.map((id, i) => ({ id, english: englishWords[i] }));
}

async function fetchImageUrl(apiKey, query) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
    { headers: { Authorization: apiKey } },
  );

  if (!res.ok) {
    throw new Error(`Pexels search failed for "${query}": ${res.status} ${await res.text()}`);
  }

  const { photos } = await res.json();
  if (!photos?.length) {
    throw new Error(`No Pexels results for "${query}"`);
  }
  return photos[0].src.medium;
}

async function main() {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Missing PEXELS_API_KEY environment variable.");
    process.exit(1);
  }

  const words = await loadVocabulary();
  await mkdir(OUT_DIR, { recursive: true });

  for (const { id, english } of words) {
    process.stdout.write(`Fetching ${english} (${id})... `);
    const imageUrl = await fetchImageUrl(apiKey, english);
    const imageRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    await writeFile(path.join(OUT_DIR, `${id}.jpg`), buffer);
    console.log("done");
  }

  console.log(`\nGenerated ${words.length} images in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

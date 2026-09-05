import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SessionData } from "@/types/survey";

/**
 * File-backed "database": a single JSON file on disk under `data/`, so
 * collected responses survive server restarts (unlike an in-memory array).
 * Fine for a single researcher running this locally; not meant for
 * concurrent multi-instance deployments.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "sessions.json");

export interface StoredSession {
  session: SessionData;
  currentStep: number;
}

async function readSessions(): Promise<StoredSession[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredSession[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeSessions(sessions: StoredSession[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(sessions, null, 2));
}

/**
 * GET /api/sessions          -> every stored record (for the researcher).
 * GET /api/sessions?participantId=P001 -> that participant's saved record
 * (or null), used to resume their progress when they re-enter their ID.
 */
export async function GET(request: Request) {
  const participantId = new URL(request.url).searchParams.get("participantId");
  const sessions = await readSessions();

  if (participantId) {
    const found = sessions.find((s) => s.session.participantId === participantId) ?? null;
    return Response.json(found);
  }
  return Response.json(sessions);
}

/**
 * Upserts by participantId — one saved record per participant, continuously
 * overwritten as their session progresses, so switching away and back
 * always finds their latest state.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as StoredSession;
  const sessions = await readSessions();

  const existingIndex = sessions.findIndex(
    (s) => s.session.participantId === body.session.participantId,
  );
  if (existingIndex >= 0) {
    sessions[existingIndex] = body;
  } else {
    sessions.push(body);
  }

  await writeSessions(sessions);
  return Response.json({ ok: true, count: sessions.length });
}

/** Wipes every collected response. Separate from resetting a single participant's in-progress draft. */
export async function DELETE() {
  await writeSessions([]);
  return Response.json({ ok: true, count: 0 });
}

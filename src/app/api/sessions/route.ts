import type { SessionData } from "@/types/survey";

/**
 * In-memory "database": lives only for the lifetime of the Node process
 * running `next dev` / `next start`. Resets on every server restart and
 * is not shared across multiple server instances.
 */
const sessions: SessionData[] = [];

export async function GET() {
  return Response.json(sessions);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SessionData;

  const existingIndex = sessions.findIndex(
    (s) => s.participantId === body.participantId && s.timestamp === body.timestamp,
  );
  if (existingIndex >= 0) {
    sessions[existingIndex] = body;
  } else {
    sessions.push(body);
  }

  return Response.json({ ok: true, count: sessions.length });
}

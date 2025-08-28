import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const now = new Date().toISOString();
    return new Response(JSON.stringify({ id: `mock-${Date.now()}`, prompt, videoUrl: null, imageUrl: "https://picsum.photos/seed/hehe/1024/576", createdAt: now }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "bad request" }), { status: 400 });
  }
}

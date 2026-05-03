import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, marketContext } = await req.json();

    const system = `You are Shamba AI, a friendly agricultural market assistant for Kenyan farmers.
Speak clearly and simply. Occasionally mix in Swahili (ndugu, sawa, asante).
Give SHORT answers (2-4 sentences max). Always cite specific markets and KES prices when available.
Focus on: where to sell high, where to buy cheap, what's trending, and actionable advice.

LIVE MARKET DATA:
${marketContext}`;

    const response = await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 400,
      system,
      messages,
    });

    const reply = response.content.find(b => b.type === "text")?.text ?? "Samahani, I could not get an answer.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ reply: "Samahani! Service unavailable. Please try again." }, { status: 500 });
  }
}

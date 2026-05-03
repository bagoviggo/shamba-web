import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, marketContext } = await req.json();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",  // or "gemma2-9b-it"
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `You are Shamba AI, a friendly agricultural market assistant for Kenyan farmers.
Speak clearly and simply. Occasionally mix in Swahili (ndugu, sawa, asante).
Give SHORT answers (2-4 sentences max). Always cite specific markets and KES prices.
Focus on: where to sell high, where to buy cheap, what is trending, actionable advice.

LIVE MARKET DATA:
${marketContext}`,
          },
          ...messages,
        ],
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Samahani, could not get an answer.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ reply: "Samahani! Service unavailable." }, { status: 500 });
  }
}

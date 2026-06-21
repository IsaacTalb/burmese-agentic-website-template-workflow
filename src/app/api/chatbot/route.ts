import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const chatbotUrl = process.env.CHATBOT_API_URL;
    const chatbotKey = process.env.CHATBOT_API_KEY;

    if (!chatbotUrl) {
      return NextResponse.json({ reply: "Chatbot is not configured yet." });
    }

    const response = await fetch(`${chatbotUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(chatbotKey ? { Authorization: `Bearer ${chatbotKey}` } : {}),
      },
      body: JSON.stringify({ message, history }),
    });

    const data = await response.json();
    return NextResponse.json({ reply: data.reply ?? data.response ?? "..." });
  } catch {
    return NextResponse.json({ reply: "Unable to connect to assistant. Please try again." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = await request.json();
    const message = update.message;
    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text: string = message.text;

    const chatbotUrl = process.env.CHATBOT_API_URL;
    let reply = "မင်္ဂလာပါ! ကျွန်တော်တို့ကို ဆက်သွယ်ပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ်။";

    if (chatbotUrl) {
      const res = await fetch(`${chatbotUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: [] }),
      });
      const data = await res.json();
      reply = data.reply ?? reply;
    }

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

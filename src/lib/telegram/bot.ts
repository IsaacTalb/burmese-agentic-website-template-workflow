// Telegram notification helper
// Sends order notifications to business owner's Telegram

const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

export function formatOrderNotification(orderId: string, customerName: string, total: number): string {
  return `🛒 <b>New Order!</b>\n\nOrder ID: <code>${orderId}</code>\nCustomer: ${customerName}\nTotal: ${total.toLocaleString()} MMK\n\nCheck admin panel to verify payment.`;
}

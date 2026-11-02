export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const { name, phone, telegram, comment, items, total } = await req.json();
    if (!name?.trim() || !phone?.trim() || !Array.isArray(items) || !items.length) {
      return Response.json({ error: "Заповніть ім'я, телефон та кошик." }, { status: 400 });
    }
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return Response.json({ error: "Telegram ще не налаштований. Додайте TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID у Netlify." }, { status: 503 });

    const lines = items.map(i => `• ${i.name} × ${i.quantity} — ${i.price * i.quantity} грн`).join("\n");
    const message = `🍣 НОВЕ ЗАМОВЛЕННЯ — Sushi Mir\n\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n${telegram ? `✈️ Telegram: ${telegram}\n` : ""}\n🛍 Замовлення:\n${lines}\n\n💳 Разом: ${total} грн\n💬 Коментар: ${comment?.trim() || "Немає"}`;
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error("Telegram API error");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Не вдалося надіслати замовлення. Спробуйте ще раз." }, { status: 500 });
  }
};

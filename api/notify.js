export default async function handler(request, response) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const message = '🧍 Someone clicked the Summon Face button!';

  if (!TOKEN || !CHAT_ID) {
    return response.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const telegramURL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const res = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
    const data = await res.json();
    return response.status(200).json(data);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}

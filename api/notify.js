export default async function handler(req, res) {
  // ✅ Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle the CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];

  const message = `🧍 Someone clicked the Summon Face button!\n🌐 IP: ${ip}\n💻 UA: ${ua}`;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const telegramURL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const r = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }),
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

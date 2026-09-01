// DeepSeek 调用封装（服务端，Key 从环境变量读取，绝不暴露给前端）
export async function callDeepSeek(prompt) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('DEEPSEEK_API_KEY is not configured');
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a knowledgeable guide to the I Ching, BaZi and Chinese wisdom traditions, offering thoughtful, grounded readings in English. Present content as cultural wisdom and self-reflection, never as fatalistic prediction.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `DeepSeek error (HTTP ${res.status})`);
  }
  return json.choices?.[0]?.message?.content || '';
}

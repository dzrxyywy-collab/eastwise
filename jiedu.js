// 起卦解读接口：接收卦象数据，构造英文提示词，调用 DeepSeek
import { callDeepSeek } from '../lib/deepseek.js';

function buildPrompt(data) {
  const { question, methods, guas, comparison } = data;
  const guaLines = guas.map((g, i) => {
    return `Casting ${i + 1} (${g.method}):
Original hexagram: ${g.benGua.en} (Hexagram ${g.benGua.xu})
Changed hexagram: ${g.bianGua.en} (Hexagram ${g.bianGua.xu})
Nuclear hexagram: ${g.huGua.en} (Hexagram ${g.huGua.xu})
Moving line: line ${g.moving}
Subject trigram (Ti): ${g.ti.en} (${g.ti.wuxing})
Object trigram (Yong): ${g.yong.en} (${g.yong.wuxing})
Ti-Yong relation: ${g.relation}`;
  }).join('\n\n');
  const compareLine = guas.length > 1 ? `\n[Comparison]\n${comparison}` : '';
  return `Interpret the following I Ching casting for the user's question.

[User's question]
${question}

[Casting method(s)]
${methods.join(', ')}

[Result]
${guaLines}${compareLine}

[Guidelines]
1. Explain the original and changed hexagrams, referencing their Judgment and the moving line's text;
2. Analyze the overall tendency through the Ti-Yong (Subject-Object) Five Elements relationship;
3. Give 2-3 concrete, actionable suggestions for the user's specific question;
4. Tone: warm, insightful, grounded in cultural wisdom — not fatalistic prediction; encourage self-reflection;
5. Keep under 600 words, in 3-4 sections, in clear English.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = JSON.parse(body);

    // TODO (Step 3): verify the user's paid quota here (Stripe + a KV/database store)
    // if (!(await isPaid(userId))) { res.statusCode = 402; res.end(JSON.stringify({ error: 'Payment required' })); return; }

    const text = await callDeepSeek(buildPrompt(data));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ text }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: e.message || 'Reading failed' }));
  }
}

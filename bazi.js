// 八字解读接口：接收排盘数据，构造英文提示词，调用 DeepSeek
import { callDeepSeek } from '../lib/deepseek.js';

function buildPrompt(data) {
  const { gender, date, time, question, bazi, place, liunian } = data;
  return `Analyze the following Chinese BaZi (Four Pillars) birth chart.

[Birth info]
Gregorian date: ${date}
Time: ${time || 'unknown'}
Gender: ${gender}
Birthplace: ${place || 'unknown'}

[Four Pillars]
Year: ${bazi.yearEn} (${bazi.year})
Month: ${bazi.monthEn} (${bazi.month})
Day: ${bazi.dayEn} (${bazi.day}) — Day Master: ${bazi.dayMaster} (${bazi.dayMasterWuxing})
Hour: ${bazi.hourEn} (${bazi.hour})

[Five Elements distribution]
${Object.entries(bazi.wuxing).map(([k, v]) => `${k}: ${v}`).join(', ')}

[Recent five years (Liu Nian)]
${(liunian || []).map((l) => `${l.year} ${l.ganZhi}`).join(', ')}

[User wants to know]
${question || 'Overall life reading'}

[Guidelines]
1. Analyze the chart's balance and Day Master strength, including favorable/unfavorable elements and the influence of birthplace;
2. Cover personality, career & wealth, relationships, and health in detail — be specific and vivid with concrete examples, avoid vague clichés;
3. Go through each of the recent five years, noting key trends and cautions;
4. Give several specific, actionable suggestions;
5. Tone: balanced and objective; remind the user this is traditional cultural reference, not destiny;
6. Keep within 900-1200 words, well-structured, in clear English.`;
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

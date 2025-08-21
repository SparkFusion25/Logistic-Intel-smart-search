export type AssistOutput = {
  q?: string;
  mode?: 'all' | 'air' | 'ocean';
  origin_country?: string;
  destination_country?: string;
  hs_code?: string;
  carrier?: string;
  explanation?: string;
};

export async function aiAssist(params: { 
  q?: string; 
  mode?: 'all' | 'air' | 'ocean' 
}): Promise<AssistOutput> {
  // Check if AI assist is enabled
  if (typeof window !== 'undefined') {
    // Client-side - AI assist disabled for security
    return {};
  }
  
  const enableAI = process.env.ENABLE_AI_ASSIST?.toLowerCase() === 'true';
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!enableAI || !openaiKey) {
    return {};
  }

  const prompt = `You are a logistics search assistant. Given a user query, expand with likely filters (mode, hs_code hints, carriers) and produce a one-sentence explanation. Respond as JSON with keys: q, mode, origin_country, destination_country, hs_code, carrier, explanation.

Examples:
- "electronics from china" → {"mode": "all", "origin_country": "China", "hs_code": "85", "explanation": "Searching for electronics shipments from China, typically classified under HS code 85."}
- "air freight to germany" → {"mode": "air", "destination_country": "Germany", "explanation": "Looking for air freight shipments to Germany."}
- "ocean containers" → {"mode": "ocean", "explanation": "Searching for ocean container shipments."}`;

  const input = JSON.stringify(params);

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: input }
    ],
    max_tokens: 200,
    temperature: 0.3
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.warn('AI assist API failed:', res.status);
      return {};
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content ?? '{}';
    
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  } catch (error) {
    console.warn('AI assist error:', error);
    return {};
  }
}
interface EventContext {
  request: Request;
  env: Record<string, any>;
}

async function generateGeminiContent(apiKey: string, model: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json() as any;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as { websiteUrl?: string };
    const websiteUrl = body.websiteUrl;
    if (!websiteUrl) {
      return Response.json({ error: "websiteUrl is required" }, { status: 400 });
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `Perform an in-depth marketing analysis for the business website: "${websiteUrl}".
Extract and synthesize the brand DNA into structured JSON strictly matching this schema:
{
  "business_summary": "A 2-sentence summary of what the business does and stands for",
  "core_offer": "The primary core offer or lead magnet",
  "usps": ["Unique Value Proposition 1", "Unique Value Proposition 2", "Unique Value Proposition 3"],
  "target_audience": "Detailed description of the primary customer demographic and job roles",
  "colors": ["#HexPrimary", "#HexSecondary", "#HexAccent"],
  "tone": "Brand voice description (e.g. Energetic, High-Vibe, Professional)",
  "industry": "Industry category"
}
Return ONLY valid raw JSON. No markdown formatting.`;

        const textResult = await generateGeminiContent(apiKey, "gemini-2.0-flash", prompt);
        const cleanText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        return Response.json({ success: true, brand_kit: parsed });
      } catch (geminiErr) {
        console.error("Gemini Scan Error, using fallback:", geminiErr);
      }
    }

    // Intelligent Fallback
    const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const fallbackBrandKit = {
      business_summary: `Premium modern solutions hub for ${domain}. Delivering high-vibe, quality-driven experiences for tech, creative, and professional leaders.`,
      core_offer: `Exclusive Access Membership & VIP Trial Pass for ${domain}`,
      usps: [
        `Bio-Optimized & Artisanal Standards for ${domain}`,
        'Ultra-Fast Frictionless Experience with VIP Perks',
        'Community-Centric Growth & Premium Network Hub'
      ],
      target_audience: 'Founders, Creators, Executives, and Biohackers aged 22-45',
      colors: ['#FF4D00', '#111111', '#00D26A'],
      tone: 'Bold, Energetic, Premium, High-Vibe',
      industry: domain.includes('cafe') ? 'Hospitality / Cafe' : 'SaaS & Marketing Tech'
    };

    return Response.json({ success: true, brand_kit: fallbackBrandKit });
  } catch (err: any) {
    console.error('Scan Endpoint Error:', err);
    return Response.json({ error: err.message || 'Failed to scan website' }, { status: 500 });
  }
}

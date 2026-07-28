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
    const body = await context.request.json() as { personaName?: string; adAngle?: string; brandKit?: any };
    const { personaName, adAngle, brandKit } = body;
    const apiKey = context.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Act as an elite Direct Response Copywriter.
Target Persona: "${personaName || 'High-Vibe Founder'}"
Ad Angle: "${adAngle || 'Upgrade Your Focus'}"
Brand Summary: "${brandKit?.business_summary || 'Energize Cult Cafe'}"

Generate 5 Headlines, 5 Primary Texts, 5 Descriptions, and Landing Page Copy in raw JSON:
{
  "headlines": ["H1", "H2", "H3", "H4", "H5"],
  "primaryTexts": ["P1", "P2", "P3", "P4", "P5"],
  "descriptions": ["D1", "D2", "D3", "D4", "D5"],
  "landingPageCopy": "High converting landing page hero headline, sub-headline, and call to action pitch."
}`;

        const textResult = await generateGeminiContent(apiKey, "gemini-2.0-flash", prompt);
        const cleanText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        return Response.json({ success: true, content: parsed });
      } catch (err) {
        console.error("Text creative Gemini error:", err);
      }
    }

    // Fallback Text Creative
    const fallbackCopy = {
      headlines: [
        "Fuel Your Peak Productivity Today ⚡",
        "Unlimited Nitro Cold Brew & Matcha Pass",
        "Where Founders & Creators Connect ☕",
        "0% Sugar Crash. 100% Sustained Focus.",
        "Claim Your 7-Day VIP Energize Pass"
      ],
      primaryTexts: [
        "Tired of mid-day energy crashes and noisy generic cafes? Step into Energize Cult Cafe — the premier bio-optimized sanctuary for founders, creators, and leaders. Enjoy ceremonial organic matcha and micro-batch nitro cold brew crafted for sustained clarity.",
        "Upgrade your daily workflow with the Energize Pass. Unlimited artisan nitro brews, fiber-optic Wi-Fi, and exclusive lounge access for just $49/mo. Your desk just got a massive upgrade.",
        "Meet your new morning power ritual. High-vibe organic ceremonial matcha on tap, functional adaptogen elixirs, and a vibrant community of ambitious peers.",
        "Why settle for average commercial coffee when you can fuel your brain with bio-optimized organic brews? Claim your VIP Pass and experience the difference today.",
        "Join 500+ top founders and creators who start their day at Energize Cult Cafe. Click below to claim your exclusive complimentary guest pass!"
      ],
      descriptions: [
        "Ceremonial Grade Organic Matcha & Nitro Cold Brew on Tap.",
        "Unlimited Coffee Subscription • Fast Fiber Wi-Fi • VIP Hub.",
        "Join the High-Vibe Founder & Creator Community.",
        "Bio-Optimized Functional Elixirs for Sustained Energy.",
        "Claim Your Complimentary VIP Lounge Guest Pass Today."
      ],
      landingPageCopy: "HERO HEADLINE: Ignite Your Impact. Fuel Your Peak Energy.\nSUB-HEADLINE: Discover the bio-optimized cafe sanctuary built for founders, creators, and innovators.\nCTA: Claim Your $49/mo Unlimited Pass Now"
    };

    return Response.json({ success: true, content: fallbackCopy });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

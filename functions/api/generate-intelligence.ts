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
    const body = await context.request.json() as { brand_kit?: any };
    const brand_kit = body.brand_kit;
    const apiKey = context.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Act as Chief Growth Officer for ${brand_kit?.business_summary || 'Energize Cult Cafe'}.
Using this Brand Kit: ${JSON.stringify(brand_kit)}, generate comprehensive Business Intelligence JSON:
{
  "personas": [
    {
      "id": "p1",
      "name": "Persona Name & Archetype",
      "role": "Job Role",
      "demographics": "Age, Income, Location",
      "psychographics": "Mindset and lifestyle",
      "fears": ["Fear 1", "Fear 2"],
      "desires": ["Desire 1", "Desire 2"],
      "online_behavior": "Platforms & Podcasts",
      "keywords": {
        "google_high_intent": ["keyword 1", "keyword 2", "keyword 3"],
        "meta_interests": ["interest 1", "interest 2"],
        "linkedin_titles": ["title 1", "title 2"]
      },
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      "id": "p2",
      "name": "Persona Name 2",
      "role": "Job Role 2",
      "demographics": "Age, Income, Location",
      "psychographics": "Mindset",
      "fears": ["Fear 1", "Fear 2"],
      "desires": ["Desire 1", "Desire 2"],
      "online_behavior": "Platforms",
      "keywords": {
        "google_high_intent": ["k1", "k2"],
        "meta_interests": ["i1", "i2"],
        "linkedin_titles": ["t1", "t2"]
      },
      "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
    },
    {
      "id": "p3",
      "name": "Persona Name 3",
      "role": "Job Role 3",
      "demographics": "Age, Income",
      "psychographics": "Mindset",
      "fears": ["Fear 1"],
      "desires": ["Desire 1"],
      "online_behavior": "Platforms",
      "keywords": {
        "google_high_intent": ["k1"],
        "meta_interests": ["i1"],
        "linkedin_titles": ["t1"]
      },
      "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    }
  ],
  "ad_angles": ["Angle 1 Hook", "Angle 2 Hook", "Angle 3 Hook", "Angle 4 Hook", "Angle 5 Hook"],
  "platform_strategy": {
    "primary": "Meta + Google Ads",
    "budget_split": { "Google": 40, "Meta": 40, "LinkedIn": 20 },
    "notes": "Rationale for media budget allocation"
  },
  "content_pillars": ["Pillar 1", "Pillar 2", "Pillar 3", "Pillar 4"],
  "competitor_gap": "Analysis of what incumbents miss and how client wins market share."
}
Return raw valid JSON only.`;

        const textResult = await generateGeminiContent(apiKey, "gemini-1.5-pro", prompt);
        const cleanText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        return Response.json({ success: true, bi_engine: parsed });
      } catch (geminiErr) {
        console.error("Intelligence Gemini error, falling back:", geminiErr);
      }
    }

    // Fallback BI Engine
    const fallbackBI = {
      personas: [
        {
          id: "p1",
          name: "High-Performance Founder Alex",
          role: "Startup CEO & Tech Architect",
          demographics: "Age 28-42, Income $150k+",
          psychographics: "Focused on clean energy, zero-lag execution, networking with top 1% minds.",
          fears: ["Subpar quality", "Wasted time", "Generic coffee spots"],
          desires: ["Peak cognitive focus", "High-vibe aesthetic space", "Exclusive community"],
          online_behavior: "Twitter/X, TechCrunch, Huberman Podcasts, LinkedIn",
          keywords: {
            google_high_intent: ["best organic nitro cold brew", "executive wifi cafe", "ceremonial matcha bar"],
            meta_interests: ["Biohacking", "Venture Capital", "Specialty Coffee"],
            linkedin_titles: ["Founder", "Chief Executive Officer", "Managing Partner"]
          },
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: "p2",
          name: "Creative Strategist Maya",
          role: "Lead Designer & Content Director",
          demographics: "Age 22-35, Income $80k+",
          psychographics: "Passionate about aesthetic design, organic matcha lattes, viral creator hubs.",
          fears: ["Uninspired workspaces", "Boring commercial brands"],
          desires: ["Photogenic spaces", "Organic artisanal blends", "Creator meetups"],
          online_behavior: "Instagram Reels, TikTok, Pinterest, Behance",
          keywords: {
            google_high_intent: ["aesthetic matcha bar near me", "dog friendly creator lounge"],
            meta_interests: ["Aesthetic Interiors", "Ceremonial Matcha", "Content Strategy"],
            linkedin_titles: ["Creative Director", "Brand Strategist", "UX Designer"]
          },
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: "p3",
          name: "Corporate Growth Exec David",
          role: "VP of Enterprise Sales",
          demographics: "Age 35-52, Income $220k+",
          psychographics: "Seeks frictionless VIP speed lane service and reserved meeting booths for dealmaking.",
          fears: ["Slow service during key client meetings"],
          desires: ["VIP reservation priority", "Impeccable roast consistency"],
          online_behavior: "LinkedIn, WSJ, Bloomberg, Harvard Business Review",
          keywords: {
            google_high_intent: ["executive meeting coffee lounge", "corporate event coffee catering"],
            meta_interests: ["Executive Leadership", "Corporate Strategy"],
            linkedin_titles: ["VP Sales", "Managing Director", "Chief Commercial Officer"]
          },
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
        }
      ],
      ad_angles: [
        "Fuel Your Next Breakthrough: 0% Crash Ceremonial Nitro Matcha.",
        "The Unofficial Headquarters for High-Impact Founders & Creators.",
        "Upgrade Your Morning Focus Ritual with $49/mo Unlimited Energize Pass.",
        "Where High Performance Meets High-Vibe Artisan Coffee.",
        "Skip the Line: Experience the VIP Bio-Optimized Coffee Lounge."
      ],
      platform_strategy: {
        primary: "Meta (Instagram Reels/Stories) + Google Search Local Intent",
        budget_split: { Google: 40, Meta: 40, LinkedIn: 20 },
        notes: "Meta drives immediate visual craving & subscription signups. Google captures local high intent."
      },
      content_pillars: [
        "Behind the Bio-Hack: Organic Sourcing",
        "Founder & Creator Spotlights",
        "Specialty Cold Brew & Matcha Masterclasses",
        "VIP Lounge Drops & Community Events"
      ],
      competitor_gap: "Standard cafes are noisy and generic. ECCI delivers a high-vibe bio-optimized hub with custom subscription passes and creator community events."
    };

    return Response.json({ success: true, bi_engine: fallbackBI });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

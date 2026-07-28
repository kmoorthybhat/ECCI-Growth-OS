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
    const body = await context.request.json() as { adAngle?: string; personaName?: string };
    const { adAngle, personaName } = body;
    const apiKey = context.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Generate a viral 30-second video script for TikTok and Meta Reels targeting "${personaName || 'Tech Founders'}".
Ad Angle: "${adAngle || 'Bio-Optimized Cold Brew'}"
Return JSON:
{
  "videoScript": {
    "hook": "0-3s visual hook text",
    "body": "3-22s core value pitch script",
    "cta": "22-30s strong call to action"
  },
  "voiceoverText": "Full clean voiceover paragraph",
  "storyboardFrames": ["Frame 1 description", "Frame 2 description", "Frame 3 description"],
  "captions": "Trending subtitle overlay string"
}`;

        const textResult = await generateGeminiContent(apiKey, "gemini-2.0-flash", prompt);
        const cleanText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        return Response.json({ success: true, video: parsed });
      } catch (err) {
        console.error("Video script error:", err);
      }
    }

    // Fallback Video Script
    const fallbackVideo = {
      videoScript: {
        hook: "[0-3s] [Fast Zoom on Nitro Cold Brew Pouring] 'Stop drinking basic coffee that ruins your focus.'",
        body: "[3-22s] [Cut to Founder typing at sleek oak table with Matcha] 'If you are a founder or creator, mid-day energy crashes are costing you thousands. Energize Cult Cafe crafts ceremonial grade matcha and bio-optimized nitro brew with 0% sugar crash.'",
        cta: "[22-30s] [On-Screen Graphic with $49 Pass] 'Tap below to claim your $49/mo Unlimited Pass before spots fill up!'"
      },
      voiceoverText: "Stop drinking basic coffee that ruins your focus. If you're building something great, mid-day crashes cost you hours. Energize Cult Cafe brews pure ceremonial matcha and nitro elixir on tap. Tap below to claim your VIP Pass today.",
      storyboardFrames: [
        "Frame 1: Macro close-up of creamy micro-foam nitro cascade with golden ambient light.",
        "Frame 2: High-energy founder laughing with team in aesthetic velvet lounge booth.",
        "Frame 3: Sleek dark glass mobile screen showing Energize VIP Pass active badge."
      ],
      captions: "⚡ 0% Crash. 100% Sustained Focus. Claim Your VIP Energize Pass Now!"
    };

    return Response.json({ success: true, video: fallbackVideo });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

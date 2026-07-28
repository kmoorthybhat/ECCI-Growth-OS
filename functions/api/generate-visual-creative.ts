interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as { title?: string; primaryColor?: string };
    const { title, primaryColor = "#FF4D00" } = body;

    const visuals = [
      {
        ratio: "1:1 Square (Feed)",
        url: `https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80`,
        complianceScore: 98
      },
      {
        ratio: "4:5 Vertical (Instagram / Meta)",
        url: `https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80`,
        complianceScore: 96
      },
      {
        ratio: "9:16 Full Screen (Stories & Reels)",
        url: `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80`,
        complianceScore: 99
      }
    ];

    return Response.json({ success: true, visuals });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

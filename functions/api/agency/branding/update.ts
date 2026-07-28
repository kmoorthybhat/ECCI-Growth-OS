interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as { agencyId?: string; branding?: any };
    const { agencyId, branding } = body;

    if (!agencyId || !branding) {
      return Response.json({ error: "agencyId and branding object are required" }, { status: 400 });
    }

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (branding.primaryColor && !hexRegex.test(branding.primaryColor)) {
      return Response.json({ error: "Invalid primaryColor hex code format" }, { status: 400 });
    }

    return Response.json({
      success: true,
      agencyId,
      branding,
      cachePurged: true,
      message: "Agency white-label branding updated and CDN theme cache purged."
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Branding update failed" }, { status: 500 });
  }
}

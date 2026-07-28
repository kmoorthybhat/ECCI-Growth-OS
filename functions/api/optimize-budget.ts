interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as { campaigns?: any[] };
    const campaigns = body.campaigns || [];

    const suggestions = campaigns.map((c: any) => {
      let actionType = 'increase';
      let suggestedBudget = Math.round((c.dailyBudget || 100) * 1.25);
      let reason = `High CTR of ${c.ctr || 3.2}% and low CPL ($${c.cpl || 15}). AI recommends expanding budget by +25% to capture additional demand.`;

      if ((c.ctr || 0) < 2.0 && (c.cpl || 0) > 30) {
        actionType = 'decrease';
        suggestedBudget = Math.round((c.dailyBudget || 100) * 0.8);
        reason = `CTR (${c.ctr}%) is below platform benchmark. AI suggests trimming daily budget to lower CPL.`;
      }

      return {
        id: `sug_${c.id || Math.random().toString(36).substring(2, 7)}`,
        campaignId: c.id,
        campaignName: c.title || c.campaignName || "Campaign",
        platform: c.platform || "Meta",
        currentBudget: c.dailyBudget || 100,
        suggestedBudget,
        reason,
        actionType,
        applied: false
      };
    });

    return Response.json({ success: true, suggestions });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

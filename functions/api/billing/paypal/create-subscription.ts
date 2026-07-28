interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as {
      clientId?: string;
      tier?: string;
      paymentType?: string;
    };
    const { clientId, tier, paymentType } = body;

    if (!clientId || !tier) {
      return Response.json({ error: "clientId and tier are required" }, { status: 400 });
    }

    const defaultRates: Record<string, { onboardingFee: number; monthlyRetainer: number }> = {
      Starter: { onboardingFee: 499, monthlyRetainer: 999 },
      Growth: { onboardingFee: 999, monthlyRetainer: 1999 },
      Scale: { onboardingFee: 1999, monthlyRetainer: 3999 },
      Enterprise: { onboardingFee: 4999, monthlyRetainer: 8999 },
    };

    const tierRate = defaultRates[tier] || defaultRates.Starter;
    const amount = paymentType === "onboarding" ? tierRate.onboardingFee : tierRate.monthlyRetainer;
    const subscriptionId = `SUB-PAYPAL-${tier.toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const orderId = `ORDER-PP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return Response.json({
      success: true,
      subscriptionId,
      orderId,
      amount,
      currency: "USD",
      approvalUrl: `https://www.paypal.com/checkoutnow?token=${orderId}`,
      message: `PayPal ${paymentType} checkout order initialized for ${tier} tier.`
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to create PayPal subscription" }, { status: 500 });
  }
}

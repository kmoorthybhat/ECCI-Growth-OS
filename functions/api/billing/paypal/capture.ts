interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as {
      clientId?: string;
      userId?: string;
      paymentId?: string;
      orderId?: string;
      tier?: string;
      paymentType?: string;
      amount?: number;
    };
    const { clientId, userId, paymentId, orderId, tier, paymentType, amount } = body;

    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId,
      userId: userId || 'user_innovator_1',
      provider: 'paypal',
      type: paymentType || 'monthly_retainer',
      amount: amount || 1999,
      currency: 'USD',
      status: 'COMPLETED',
      paymentId: paymentId || `PAYID-PP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      orderId: orderId || `ORD-PP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    return Response.json({
      success: true,
      transaction,
      updatedClientState: {
        tier,
        onboardingFeePaid: paymentType === 'onboarding' ? true : undefined,
        retainerStatus: 'active',
        paymentProvider: 'paypal',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to capture PayPal payment" }, { status: 500 });
  }
}

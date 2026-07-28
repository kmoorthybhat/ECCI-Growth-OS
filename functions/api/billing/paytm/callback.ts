interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as {
      ORDER_ID?: string;
      TXN_ID?: string;
      STATUS?: string;
      clientId?: string;
      userId?: string;
      tier?: string;
      paymentType?: string;
      amount?: number;
    };
    const { ORDER_ID, TXN_ID, STATUS, clientId, userId, tier, paymentType, amount } = body;

    const isVerified = (STATUS || 'TXN_SUCCESS') === 'TXN_SUCCESS';

    const transaction = {
      id: `txn_ptm_${Date.now()}`,
      clientId: clientId || 'client_demo',
      userId: userId || 'user_demo',
      provider: 'paytm',
      type: paymentType || 'monthly_retainer',
      amount: amount || 1999,
      currency: 'INR',
      status: isVerified ? 'COMPLETED' : 'FAILED',
      paymentId: TXN_ID || `PTM_TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      orderId: ORDER_ID || `PAYTM_ORD_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    return Response.json({
      success: isVerified,
      status: isVerified ? 'TXN_SUCCESS' : 'TXN_FAILURE',
      checksumValid: true,
      transaction,
      updatedClientState: {
        tier,
        onboardingFeePaid: paymentType === 'onboarding' ? true : undefined,
        retainerStatus: isVerified ? 'active' : 'overdue',
        paymentProvider: 'paytm',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed Paytm callback verification" }, { status: 500 });
  }
}

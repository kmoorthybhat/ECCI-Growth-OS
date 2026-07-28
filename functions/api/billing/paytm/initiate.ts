interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestPost(context: EventContext) {
  try {
    const body = await context.request.json() as {
      clientId?: string;
      tier?: string;
      amount?: number;
      paymentType?: string;
    };
    const { clientId = 'client_demo', tier, amount, paymentType } = body;
    const orderId = `PAYTM_ORD_${clientId.substring(0, 5)}_${Date.now()}`;
    const mockMid = context.env.PAYTM_MID || "ECCI_PAYTM_MID_PROD";

    // Simulate Paytm Checksum Hash
    const checksum = `checksum_hash_${Math.random().toString(36).substring(2, 16)}`;

    const paytmParams = {
      MID: mockMid,
      ORDER_ID: orderId,
      TXN_AMOUNT: (amount || 1999).toString(),
      CURRENCY: "INR",
      CHANNEL_ID: "WEB",
      INDUSTRY_TYPE_ID: "Retail",
      WEBSITE: "DEFAULT",
      CALLBACK_URL: "https://ecci-growth.app/api/billing/paytm/callback",
      CHECKSUMHASH: checksum
    };

    return Response.json({
      success: true,
      orderId,
      paytmParams,
      txnToken: `txnToken_${Math.random().toString(36).substring(2, 12)}`,
      paymentLink: `https://securegw.paytm.in/link/payment/ECCI_GROWTH_${orderId}`
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to initiate Paytm payment" }, { status: 500 });
  }
}

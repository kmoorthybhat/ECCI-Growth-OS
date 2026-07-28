interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestGet(context: EventContext) {
  try {
    const url = new URL(context.request.url);
    const host = url.searchParams.get("host") || context.request.headers.get("host") || "app.eccigrowth.com";

    if (host.includes("eccigrowth.com") || host.includes("localhost") || host.includes("run.app") || host.includes("pages.dev")) {
      return Response.json({
        isCustomDomain: false,
        agencyName: "ECCI Growth OS",
        branding: {
          companyName: "ECCI Growth OS",
          primaryColor: "#FF4D00",
          accentColor: "#00D26A",
          logoUrl: "/logo.png",
          faviconUrl: "/favicon.ico",
          supportEmail: "support@eccigrowth.com"
        }
      });
    }

    // Custom domain match simulation
    return Response.json({
      isCustomDomain: true,
      domainHost: host,
      agencyId: "agency_partner_apex",
      agencyName: "Apex Growth Marketing",
      branding: {
        companyName: "Apex Growth Marketing",
        primaryColor: "#7C3AED",
        accentColor: "#10B981",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
        faviconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80",
        supportEmail: "hello@apexgrowth.com",
        customCss: "/* Apex Custom Theme Styles */"
      }
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to resolve theme" }, { status: 500 });
  }
}

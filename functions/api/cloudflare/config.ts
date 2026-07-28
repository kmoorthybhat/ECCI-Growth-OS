interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestGet(context: EventContext) {
  return Response.json({
    projectName: "ecci-growth-os",
    frameworkPreset: "Vite + React",
    buildCommand: "npm run build",
    buildOutputDirectory: "dist",
    nodeVersion: "20.10.0",
    rootDirectory: "/",
    deploymentUrl: "https://ecci-growth-os.pages.dev",
    compatibilityDate: "2024-01-01",
    compatibilityFlags: ["nodejs_compat"],
    kvNamespaces: [
      { binding: "CACHE_KV", id: "<YOUR_CLOUDFLARE_KV_NAMESPACE_ID>" },
      { binding: "SESSION_KV", id: "<YOUR_SESSION_KV_NAMESPACE_ID>" }
    ]
  });
}

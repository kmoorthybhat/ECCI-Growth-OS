export class AIAgentSessionManager implements DurableObject {
  constructor(public state: DurableObjectState, public env: Env) {}

  async fetch(request: Request): Promise<Response> {
    return new Response("AI agent session manager", { status: 200 });
  }
}

export class WorkflowEngine implements DurableObject {
  constructor(public state: DurableObjectState, public env: Env) {}

  async fetch(request: Request): Promise<Response> {
    return new Response("Workflow engine", { status: 200 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const assetRequest = new Request(new URL("/index.html", request.url).toString(), request);
      return env.ASSETS.fetch(assetRequest);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

type Env = {
  ASSETS: Fetcher;
};

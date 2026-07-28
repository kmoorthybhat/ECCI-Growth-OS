interface EventContext {
  request: Request;
  env: Record<string, any>;
}

export async function onRequestGet(context: EventContext) {
  return Response.json({ status: "ok", service: "ECCI Growth OS v1.0 API Engine" });
}

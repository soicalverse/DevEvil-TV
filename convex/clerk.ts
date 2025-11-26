
import { httpEndpoint } from "convex/server";
import { Webhook } from "svix";

export const clerk = httpEndpoint(async (req) => {
  console.log("CLERK WEBHOOK FINALLY HIT – SUCCESS!");

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  try {
    new Webhook(process.env.CLERK_WEBHOOK_SECRET!).verify(payload, headers);
    console.log("Signature OK");
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Bad signature");
    return new Response("Unauthorized", { status: 401 });
  }
});

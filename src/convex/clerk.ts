import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Invalid request", { status: 400 });
    }
    switch (event.type) {
      case "user.created":
        await ctx.runMutation(internal.myFunctions.createUser, {
          clerkId: event.data.id,
          name: `${event.data.first_name} ${event.data.last_name}`,
        });
        break;
      case "user.updated":
        await ctx.runMutation(internal.myFunctions.updateUser, {
          clerkId: event.data.id,
          name: `${event.data.first_name} ${event.data.last_name}`,
        });
        break;
      case "user.deleted":
        await ctx.runMutation(internal.myFunctions.deleteUser, {
          clerkId: event.data.id as string,
        });
        break;
    }
    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | undefined> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return;
  }
  return evt;
}

export default http;

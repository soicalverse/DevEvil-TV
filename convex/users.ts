
import { mutation } from "./_generated/server";

export const updateOrCreateUser = mutation(
  async (ctx, { clerkUser }: { clerkUser: any }) => {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUser.id))
      .unique();

    if (userRecord === null) {
      await ctx.db.insert("users", {
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses.length > 0 ? clerkUser.email_addresses[0].email_address : undefined,
        username: clerkUser.username ?? undefined,
        firstName: clerkUser.first_name ?? undefined,
        lastName: clerkUser.last_name ?? undefined,
        imageUrl: clerkUser.image_url ?? undefined,
      });
    } else {
      await ctx.db.patch(userRecord._id, {
        email: clerkUser.email_addresses.length > 0 ? clerkUser.email_addresses[0].email_address : undefined,
        username: clerkUser.username ?? undefined,
        firstName: clerkUser.first_name ?? undefined,
        lastName: clerkUser.last_name ?? undefined,
        imageUrl: clerkUser.image_url ?? undefined,
      });
    }
  }
);

export const deleteUser = mutation(
  async (ctx, { clerkId }: { clerkId: string }) => {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (userRecord === null) {
      console.warn("can't delete user, does not exist in db", clerkId);
      return;
    }

    await ctx.db.delete(userRecord._id);
  }
);

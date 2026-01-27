import { cache } from "react";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";
import { getDb } from "./index";
import { users } from "./schema";

/**
 * Ensures the authenticated user exists in the database.
 * Creates the user if they don't exist (just-in-time provisioning).
 * This allows the app to work without webhooks configured.
 *
 * Wrapped with React cache() to deduplicate calls within the same request.
 *
 * @returns The user record, or null if not authenticated
 */
export const ensureUser = cache(async function ensureUser() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    return null;
  }

  // Check if user already exists
  const existingUser = await getDb().query.users.findFirst({
    where: eq(users.clerkId, authUser.id),
    with: { subscription: true },
  });

  if (existingUser) {
    return existingUser;
  }

  // Create user if they don't exist
  const [newUser] = await getDb()
    .insert(users)
    .values({
      clerkId: authUser.id,
      email: authUser.email,
      name: authUser.name,
      imageUrl: authUser.imageUrl,
    })
    .returning();

  return { ...newUser, subscription: null };
});

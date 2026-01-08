/**
 * Clerk Auth Adapter
 *
 * Implements the auth abstraction layer using Clerk.
 * To switch to a different provider, create a new adapter file
 * and update the re-export in ../index.ts
 */

import { currentUser, auth } from "@clerk/nextjs/server";
import type { AuthAdapter, AuthUser } from "../types";

/**
 * Get the currently authenticated user from Clerk
 */
async function getCurrentUser(): Promise<AuthUser | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return null;
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  return {
    id: clerkUser.id,
    email,
    name,
    imageUrl: clerkUser.imageUrl,
  };
}

/**
 * Get just the user ID from Clerk (lightweight check)
 */
async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export const clerkAdapter: AuthAdapter = {
  getCurrentUser,
  getUserId,
};

/**
 * Column name used in the database to store the auth provider's user ID.
 * When switching providers, you may need to migrate this column.
 */
export const AUTH_ID_COLUMN = "clerkId" as const;

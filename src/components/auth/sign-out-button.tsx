"use client";

/**
 * Sign Out Button Component
 *
 * A wrapper around the auth provider's sign-out functionality.
 * To switch providers, update this component to use the new provider's sign-out.
 *
 * Current provider: Clerk
 */

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import type { SignOutButtonProps } from "@/lib/auth/types";

export function SignOutButton({ children }: SignOutButtonProps) {
  return <ClerkSignOutButton>{children}</ClerkSignOutButton>;
}

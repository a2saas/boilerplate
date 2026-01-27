/**
 * Auth Abstraction Layer
 *
 * This module provides a unified interface for authentication.
 * To swap providers, change the adapter import below.
 *
 * Current provider: Clerk
 *
 * To switch to a different provider:
 * 1. Create a new adapter in ./adapters/ (e.g., authjs.ts)
 * 2. Update the import below to use the new adapter
 * 3. Update the component re-exports if needed
 * 4. Run database migration if the auth ID column name changes
 */

// Server-side adapter
export { clerkAdapter as authAdapter, AUTH_ID_COLUMN } from "./adapters/clerk";

// Types
export type {
  AuthUser,
  AuthAdapter,
  AuthUIConfig,
  AuthProviderProps,
  SignOutButtonProps,
} from "./types";

// Re-export convenience functions
import { clerkAdapter } from "./adapters/clerk";

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = clerkAdapter.getCurrentUser;

/**
 * Get the current user's ID (lightweight check)
 */
export const getUserId = clerkAdapter.getUserId;

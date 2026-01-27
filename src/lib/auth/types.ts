/**
 * Auth Abstraction Layer - Types
 *
 * This module defines the interface for authentication providers.
 * To swap auth providers (e.g., Clerk → Auth.js), implement a new adapter
 * that satisfies these interfaces.
 */

/**
 * Authenticated user from the auth provider (not the database user)
 */
export interface AuthUser {
  /** Unique ID from the auth provider */
  id: string;
  /** Primary email address */
  email: string;
  /** Display name (may be null) */
  name: string | null;
  /** Profile image URL (may be null) */
  imageUrl: string | null;
}

/**
 * Server-side auth adapter interface
 */
export interface AuthAdapter {
  /**
   * Get the currently authenticated user from the request context.
   * Returns null if not authenticated.
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Get just the user ID without fetching full user data.
   * Useful for middleware/quick checks.
   */
  getUserId(): Promise<string | null>;
}

/**
 * Configuration for the auth provider's UI components
 */
export interface AuthUIConfig {
  /** URL to redirect to after sign-in */
  afterSignInUrl: string;
  /** URL to redirect to after sign-up */
  afterSignUpUrl: string;
  /** URL to redirect to after sign-out */
  afterSignOutUrl: string;
}

/**
 * Props for the AuthProvider component
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Props for the SignOutButton component
 */
export interface SignOutButtonProps {
  children: React.ReactNode;
}

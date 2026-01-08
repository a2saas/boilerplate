"use client";

/**
 * Auth Provider Component
 *
 * Wraps the application with the auth provider's context.
 * To switch providers, update this component to use the new provider.
 *
 * Current provider: Clerk
 */

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import type { AuthProviderProps } from "@/lib/auth/types";

function ClerkProviderWithTheme({ children }: AuthProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <ClerkProviderWithTheme>{children}</ClerkProviderWithTheme>;
}

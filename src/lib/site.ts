/**
 * Site Configuration
 *
 * This is the single source of truth for all app branding and identity.
 * To rebrand this app, update the values below and all UI will reflect the changes.
 */
export const siteConfig = {
  // Core identity
  name: "A2SaaS",
  tagline: "The SaaS Stack Architected for AI",
  description:
    "A production-ready Next.js boilerplate with type-safe patterns, swappable providers, and context-first architecture",

  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  github: "https://github.com/a2saas/boilerplate",

  // Email configuration
  email: {
    from: process.env.RESEND_FROM_EMAIL ?? "A2SaaS <hello@example.com>",
    support: "support@example.com",
  },

  // Social/external links (add as needed)
  links: {
    twitter: "",
    discord: "",
  },

  // Copyright
  copyright: `© ${new Date().getFullYear()} A2SaaS. All rights reserved.`,
} as const;

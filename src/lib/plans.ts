/**
 * Subscription plan definitions.
 * Keep this in sync with your Stripe products/prices.
 */

export type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  priceId: string;
  features: string[];
  highlighted: boolean;
};

export const plans: Plan[] = [
  {
    id: "boilerplate",
    name: "Boilerplate",
    price: "Free",
    period: "",
    description: "The complete SaaS foundation",
    priceId: "",
    features: [
      "Full source code",
      "Auth, payments, DB, email",
      "CLAUDE.md included",
      "MIT License",
    ],
    highlighted: true,
  },
  {
    id: "insights",
    name: "Insights & Automation",
    price: "Coming Soon",
    period: "",
    description: "AI-powered dashboard for growing your SaaS",
    priceId: "",
    features: [
      "SaaS metrics dashboard (MRR, churn, LTV)",
      "AI insights and recommendations",
      "Automated workflows (trial, churn, recovery)",
      "Marketing and growth assistants",
    ],
    highlighted: false,
  },
];

/**
 * Get a plan by its Stripe price ID.
 */
export function getPlanByPriceId(priceId: string): Plan | undefined {
  return plans.find((plan) => plan.priceId === priceId);
}

/**
 * Get a plan name by its Stripe price ID.
 * Returns "Unknown Plan" if not found.
 */
export function getPlanName(priceId: string | null | undefined): string {
  if (!priceId) return "Free";
  return getPlanByPriceId(priceId)?.name ?? "Unknown Plan";
}

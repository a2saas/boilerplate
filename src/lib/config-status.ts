export type ConfigStatus = {
  database: boolean;
  clerk: boolean;
  clerkWebhook: boolean;
  stripe: boolean;
  stripeWebhook: boolean;
  resend: boolean;
  clerkPublishable: boolean;
  appUrl: boolean;
};

export function getConfigStatus(): ConfigStatus {
  return {
    database: !!process.env.DATABASE_URL,
    clerk: !!process.env.CLERK_SECRET_KEY,
    clerkWebhook: !!process.env.CLERK_WEBHOOK_SECRET,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    stripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
    resend: !!process.env.RESEND_API_KEY,
    clerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
  };
}

export type DbConnectionResult = {
  connected: boolean;
  error: string | null;
};

export async function testDbConnection(): Promise<DbConnectionResult> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return { connected: false, error: "DATABASE_URL not configured" };
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;
    return { connected: true, error: null };
  } catch (e) {
    return { connected: false, error: String(e) };
  }
}

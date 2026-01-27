import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { getDb } from "@/server/db";
import { subscriptions, users } from "@/server/db/schema";
import { getStripe } from "@/lib/stripe";
import { sendSubscriptionEmail } from "@/lib/emails";
import { getPlanName } from "@/lib/plans";

export async function POST(req: Request) {
  // Parallelize async operations to eliminate waterfall
  const [body, headerPayload] = await Promise.all([req.text(), headers()]);
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === "subscription" && session.subscription) {
      const subscription = await getStripe().subscriptions.retrieve(
        session.subscription as string
      );

      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("No userId in session metadata");
        return new Response("No userId in metadata", { status: 400 });
      }

      const priceId = subscription.items.data[0]?.price.id;
      const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
      await getDb().insert(subscriptions).values({
        userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        priceId,
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      });

      // Send subscription confirmation email (non-blocking)
      const user = await getDb().query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (user && priceId) {
        const planName = getPlanName(priceId);
        sendSubscriptionEmail(user.email, user.name, planName).catch((err) => {
          console.error("Failed to send subscription email:", err);
        });
      }
    }
  }

  if (eventType === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const updatePeriodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;

    await getDb()
      .update(subscriptions)
      .set({
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id,
        currentPeriodEnd: updatePeriodEnd ? new Date(updatePeriodEnd * 1000) : null,
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
  }

  if (eventType === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await getDb()
      .update(subscriptions)
      .set({
        status: "canceled",
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
  }

  return new Response("OK", { status: 200 });
}

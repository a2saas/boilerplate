import { z } from "zod";

import { getStripe } from "@/lib/stripe";
import { success, error, handleApiError } from "@/lib/api";
import { ensureUser } from "@/server/db/ensure-user";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

export async function POST(req: Request) {
  try {
    // Ensure user is authenticated and exists in database
    const user = await ensureUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    // Parse and validate request body
    const body = await req.json();
    const { priceId } = checkoutSchema.parse(body);

    // Get the app URL for redirects
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=canceled`,
      metadata: {
        userId: user.id, // This is used by the webhook to link the subscription
      },
      // Pre-fill customer email if available
      customer_email: user.email,
    });

    return success({ url: session.url });
  } catch (err) {
    return handleApiError(err);
  }
}

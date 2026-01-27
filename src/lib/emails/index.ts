import { render } from "@react-email/components";

import { getResend } from "@/lib/resend";
import { siteConfig } from "@/lib/site";

import { WelcomeEmail } from "./welcome";
import { SubscriptionConfirmedEmail } from "./subscription-confirmed";

export { WelcomeEmail, SubscriptionConfirmedEmail };

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(to: string, name: string | null) {
  const html = await render(WelcomeEmail({ name }));

  return getResend().emails.send({
    from: siteConfig.email.from,
    to,
    subject: `Welcome to ${siteConfig.name}`,
    html,
  });
}

/**
 * Send a subscription confirmation email
 */
export async function sendSubscriptionEmail(
  to: string,
  name: string | null,
  planName: string
) {
  const html = await render(SubscriptionConfirmedEmail({ name, planName }));

  return getResend().emails.send({
    from: siteConfig.email.from,
    to,
    subject: `Thanks for subscribing to ${siteConfig.name}`,
    html,
  });
}

---
name: remove-email
description: Remove email functionality from A2SaaS. Use when the user doesn't need transactional emails, wants to remove Resend, or delete email templates.
---

# Remove Email

Remove the Resend email integration and email templates from A2SaaS.

## Steps

1. **Delete the email templates directory**
   ```
   src/lib/emails/  (entire folder)
   ```

2. **Delete the Resend client**
   ```
   src/lib/resend.ts
   ```

3. **Remove email sending from webhooks**

   In `src/app/api/webhooks/clerk/route.ts`:
   - Remove the import: `import { sendWelcomeEmail } from "@/lib/emails"`
   - Remove the `sendWelcomeEmail()` call in the `user.created` handler

   In `src/app/api/webhooks/stripe/route.ts`:
   - Remove the import: `import { sendSubscriptionEmail } from "@/lib/emails"`
   - Remove the `sendSubscriptionEmail()` call in the checkout handler

4. **Remove email config from site.ts**

   In `src/lib/site.ts`, remove the `email` section:
   ```typescript
   email: {
     from: process.env.RESEND_FROM_EMAIL ?? "...",
     support: "...",
   },
   ```

5. **Remove environment variable** from `src/env.ts`:
   - Remove `RESEND_API_KEY` from the schema (if present)

6. **Optional: Remove unused dependencies**
   ```bash
   npm uninstall resend @react-email/components
   ```
   Note: Only do this if the user confirms.

7. **Run typecheck** to verify no broken imports:
   ```bash
   npm run typecheck
   ```

## Confirmation

After completing, confirm with the user:
- Email templates removed
- Webhook handlers updated (emails no longer sent)
- No TypeScript errors

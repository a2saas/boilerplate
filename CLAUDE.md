# A2SaaS - AI Assistant Context

This is a Next.js 16 SaaS boilerplate with authentication (Clerk), payments (Stripe), database (Drizzle + Neon), and email (Resend).

## Quick Reference

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign-in/sign-up (minimal layout)
│   ├── (marketing)/        # Landing, pricing (header/footer)
│   ├── (app)/              # Dashboard (sidebar, requires auth)
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities (auth, stripe, resend, etc.)
└── server/db/              # Database schema and helpers
```

## Key Patterns

### API Routes

All API routes follow this pattern:

```typescript
import { success, error, handleApiError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ... your logic
    return success({ data });
  } catch (err) {
    return handleApiError(err);
  }
}
```

### Server-side Auth

```typescript
import { getCurrentUser, getUserId } from "@/lib/auth";

// Get full user (id, email, name, imageUrl)
const user = await getCurrentUser();

// Just the ID (lightweight)
const userId = await getUserId();
```

### Database Queries

```typescript
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Find user
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});

// Insert
await db.insert(users).values({ ... });

// Update
await db.update(users).set({ ... }).where(eq(users.id, userId));
```

### Protected Pages

Use `ensureUser()` in any protected page to get the current user with subscription:

```typescript
import { ensureUser } from "@/server/db/ensure-user";

export default async function Page() {
  const user = await ensureUser();
  // user: { id, email, name, imageUrl, createdAt, subscription }
}
```

## Common Tasks

### Add a new API endpoint

1. Create file at `src/app/api/v1/[resource]/route.ts`
2. Use `success()` and `error()` from `@/lib/api`
3. Validate input with Zod
4. Add to public routes in `src/proxy.ts` if unauthenticated

### Add a new page

1. Create file at `src/app/(app)/dashboard/[page]/page.tsx` (protected) or `src/app/(marketing)/[page]/page.tsx` (public)
2. Use `ensureUser()` in protected pages
3. Add navigation link in sidebar if needed

### Add a new database table

1. Add table definition to `src/server/db/schema.ts`
2. Add relations if needed
3. Run `npm run db:push`

### Send an email

```typescript
import { sendWelcomeEmail, sendSubscriptionEmail } from "@/lib/emails";

await sendWelcomeEmail(email, name);
await sendSubscriptionEmail(email, name, planName);
```

### Add a new email template

1. Create template at `src/lib/emails/[name].tsx` using React Email
2. Add send function to `src/lib/emails/index.ts`

## Files You'll Edit Often

| Task | Files |
|------|-------|
| Add API endpoint | `src/app/api/v1/` |
| Add dashboard page | `src/app/(app)/dashboard/` |
| Add marketing page | `src/app/(marketing)/` |
| Modify database schema | `src/server/db/schema.ts` |
| Add email template | `src/lib/emails/` |
| Modify subscription plans | `src/lib/plans.ts` |
| Update site config | `src/lib/site.ts` |

## Do Not

- Use `any` types - always define proper types
- Create wrapper components unless asked - use Shadcn primitives directly
- Skip Zod validation on API inputs
- Store secrets in code - use environment variables
- Forget `createdAt`/`updatedAt` on new tables

## Project Config

- Site name/URL: `src/lib/site.ts`
- Environment vars: `src/env.ts`
- Plans/pricing: `src/lib/plans.ts`
- Public routes: `src/proxy.ts`

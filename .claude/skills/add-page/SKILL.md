---
name: add-page
description: Add a new page to A2SaaS. Use when the user wants to create a new page, add a route, or scaffold a page component.
---

# Add Page

Create a new page in the A2SaaS application.

## First, Ask the User

Before creating the page, clarify:

1. **Page type**: Marketing (public) or Dashboard (protected)?
2. **Route path**: What URL should this page have?
3. **Page title**: What should appear in the browser tab?
4. **Brief description**: What is this page for?

## Marketing Page (Public)

Location: `src/app/(marketing)/[page-name]/page.tsx`

Template:
```typescript
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "PAGE_TITLE",
  description: "PAGE_DESCRIPTION",
};

export default function PageNamePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4 pt-12 text-center sm:pt-16">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-5xl">
          PAGE_TITLE
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          PAGE_DESCRIPTION
        </p>
      </section>

      {/* Page content goes here */}
    </div>
  );
}
```

After creating, add to public routes in `src/proxy.ts` if needed.

## Dashboard Page (Protected)

Location: `src/app/(app)/dashboard/[page-name]/page.tsx`

Template:
```typescript
import { ensureUser } from "@/server/db/ensure-user";

export default async function PageNamePage() {
  const user = await ensureUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          PAGE_TITLE
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          PAGE_DESCRIPTION
        </p>
      </div>

      {/* Page content goes here */}
    </div>
  );
}
```

Dashboard pages are automatically protected by the middleware.

## Optional: Add Navigation

Ask if the user wants to add a nav link:

- **Marketing pages**: Add to `navLinks` array in `src/app/(marketing)/layout.tsx`
- **Dashboard pages**: Add to sidebar in `src/components/dashboard/sidebar.tsx`

## Confirmation

After creating, confirm:
- Page created at correct location
- Metadata set (for marketing pages)
- User authentication (for dashboard pages)
- Navigation link added (if requested)

---
name: add-api
description: Add a new API endpoint to A2SaaS. Use when the user wants to create an API route, add an endpoint, or build a REST API.
---

# Add API Endpoint

Create a new API endpoint following A2SaaS patterns.

## First, Ask the User

Before creating the endpoint, clarify:

1. **Resource name**: What resource does this endpoint manage? (e.g., "posts", "comments", "settings")
2. **HTTP methods**: Which methods are needed? (GET, POST, PUT, DELETE)
3. **Authentication**: Should this be protected (default) or public?
4. **Input validation**: What data does the endpoint accept?

## API Route Template

Location: `src/app/api/v1/[resource]/route.ts`

```typescript
import { z } from "zod";
import { NextRequest } from "next/server";
import { success, error, handleApiError } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { db } from "@/server/db";

// Input validation schema
const createSchema = z.object({
  // Define your input fields here
  name: z.string().min(1),
});

// GET - List or retrieve
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return error("Unauthorized", 401);
    }

    // Your logic here
    const data = {};

    return success({ data });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST - Create
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return error("Unauthorized", 401);
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return error("Invalid input", 400);
    }

    // Your logic here
    const data = {};

    return success({ data }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
```

## For Public Endpoints

If the endpoint should be public (no auth required):

1. Remove the `getUserId()` check from the handler
2. Add the route to `src/proxy.ts`:
   ```typescript
   const isPublicRoute = createRouteMatcher([
     // ... existing routes
     "/api/v1/[resource](.*)",  // Add your route
   ]);
   ```

## Dynamic Routes

For endpoints with IDs (e.g., `/api/v1/posts/[id]`):

Location: `src/app/api/v1/[resource]/[id]/route.ts`

```typescript
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // ...
}
```

## Confirmation

After creating, confirm:
- Endpoint created at correct location
- Zod validation schema defined
- Auth check in place (or route added to public list)
- Proper error handling with `handleApiError`

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Marketing pages — completely bypass Clerk (no init, no cookie parsing)
const isMarketingRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/features(.*)",
  "/for-developers(.*)",
  "/blog(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/setup",
  "/features(.*)",
  "/for-developers(.*)",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/v1/public(.*)",
  "/api/v1/debug(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Clerk middleware — only invoked for non-marketing routes
const authMiddleware = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect logged-in users away from auth pages to dashboard
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Marketing routes skip Clerk entirely — zero auth overhead
  if (isMarketingRoute(req)) {
    return NextResponse.next();
  }
  return authMiddleware(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

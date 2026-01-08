import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Marketing pages that don't need any auth check
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

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk auth entirely for marketing pages (performance optimization)
  if (isMarketingRoute(req)) {
    return NextResponse.next();
  }

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

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

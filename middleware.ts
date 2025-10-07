import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Make all routes public since we're using custom authentication with Clerk for email verification only
const isPublicRoute = createRouteMatcher([
  "/",
  "/features(.*)",
  "/signup(.*)",
  "/sign-in(.*)",
  "/api(.*)"
])

export default clerkMiddleware(async (auth, request) => {
  // Don't protect any routes - we handle authentication in our custom system
  // Clerk is only used for email verification
  return
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

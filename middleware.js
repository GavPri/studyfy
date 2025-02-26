import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // ✅ If user is NOT logged in and tries accessing protected routes, redirect to "/"
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  if (userId) {
    try {
      // Fetch user from Clerk API
      const userResponse = await fetch(
        `https://api.clerk.dev/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );

      console.log("User API Response Status:", userResponse.status);

      if (!userResponse.ok) {
        console.error("Clerk API Error Response:", errorBody);
        throw new Error("Failed to fetch user data");
      }

      const user = await userResponse.json();
      const userEmail = user?.email_addresses?.[0]?.email_address;

      console.log("Fetched User Email:", userEmail);

      // ✅ Prevent redirect if email is missing (fallback to home)
      if (!userEmail) {
        return NextResponse.rewrite(new URL("/", req.url));
      }

      // ✅ Redirect to dashboard if on home page
      if (req.nextUrl.pathname === "/" && userEmail) {
        const dashboardUrl = `/dashboard/${userEmail}`;
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return NextResponse.rewrite(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

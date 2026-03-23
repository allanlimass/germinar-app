import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isPrivateRoute = pathname.startsWith("/dashboard");

  const hasSession = !!session;
  const hasOrganization = !!session?.session?.activeOrganizationId;

  if (isAuthRoute && hasSession && hasOrganization)
    return NextResponse.redirect(new URL("/dashboard", request.url));

  if (isAuthRoute && hasSession && !hasOrganization)
    return NextResponse.redirect(new URL("/onboarding", request.url));

  if ((isPrivateRoute || isOnboardingRoute) && !hasSession)
    return NextResponse.redirect(new URL("/login", request.url));

  if (isPrivateRoute && hasSession && !hasOrganization)
    return NextResponse.redirect(new URL("/onboarding", request.url));

  if (isOnboardingRoute && hasSession && hasOrganization)
    return NextResponse.redirect(new URL("/dashboard", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/onboarding"],
};

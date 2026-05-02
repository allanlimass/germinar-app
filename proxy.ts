import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getLastAccesedBranch,
  setLastAccesedBranch,
} from "@/lib/utils/branch-context";

const publicRoutes = [
  { path: "/", exact: true },
  { path: "/login", exact: true },
  { path: "/register", exact: true },
  { path: "/accept-invitation", exact: false },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.exact) {
      return pathname === route.path;
    }
    return pathname.startsWith(route.path);
  });

  if (!session) {
    return isPublicRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
  }

  const { user, session: sessionData } = session;
  const hasOrganization = !!sessionData.activeOrganizationId;

  if (!hasOrganization && !pathname.startsWith("/welcome")) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    const { role } = await auth.api.getActiveMemberRole({
      headers: request.headers,
    });
    const isAdminOrOwner = role === "admin" || role === "owner";

    if (isAdminOrOwner) {
      return NextResponse.redirect(new URL("/organization", request.url));
    }

    const lastAccesedBranchId = await getLastAccesedBranch();

    if (lastAccesedBranchId) {
      return NextResponse.redirect(
        new URL(`/branch/${lastAccesedBranchId}`, request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/organization/branches", request.url),
    );
  }

  const response = NextResponse.next();

  if (pathname.startsWith("/branch/")) {
    const segments = pathname.split("/");
    const branchId = segments[2];

    const currentCookie = await getLastAccesedBranch();

    if (branchId !== currentCookie) {
      await setLastAccesedBranch(branchId);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

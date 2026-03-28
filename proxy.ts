import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const publicRoutes = [
  { path: "/", exact: true },
  { path: "/login", exact: true },
  { path: "/register", exact: true },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.exact) {
      return pathname === route.path;
    }
    return pathname.startsWith(route.path);
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session;
  const hasOrganization = !!session?.session?.activeOrganizationId;
  const isOnboardingRoute = pathname.startsWith("/welcome");

  // 1. Usuários NÃO logados
  if (!isAuthenticated) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --- O fluxo abaixo garante que o usuário ESTÁ autenticado ---

  // 2. Usuários logados SEM organização (em processo de Onboarding)
  if (!hasOrganization) {
    if (isOnboardingRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // 3. Usuários logados COM organização
  if (isPublicRoute || isOnboardingRoute) {
    return NextResponse.redirect(new URL("/organization", request.url));
  }

  // Rotas privadas liberadas (ex: /organization/*)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

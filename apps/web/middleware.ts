import { NextResponse, type NextRequest } from "next/server";

// Static, fast middleware for SEO-critical rewrites and redirects. Database-backed
// redirects are resolved in the [...slug] catchall (cheaper than DB-per-request here).

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /uploads (we handle them via wp-content rewrite, not for /uploads itself)
     * - /favicon.ico, /sitemap.xml, /robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)",
    // also match /wp-content/* explicitly (which has a dot)
    "/wp-content/:path*",
    "/wp-admin/:path*",
    "/wp-login.php",
  ],
};

const REDIRECT_MAP: Array<{ from: RegExp; to: string; code: 301 | 302 | 308 }> = [
  // Public-signup is admin-invitation-only. Block any attempt with a clear message.
  { from: /^\/portal\/register\/?(\?.*)?$/, to: "/portal/login/?msg=invite_only", code: 302 },
  { from: /^\/portal\/signup\/?(\?.*)?$/, to: "/portal/login/?msg=invite_only", code: 302 },
  // wp-admin / wp-login.php → portal
  { from: /^\/wp-login\.php(\?.*)?$/, to: "/portal/login/", code: 301 },
  { from: /^\/wp-admin(\/.*)?$/, to: "/portal/login/", code: 301 },
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const fullPath = pathname + (search || "");

  // 1) Rewrite legacy /wp-content/uploads/* → /uploads/*
  if (pathname.startsWith("/wp-content/uploads/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace("/wp-content/uploads/", "/uploads/");
    return NextResponse.rewrite(url);
  }

  // 2) Block any other /wp-content/* (themes, plugins) — no equivalent on Next site
  if (pathname.startsWith("/wp-content/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 3) Static redirect map
  for (const r of REDIRECT_MAP) {
    if (r.from.test(fullPath)) {
      const url = req.nextUrl.clone();
      url.pathname = r.to.split("?")[0];
      const qIdx = r.to.indexOf("?");
      url.search = qIdx >= 0 ? r.to.slice(qIdx) : "";
      return NextResponse.redirect(url, r.code);
    }
  }

  // 4) Auth gates — cheap cookie-presence check; signature verification happens in the page guard.
  // Admin console: /admin/* requires the admin cookie.
  if (pathname.startsWith("/admin")) {
    const adminCookie = req.cookies.get("vsi_admin_sid");
    if (!adminCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login/";
      url.search = `?admin=1&next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url, 307);
    }
  }
  // Client portal: every /portal/* path EXCEPT /portal/login/, /portal/reset/, and
  // /portal/accept-invite/ requires the client cookie.
  if (
    pathname.startsWith("/portal") &&
    !pathname.startsWith("/portal/login") &&
    !pathname.startsWith("/portal/reset") &&
    !pathname.startsWith("/portal/accept-invite")
  ) {
    const clientCookie = req.cookies.get("vsi_client_sid");
    if (!clientCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login/";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url, 307);
    }
  }

  // Pass current pathname to Server Components via request header (read via next/headers).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

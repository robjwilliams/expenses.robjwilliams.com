import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define public paths
  const publicPaths = ["/login", "/", "/api/latest_purchase"];

  // Determine if the request path is public
  const isPublicPath = publicPaths.some((path) => {
    // Ensure to match the path correctly
    return (
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + "/")
    );
  });

  // If the request path is public, allow it
  if (isPublicPath) {
    return response;
  }

  // Redirect to login if the user is not authenticated
  if (!session) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Proceed if the user is authenticated
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const redirectCookieName = "auth-redirect";

type BufferedCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { url, anonKey };
}

function applyBufferedCookies(response: NextResponse, cookies: BufferedCookie[]) {
  cookies.forEach(({ name, value, options }) => {
    response.cookies.set({ name, value, ...options });
  });
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectedFrom = requestUrl.searchParams.get("redirectedFrom");
  const cookieRedirect = request.cookies.get(redirectCookieName)?.value;
  const redirectPath =
    redirectedFrom && redirectedFrom.startsWith("/")
      ? redirectedFrom
      : cookieRedirect && cookieRedirect.startsWith("/")
        ? cookieRedirect
        : "/";

  const clearRedirectCookie = (response: NextResponse) => {
    response.cookies.set({ name: redirectCookieName, value: "", maxAge: 0, path: "/" });
  };

  if (code) {
    try {
      const { url, anonKey } = getSupabaseConfig();
      const bufferedCookies: BufferedCookie[] = [];
      const supabase = createServerClient(url, anonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            bufferedCookies.push({ name, value, options });
          },
          remove(name: string, options: CookieOptions) {
            bufferedCookies.push({
              name,
              value: "",
              options: { ...options, maxAge: 0 }
            });
          }
        }
      });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(new URL("/login?error=oauth", request.url));
      }
      const response = NextResponse.redirect(new URL(redirectPath, request.url));
      applyBufferedCookies(response, bufferedCookies);
      clearRedirectCookie(response);
      return response;
    } catch {
      const response = NextResponse.redirect(new URL("/login?error=oauth", request.url));
      clearRedirectCookie(response);
      return response;
    }
  }

  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  clearRedirectCookie(response);
  return response;
}

import { NextResponse, type NextRequest } from "next/server";
import type { Provider } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const allowedProviders = new Set<Provider>(["google", "github"]);
const redirectCookieName = "auth-redirect";
const redirectCookieOptions: CookieOptions = {
  path: "/",
  maxAge: 60 * 5,
  sameSite: "lax",
  httpOnly: true
};

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
  const provider = request.nextUrl.searchParams.get("provider") as Provider | null;
  const redirectedFrom = request.nextUrl.searchParams.get("redirectedFrom");
  const redirectPath =
    redirectedFrom && redirectedFrom.startsWith("/") ? redirectedFrom : "/dashboard";

  if (!provider || !allowedProviders.has(provider)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/callback?redirectedFrom=${encodeURIComponent(
          redirectPath
        )}`
      }
    });

    if (error || !data?.url) {
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    const response = NextResponse.redirect(data.url);
    applyBufferedCookies(response, bufferedCookies);
    response.cookies.set({
      name: redirectCookieName,
      value: redirectPath,
      ...redirectCookieOptions
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}

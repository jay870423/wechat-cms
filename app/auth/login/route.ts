import { NextResponse, type NextRequest } from "next/server";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedProviders = new Set<Provider>(["google", "github"]);

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider") as Provider | null;
  const redirectedFrom = request.nextUrl.searchParams.get("redirectedFrom");
  const redirectTo =
    redirectedFrom && redirectedFrom.startsWith("/") ? redirectedFrom : "/dashboard";

  if (!provider || !allowedProviders.has(provider)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/callback?redirectedFrom=${encodeURIComponent(
          redirectTo
        )}`
      }
    });

    if (error || !data?.url) {
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    return NextResponse.redirect(data.url);
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}

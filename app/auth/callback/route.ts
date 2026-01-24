import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectedFrom = requestUrl.searchParams.get("redirectedFrom");
  const redirectTo =
    redirectedFrom && redirectedFrom.startsWith("/") ? redirectedFrom : "/dashboard";

  if (code) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(new URL("/login?error=oauth", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

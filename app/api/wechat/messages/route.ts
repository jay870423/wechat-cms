import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  try {
    const supabase = createSupabaseServerClientReadOnly();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("wechat_messages")
      .select("id,status,wechat_media_id,created_at,articles(title)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const payload = (data ?? []).map((item) => ({
      id: item.id,
      status: item.status,
      wechat_media_id: item.wechat_media_id,
      created_at: item.created_at,
      article_title: item.articles?.title ?? null
    }));

    return NextResponse.json({ data: payload });
  } catch (error) {
    return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 });
  }
}

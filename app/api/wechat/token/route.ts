import { NextResponse } from "next/server";
import { fetchAccessToken } from "@/lib/wechat/client";
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

  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "WECHAT_APP_ID and WECHAT_APP_SECRET are required" },
      { status: 400 }
    );
  }

  try {
    const token = await fetchAccessToken(appId, appSecret);
    return NextResponse.json(token);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 502 });
  }
}

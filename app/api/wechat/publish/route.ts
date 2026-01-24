import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import { createNewsDraft, fetchAccessToken, submitFreePublish } from "@/lib/wechat/client";

async function getAuthenticatedUser() {
  try {
    const supabase = createSupabaseServerClientReadOnly();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
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

  let payload: { articleId?: string; thumbMediaId?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.articleId || !payload.thumbMediaId) {
    return NextResponse.json(
      { error: "articleId and thumbMediaId are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data: article, error } = await supabase
      .from("articles")
      .select("id,title,content,summary")
      .eq("id", payload.articleId)
      .single();

    if (error || !article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const token = await fetchAccessToken(appId, appSecret);
    const draft = await createNewsDraft(token.access_token, {
      title: article.title,
      content: article.content,
      digest: article.summary ?? undefined,
      thumb_media_id: payload.thumbMediaId
    });
    const publish = await submitFreePublish(token.access_token, draft.media_id);

    await supabase.from("wechat_messages").insert({
      article_id: article.id,
      message_type: "news",
      status: "queued",
      wechat_media_id: draft.media_id,
      response_payload: publish
    });

    return NextResponse.json({ draft, publish });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "WeChat publish failed" },
      { status: 502 }
    );
  }
}

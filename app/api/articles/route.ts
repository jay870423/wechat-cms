import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import type { ArticleInsert, ArticleUpdate } from "@/types/article";

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
      .from("articles")
      .select("id,title,status,updated_at,summary,cover_url")
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ArticleInsert;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.title || !payload.content) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: payload.title,
        content: payload.content,
        summary: payload.summary ?? null,
        status: payload.status ?? "draft",
        cover_url: payload.cover_url ?? null
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ArticleUpdate;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (
    !payload.title &&
    !payload.content &&
    payload.summary === undefined &&
    !payload.status &&
    payload.cover_url === undefined
  ) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (payload.title) updates.title = payload.title;
    if (payload.content) updates.content = payload.content;
    if (payload.summary !== undefined) updates.summary = payload.summary ?? null;
    if (payload.status) updates.status = payload.status;
    if (payload.cover_url !== undefined) updates.cover_url = payload.cover_url ?? null;

    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", payload.id)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 });
  }
}

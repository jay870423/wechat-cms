"use client";

import { useState } from "react";
import AppShell from "@/components/shared/AppShell";
import RichTextEditor from "@/components/editor/RichTextEditor";
import Textarea from "@/components/ui/Textarea";
import RequireAuth from "@/components/auth/RequireAuth";
import { useI18n } from "@/components/shared/LocaleProvider";
import Input from "@/components/ui/Input";

export default function EditorPage() {
  const { copy } = useI18n();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [thumbMediaId, setThumbMediaId] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishNotice, setPublishNotice] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setNotice({ tone: "error", text: copy.editor.required });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch(articleId ? "/api/articles" : "/api/articles", {
        method: articleId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId ?? undefined,
          title,
          content,
          summary: summary.trim() ? summary : undefined,
          status: "draft"
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const payload = await response.json();
      if (payload?.data?.id) {
        setArticleId(payload.data.id);
      }
      setNotice({ tone: "success", text: copy.editor.saved });
    } catch {
      setNotice({ tone: "error", text: copy.editor.saveError });
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!articleId || !thumbMediaId.trim()) {
      setPublishNotice({ tone: "error", text: copy.editor.wechatPublishRequired });
      return;
    }

    setPublishing(true);
    setPublishNotice(null);

    try {
      const response = await fetch("/api/wechat/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          thumbMediaId: thumbMediaId.trim()
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setPublishNotice({ tone: "success", text: copy.editor.wechatPublishSuccess });
    } catch {
      setPublishNotice({ tone: "error", text: copy.editor.wechatPublishError });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <RequireAuth>
      <AppShell
        title={copy.editor.title}
        subtitle={copy.editor.subtitle}
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <RichTextEditor
            title={title}
            content={content}
            saving={saving}
            notice={notice}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSave={handleSave}
          />
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {copy.editor.summary}
              </p>
              <Textarea
                rows={6}
                placeholder={copy.editor.summaryPlaceholder}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {copy.editor.checklistTitle}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {copy.editor.checklistItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {copy.editor.wechatPanelTitle}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {copy.editor.wechatPanelHint}
              </p>
              <div className="mt-4 space-y-3">
                <label
                  className="text-xs font-semibold text-slate-500"
                  htmlFor="wechat-thumb"
                >
                  {copy.editor.wechatThumbLabel}
                </label>
                <Input
                  id="wechat-thumb"
                  value={thumbMediaId}
                  onChange={(event) => setThumbMediaId(event.target.value)}
                  placeholder={copy.editor.wechatThumbPlaceholder}
                />
                <button
                  className="w-full rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing
                    ? copy.editor.wechatPublishing
                    : copy.editor.wechatPublish}
                </button>
              </div>
              {publishNotice ? (
                <div
                  className={`mt-4 rounded-2xl border px-3 py-2 text-xs ${
                    publishNotice.tone === "error"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {publishNotice.text}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

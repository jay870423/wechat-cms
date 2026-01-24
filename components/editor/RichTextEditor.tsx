"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useI18n } from "@/components/shared/LocaleProvider";
import { getWordCountLabel } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  title: string;
  content: string;
  saving?: boolean;
  notice?: { tone: "success" | "error"; text: string } | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
};

export default function RichTextEditor({
  title,
  content,
  saving,
  notice,
  onTitleChange,
  onContentChange,
  onSave
}: RichTextEditorProps) {
  const { copy, locale } = useI18n();
  const editorRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerText !== content) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  const handleInput = () => {
    onContentChange(editorRef.current?.innerText ?? "");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {copy.editor.toolbarTitle}
          </p>
          <p className="text-sm text-slate-500">
            {getWordCountLabel(locale, wordCount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" type="button">
            {copy.editor.preview}
          </Button>
          <Button size="sm" type="button" onClick={onSave} disabled={saving}>
            {saving ? copy.editor.savingDraft : copy.editor.saveDraft}
          </Button>
        </div>
      </div>

      <Input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder={copy.editor.titlePlaceholder}
      />

      <div className="flex flex-wrap gap-2">
        {copy.editor.tools.map((tool) => (
          <Button key={tool} variant="ghost" size="sm" type="button">
            {tool}
          </Button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[260px] rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-800 shadow-soft outline-none"
        data-placeholder={copy.editor.startWriting}
      />

      {notice ? (
        <div
          className={cn(
            "rounded-3xl border px-4 py-3 text-xs",
            notice.tone === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          )}
        >
          {notice.text}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {copy.editor.livePreview}
        </p>
        <h3 className="mt-3 font-serif text-2xl text-ink">
          {title || copy.editor.titlePlaceholder}
        </h3>
        <div className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
          {content || copy.editor.startWriting}
        </div>
      </div>
    </div>
  );
}

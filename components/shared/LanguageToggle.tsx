"use client";

import { useI18n } from "@/components/shared/LocaleProvider";
import { cn } from "@/lib/utils";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-white/70 p-1 text-xs font-semibold text-slate-600 shadow-soft">
      <button
        className={cn(
          "rounded-full px-3 py-1 transition",
          locale === "en" ? "bg-ink text-white" : "hover:bg-slate-100"
        )}
        type="button"
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        className={cn(
          "rounded-full px-3 py-1 transition",
          locale === "zh" ? "bg-ink text-white" : "hover:bg-slate-100"
        )}
        type="button"
        onClick={() => setLocale("zh")}
      >
        中文
      </button>
    </div>
  );
}

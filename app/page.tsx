"use client";

import Link from "next/link";
import AppShell from "@/components/shared/AppShell";
import { buttonClasses } from "@/components/ui/Button";
import { useI18n } from "@/components/shared/LocaleProvider";

export default function Home() {
  const { copy } = useI18n();

  return (
    <AppShell
      title={copy.home.title}
      subtitle={copy.home.subtitle}
    >
      <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {copy.home.kicker}
          </p>
          <h2 className="text-4xl font-semibold text-ink">
            {copy.home.heroTitle}
          </h2>
          <p className="text-base text-slate-600">
            {copy.home.heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonClasses({ variant: "primary", size: "lg" })}
              href="/dashboard"
            >
              {copy.home.ctaDashboard}
            </Link>
            <Link
              className={buttonClasses({ variant: "outline", size: "lg" })}
              href="/editor"
            >
              {copy.home.ctaEditor}
            </Link>
          </div>
        </div>
        <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
            <span>{copy.home.queue.today}</span>
            <span>{copy.home.queue.queueCount}</span>
          </div>
          <div className="mt-6 space-y-4">
            {copy.home.queue.items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-mist/80 px-4 py-3 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-100 to-amber-50 px-4 py-3 text-xs text-slate-600">
            {copy.home.queue.notice}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {copy.home.highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200/70 bg-white/70 p-6"
          >
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

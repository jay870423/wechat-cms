"use client";

import Link from "next/link";
import AuthStatus from "@/components/auth/AuthStatus";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { useI18n } from "@/components/shared/LocaleProvider";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showNav?: boolean;
};

export default function AppShell({
  children,
  title,
  subtitle,
  showNav = true
}: AppShellProps) {
  const { copy } = useI18n();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600">
            {copy.brand.name}
          </p>
          {title ? (
            <h1 className="mt-2 font-serif text-3xl text-ink">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="mt-1 max-w-xl text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>
        {showNav ? (
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
            <Link className="transition hover:text-ink" href="/dashboard">
              {copy.nav.dashboard}
            </Link>
            <Link className="transition hover:text-ink" href="/editor">
              {copy.nav.editor}
            </Link>
            <LanguageToggle />
            <AuthStatus />
          </nav>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-6">
          <span>{copy.footer.product}</span>
          <span>{copy.footer.poweredBy}</span>
        </div>
      </footer>
    </div>
  );
}

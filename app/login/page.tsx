"use client";

import AppShell from "@/components/shared/AppShell";
import AuthForm from "@/components/auth/AuthForm";
import { useI18n } from "@/components/shared/LocaleProvider";

export default function LoginPage() {
  const { copy } = useI18n();

  return (
    <AppShell
      title={copy.login.title}
      subtitle={copy.login.subtitle}
      showNav={false}
    >
      <div className="mx-auto max-w-md rounded-[28px] border border-slate-200/70 bg-white/80 p-8 shadow-soft">
        <AuthForm />
        <p className="mt-6 text-xs text-slate-500">
          {copy.login.note}
        </p>
      </div>
    </AppShell>
  );
}

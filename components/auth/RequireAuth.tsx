"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/shared/LocaleProvider";

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { copy } = useI18n();
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const supabase = useMemo(() => {
    try {
      return createSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecked(true);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const session = data.session;
      setHasSession(Boolean(session));
      setChecked(true);
      if (!session) {
        router.replace("/login");
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setHasSession(false);
        router.replace("/login");
        return;
      }
      setHasSession(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
        {copy.auth.missingConfig}
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 text-xs text-slate-500">
        {copy.nav.checking}
      </div>
    );
  }

  if (!hasSession) {
    const redirectTo = pathname && pathname.startsWith("/") ? pathname : "/dashboard";
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-4 text-sm text-slate-600">
        <p>{copy.auth.loginRequired}</p>
        <Link
          className="mt-3 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          href={`/login?redirectedFrom=${encodeURIComponent(redirectTo)}`}
        >
          {copy.auth.loginCTA}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

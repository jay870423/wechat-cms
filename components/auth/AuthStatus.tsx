"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/shared/LocaleProvider";

export default function AuthStatus() {
  const router = useRouter();
  const { copy } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const supabase = useMemo(() => {
    try {
      return createSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!ready) {
    return <span className="text-xs text-slate-400">{copy.nav.checking}</span>;
  }

  if (!user) {
    return (
      <Link className="transition hover:text-ink" href="/login">
        {copy.nav.login}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <span className="max-w-[160px] truncate">{user.email ?? "Signed in"}</span>
      <button
        className="text-sm font-semibold text-slate-700 transition hover:text-ink"
        type="button"
        onClick={handleSignOut}
      >
        {copy.nav.signOut}
      </button>
    </div>
  );
}

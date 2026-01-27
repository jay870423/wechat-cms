"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/shared/LocaleProvider";

type AuthMode = "sign-in" | "sign-up";

type Message = {
  tone: "error" | "success";
  text: string;
};

const defaultRedirect = "/";
const redirectCookieName = "auth-redirect";

export default function AuthForm() {
  const router = useRouter();
  const { copy } = useI18n();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [redirectParam, setRedirectParam] = useState(defaultRedirect);
  const [oauthError, setOauthError] = useState(false);

  const resolveRedirectTarget = () => {
    if (typeof window === "undefined") return defaultRedirect;
    const params = new URLSearchParams(window.location.search);
    const redirectedFrom = params.get("redirectedFrom");
    if (redirectedFrom && redirectedFrom.startsWith("/")) {
      return redirectedFrom;
    }
    const referrer = document.referrer;
    if (referrer) {
      try {
        const refUrl = new URL(referrer);
        if (refUrl.origin === window.location.origin) {
          const path = `${refUrl.pathname}${refUrl.search}`;
          if (path.startsWith("/")) {
            return path;
          }
        }
      } catch {
        // Ignore invalid referrer.
      }
    }
    return defaultRedirect;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setRedirectParam(resolveRedirectTarget());
    setOauthError(Boolean(params.get("error")));
  }, []);

  const supabase = useMemo(() => {
    try {
      return createSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({
        tone: "error",
        text: copy.auth.missingConfig
      });
      return;
    }

    if (!email || !password) {
      setMessage({ tone: "error", text: copy.auth.required });
      return;
    }

    setBusy(true);

    const redirectTo = redirectParam;

    if (mode === "sign-up") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ tone: "error", text: error.message });
      } else if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setMessage({
          tone: "success",
          text: copy.auth.accountCreated
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setMessage({ tone: "error", text: error.message });
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    }

    setBusy(false);
  }

  const handleOAuthClick = (provider: "google" | "github") => (event: React.MouseEvent) => {
    event.preventDefault();
    if (typeof window === "undefined") return;
    const redirectTarget = resolveRedirectTarget();
    document.cookie = `${redirectCookieName}=${encodeURIComponent(
      redirectTarget
    )}; Path=/; Max-Age=300; SameSite=Lax`;
    window.location.href = `/auth/login?provider=${provider}&redirectedFrom=${encodeURIComponent(
      redirectTarget
    )}`;
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {oauthError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {copy.auth.oauthError}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          href={`/auth/login?provider=google&redirectedFrom=${encodeURIComponent(
            redirectParam
          )}`}
          onClick={handleOAuthClick("google")}
        >
          {copy.auth.continueGoogle}
        </a>
        <a
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          href={`/auth/login?provider=github&redirectedFrom=${encodeURIComponent(
            redirectParam
          )}`}
          onClick={handleOAuthClick("github")}
        >
          {copy.auth.continueGithub}
        </a>
      </div>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        {copy.auth.orDivider}
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Input
        autoComplete="email"
        placeholder={copy.auth.email}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
        placeholder={copy.auth.password}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button className="w-full" type="submit" disabled={busy || !supabase}>
        {busy
          ? copy.auth.working
          : mode === "sign-in"
            ? copy.auth.signIn
            : copy.auth.createAccount}
      </Button>

      {message ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-xs",
            message.tone === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          )}
        >
          {message.text}
        </div>
      ) : null}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {mode === "sign-in" ? copy.auth.newHere : copy.auth.haveAccount}
        </span>
        <button
          className="font-semibold text-slate-700"
          type="button"
          onClick={() =>
            setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
          }
        >
          {mode === "sign-in" ? copy.auth.createAccount : copy.auth.signInInstead}
        </button>
      </div>
    </form>
  );
}

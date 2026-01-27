"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useI18n } from "@/components/shared/LocaleProvider";

const defaultRedirect = "/";
const redirectCookieName = "auth-redirect";

type AuthFormProps = {
  onStartOAuth?: () => void;
};

export default function AuthForm({ onStartOAuth }: AuthFormProps) {
  const { copy } = useI18n();
  const [redirectParam, setRedirectParam] = useState(defaultRedirect);
  const [oauthError, setOauthError] = useState(false);

  const resolveRedirectTarget = () => {
    if (typeof window === "undefined") return defaultRedirect;

    const params = new URLSearchParams(window.location.search);
    const redirectedFrom = params.get("redirectedFrom");
    if (redirectedFrom && redirectedFrom.startsWith("/")) {
      return redirectedFrom;
    }

    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath.startsWith("/") && window.location.pathname !== "/login") {
      return currentPath;
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

  const handleOAuthClick =
    (provider: "google" | "github") => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (typeof window === "undefined") return;
      const redirectTarget = resolveRedirectTarget();
      document.cookie = `${redirectCookieName}=${encodeURIComponent(
        redirectTarget
      )}; Path=/; Max-Age=300; SameSite=Lax`;
      if (onStartOAuth) {
        onStartOAuth();
      }
      window.location.href = `/auth/login?provider=${provider}&redirectedFrom=${encodeURIComponent(
        redirectTarget
      )}`;
    };

  return (
    <div className="space-y-5">
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

      <p className="text-xs text-slate-500">{copy.login.note}</p>
    </div>
  );
}

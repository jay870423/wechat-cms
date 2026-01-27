"use client";

import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useI18n } from "@/components/shared/LocaleProvider";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { copy } = useI18n();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        aria-label="Close login dialog"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        type="button"
        onClick={onClose}
      />
      <div
        aria-labelledby="login-dialog-title"
        aria-modal="true"
        role="dialog"
        className="relative w-full max-w-md rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {copy.nav.login}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-ink" id="login-dialog-title">
              {copy.login.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{copy.login.subtitle}</p>
          </div>
          <button
            aria-label="Close login dialog"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
            type="button"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="mt-6">
          <AuthForm onStartOAuth={onClose} />
        </div>
      </div>
    </div>
  );
}

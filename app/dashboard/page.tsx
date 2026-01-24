"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/shared/AppShell";
import Badge from "@/components/shared/Badge";
import StatCard from "@/components/shared/StatCard";
import RequireAuth from "@/components/auth/RequireAuth";
import { useI18n } from "@/components/shared/LocaleProvider";
import { createSupabaseClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { ArticleListItem, ArticleStatus } from "@/types/article";
import type { WechatMessageListItem, WechatMessageStatus } from "@/types/wechat";

const statusTone = {
  draft: "neutral",
  review: "amber",
  scheduled: "jade",
  published: "jade",
  archived: "rose"
} as const;

const wechatStatusTone: Record<
  WechatMessageStatus,
  "neutral" | "amber" | "jade" | "rose"
> = {
  draft: "neutral",
  queued: "amber",
  sent: "jade",
  failed: "rose"
};

export default function DashboardPage() {
  const { copy } = useI18n();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wechatMessages, setWechatMessages] = useState<WechatMessageListItem[]>([]);
  const [wechatLoading, setWechatLoading] = useState(true);
  const [wechatError, setWechatError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    try {
      return createSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const stats = useMemo(() => {
    const counts = articles.reduce(
      (acc, article) => {
        acc[article.status] = (acc[article.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<ArticleStatus, number>
    );

    return [
      {
        label: copy.dashboard.stats[0].label,
        value: String(counts.draft ?? 0),
        trend: copy.dashboard.stats[0].trend,
        accent: "jade"
      },
      {
        label: copy.dashboard.stats[1].label,
        value: String(counts.review ?? 0),
        trend: copy.dashboard.stats[1].trend,
        accent: "amber"
      },
      {
        label: copy.dashboard.stats[2].label,
        value: String(counts.published ?? 0),
        trend: copy.dashboard.stats[2].trend,
        accent: "jade"
      }
    ];
  }, [articles, copy.dashboard.stats]);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/articles");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? copy.dashboard.loadError);
      }

      setArticles(payload.data ?? []);
    } catch {
      setError(copy.dashboard.loadError);
    } finally {
      setLoading(false);
    }
  };

  const loadWechatMessages = async () => {
    setWechatLoading(true);
    setWechatError(null);

    try {
      const response = await fetch("/api/wechat/messages");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? copy.dashboard.wechatLoadError);
      }

      setWechatMessages(payload.data ?? []);
    } catch {
      setWechatError(copy.dashboard.wechatLoadError);
    } finally {
      setWechatLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
    loadWechatMessages();

    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel("cms-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        () => {
          loadArticles();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wechat_messages" },
        () => {
          loadWechatMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return (
    <RequireAuth>
      <AppShell
        title={copy.dashboard.title}
        subtitle={copy.dashboard.subtitle}
      >
        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mt-10 rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">
              {copy.dashboard.recentActivity}
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {copy.dashboard.updatedToday}
            </span>
          </div>
          <div className="mt-6 divide-y divide-slate-200/70">
            {loading ? (
              <div className="py-6 text-sm text-slate-500">
                {copy.common.loading}
              </div>
            ) : error ? (
              <div className="py-6">
                <p className="text-sm text-rose-600">{error}</p>
                <button
                  className="mt-3 text-xs font-semibold text-slate-700"
                  type="button"
                  onClick={loadArticles}
                >
                  {copy.common.retry}
                </button>
              </div>
            ) : articles.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">
                {copy.dashboard.emptyState}
              </div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      {article.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(article.updated_at)}
                    </p>
                  </div>
                  <Badge
                    label={copy.status[article.status]}
                    tone={statusTone[article.status]}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">
              {copy.dashboard.wechatTitle}
            </h2>
          </div>
          <div className="mt-6 divide-y divide-slate-200/70">
            {wechatLoading ? (
              <div className="py-6 text-sm text-slate-500">
                {copy.common.loading}
              </div>
            ) : wechatError ? (
              <div className="py-6">
                <p className="text-sm text-rose-600">{wechatError}</p>
                <button
                  className="mt-3 text-xs font-semibold text-slate-700"
                  type="button"
                  onClick={loadWechatMessages}
                >
                  {copy.common.retry}
                </button>
              </div>
            ) : wechatMessages.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">
                {copy.dashboard.wechatEmpty}
              </div>
            ) : (
              wechatMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      {message.article_title ?? copy.editor.titlePlaceholder}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  <Badge
                    label={copy.wechatStatus[message.status]}
                    tone={wechatStatusTone[message.status]}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </AppShell>
    </RequireAuth>
  );
}

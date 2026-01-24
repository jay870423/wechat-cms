type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
  accent?: "jade" | "amber" | "rose";
};

const accentMap = {
  jade: "text-jade",
  amber: "text-amber",
  rose: "text-rose"
} as const;

export default function StatCard({
  label,
  value,
  trend,
  accent = "jade"
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-3xl font-semibold text-ink">{value}</p>
        {trend ? (
          <span className={`text-xs font-semibold ${accentMap[accent]}`}>
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}

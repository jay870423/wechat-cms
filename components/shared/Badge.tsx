import { cn } from "@/lib/utils";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "jade" | "amber" | "rose";
};

const toneMap = {
  neutral: "bg-slate-100 text-slate-600",
  jade: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700"
} as const;

export default function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneMap[tone]
      )}
    >
      {label}
    </span>
  );
}

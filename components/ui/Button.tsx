import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-jade text-white shadow-soft hover:translate-y-[-1px]",
  outline:
    "border border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300",
  ghost: "text-slate-600 hover:bg-slate-100"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm"
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className
}: ButtonOptions) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonOptions;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

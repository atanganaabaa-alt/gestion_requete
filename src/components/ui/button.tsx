import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-deep border-navy shadow-[0_1px_0_rgba(0,0,0,0.08)]",
  secondary:
    "bg-white text-navy border-line hover:border-navy hover:bg-paper",
  ghost: "bg-transparent text-navy border-transparent hover:bg-white/70",
  danger: "bg-accent text-white border-accent hover:opacity-90",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm"
      } ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

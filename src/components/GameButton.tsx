import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "option";

type GameButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};


const variants: Record<Variant, string> = {
  primary: "recommended-action border-signal bg-paper text-paper-ink hover:bg-paper/90 hover:border-signal",
  secondary: "border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  danger: "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
  option: "border-border bg-card text-card-foreground hover:border-signal hover:bg-accent hover:text-accent-foreground text-left",
};

export function GameButton({ variant = "primary", icon, className, children, ...props }: GameButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border-2 px-5 py-3 text-sm font-black uppercase transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

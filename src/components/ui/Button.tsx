import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../utils/classNames";

type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "orbital-gradient text-white shadow-glow hover:shadow-[0_0_52px_rgba(130,109,255,0.28)]",
  secondary:
    "border border-border-strong bg-surface-elevated text-text-primary hover:border-primary/70 hover:bg-surface-soft",
  ghost: "text-text-secondary hover:bg-surface-soft hover:text-text-primary",
  subtle: "border border-border-subtle bg-surface-soft text-text-secondary hover:text-text-primary",
};

export function Button({ children, className, variant = "primary", icon, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: props.disabled ? 0 : -2 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}

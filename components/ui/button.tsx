import type { ComponentPropsWithRef } from "react";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  secondary:
    "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high",
  danger: "bg-error text-on-error hover:bg-error/90",
  ghost: "text-primary hover:bg-primary-fixed-dim",
};

type ButtonVariant = keyof typeof variants;

export function buttonStyles({
  variant = "primary",
  className = "",
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-label-md text-label-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-primary-fixed/60 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  ].join(" ");
}

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, className })}
      {...props}
    />
  );
}

"use client";

import type { ReactNode } from "react";
import { Link } from "react-aria-components";

export default function LandingNavigationButton({
  children,
  href,
  variant = "outlined",
}: {
  children: ReactNode;
  href: string;
  variant?: "filled" | "outlined";
}) {
  return (
    <Link
      className={`rounded-lg border border-primary px-4 py-2.5 text-label-sm md:text-label-md transition 
        data-hovered:-translate-y-0.5 data-focus-visible:outline-none data-focus-visible:ring-3 
        data-focus-visible:ring-primary-fixed/60 ${
          variant === "filled"
            ? "bg-primary text-on-primary shadow-sm data-hovered:bg-primary-container"
            : "text-primary data-hovered:bg-primary-fixed/40"
        }`}
      href={href}
    >
      {children}
    </Link>
  );
}

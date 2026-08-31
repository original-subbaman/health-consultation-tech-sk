"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItemProps } from "./nav-item";

export default function MobileNavItem({ icon, label, href }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all duration-200 active:scale-90",
        isActive
          ? "bg-secondary-container text-on-secondary-container"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
      ].join(" ")}
    >
      {icon}
      <span className="font-label-sm text-label-sm font-semibold mt-1">
        {label}
      </span>
    </Link>
  );
}

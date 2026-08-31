"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export default function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-lg px-4 py-3 font-bold transition-all duration-200",
        isActive
          ? "bg-secondary-container text-on-secondary-container"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

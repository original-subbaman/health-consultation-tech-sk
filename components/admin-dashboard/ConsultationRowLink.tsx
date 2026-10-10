"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function ConsultationRowLink({
  href,
  patientName,
  children,
}: {
  href: string;
  patientName: string;
  children: ReactNode;
}) {
  const router = useRouter();

  function navigate(event: MouseEvent<HTMLTableRowElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      !(event.target instanceof Element) ||
      event.target.closest("a, button, input, select, textarea, [role='button']") ||
      window.getSelection()?.toString()
    ) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(href);
  }

  return (
    <tr
      onClick={navigate}
      className="cursor-pointer transition-colors hover:bg-surface-container-low/60 focus-within:bg-surface-container-low/60"
      data-name={patientName}
    >
      {children}
    </tr>
  );
}

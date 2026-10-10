import type { ReactNode } from "react";

export default function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 sm:p-6">
      <h3 className="mb-5 text-lg font-semibold text-on-surface">{title}</h3>
      {children}
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Serene Health",
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-16 text-on-background">
      <div className="relative w-full max-w-2xl text-center">
        <div aria-hidden="true" className="absolute -left-24 -top-32 size-64 rounded-full bg-primary-fixed/40 blur-2xl" />
        <div aria-hidden="true" className="absolute -bottom-32 -right-24 size-64 rounded-full bg-secondary-fixed/50 blur-2xl" />

        <section className="relative rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-12 shadow-ambient sm:px-12 sm:py-16">
          <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-on-surface" aria-label="Serene Health home">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-xl text-on-primary">+</span>
            <span>Serene Health</span>
          </Link>

          <p className="mt-10 text-label-md text-primary">ERROR 404</p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-tight tracking-[-0.02em] text-on-surface sm:text-headline-xl">
            This page could not be found
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-body-lg text-on-surface-variant">
            The page may have moved, or the address might be incorrect. Let&apos;s get you back to a familiar place.
          </p>

          <Link href="/" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover">
            Return to home
          </Link>
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-on-background">
      <section className="w-full max-w-2xl rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-12 text-center shadow-ambient sm:px-12 sm:py-16">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-error-container text-error">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 2.5 20h19L12 3Z" />
            <path strokeLinecap="round" d="M12 9v5m0 3h.01" />
          </svg>
        </div>
        <p className="mt-6 text-label-md text-error">SOMETHING WENT WRONG</p>
        <h1 className="mt-3 text-headline-lg text-on-surface">We couldn&apos;t load this page</h1>
        <p className="mx-auto mt-4 max-w-lg text-body-md text-on-surface-variant">
          This may be a temporary problem. Try again, or return home if it continues.
        </p>
        {error.digest ? <p className="mt-3 font-mono text-xs text-outline">Reference: {error.digest}</p> : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="rounded-lg bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover">
            Try again
          </button>
          <Link href="/" className="rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-3.5 text-label-md text-primary transition hover:-translate-y-0.5 hover:border-primary">
            Return to home
          </Link>
        </div>
      </section>
    </main>
  );
}

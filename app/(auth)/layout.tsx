import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-surface px-4 py-8 text-on-background sm:px-6 lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.8fr)] lg:p-0">
      <section className="relative hidden overflow-hidden bg-inverse-surface p-12 text-inverse-on-surface lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-24 size-80 rounded-full bg-primary/30 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-24 size-96 rounded-full bg-secondary/25 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-3 font-semibold tracking-tight"
          aria-label="Serene Health home"
        >
          <span className="grid size-10 place-items-center rounded-md bg-inverse-primary text-xl text-on-primary-fixed">
            +
          </span>
          <span>Serene Health</span>
        </Link>

        <div className="relative max-w-xl">
          <p className="text-label-md text-inverse-primary">
            CARE, MADE SIMPLE
          </p>
          <h1 className="mt-4 text-[2.75rem] font-bold leading-[1.12] tracking-[-0.02em]">
            Your health journey, all in one secure place.
          </h1>
          <p className="mt-5 max-w-lg text-body-lg text-inverse-on-surface/75">
            Connect with trusted clinicians, manage consultations, and keep your
            care plan close at hand.
          </p>
        </div>

        <p className="relative text-sm text-inverse-on-surface/60">
          Private, secure, and designed around you.
        </p>
      </section>

      <section className="relative flex min-h-0 items-center justify-center overflow-y-auto py-8 sm:py-12 lg:bg-surface-container-low lg:py-6">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-56 rounded-full bg-primary-fixed/30 blur-2xl lg:hidden"
        />
        <div className="relative w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-3 font-semibold tracking-tight text-on-surface lg:hidden"
            aria-label="Serene Health home"
          >
            <span className="grid size-10 place-items-center rounded-md bg-primary text-xl text-on-primary">
              +
            </span>
            <span>Serene Health</span>
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}

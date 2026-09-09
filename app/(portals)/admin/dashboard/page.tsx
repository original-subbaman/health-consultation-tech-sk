export default function AdminDashboardPage() {
  return (
    <section className="flex w-full max-w-7xl flex-col gap-section-md">
      <header className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface md:font-headline-xl md:text-headline-xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
            Manage consultation requests, doctor accounts, and case assignments.
          </p>
        </div>
      </header>
    </section>
  );
}

import ConsultantCard from "@/components/consultants/consultant-card";
import { getConsultants } from "@/lib/data/consultant";
import { BadgeCheck, Search, UserPlus, UsersRound, X } from "lucide-react";
import Link from "next/link";

type ConsultantsPageProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

function ConsultantsSearchForm({ query }: { query?: string }) {
  return (
    <form
      action="/admin/consultants"
      className="flex flex-col gap-2 sm:flex-row"
    >
      <div className="relative min-w-0 flex-1 shadow-sm">
        <label htmlFor="consultant-search" className="sr-only">
          Search consultants by name
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
          aria-hidden="true"
        />
        <input
          id="consultant-search"
          name="query"
          type="search"
          defaultValue={query}
          placeholder="Search by consultant name..."
          className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-28 text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Search
        </button>
      </div>
      {query ? (
        <Link
          href="/admin/consultants"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <X className="size-4" aria-hidden="true" />
          Reset filter
        </Link>
      ) : null}
    </form>
  );
}

function NoConsultantsFound({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/25 bg-surface-container-lowest px-6 py-14 text-center shadow-sm">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-surface-container-high text-outline">
        <UsersRound className="size-8" aria-hidden="true" />
      </div>
      <h2 className="font-headline-md text-xl font-semibold text-on-surface">
        No consultants found
      </h2>
      <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
        {query
          ? `No consultant names match "${query}". Try a different search.`
          : "Consultants will appear here after they have been added."}
      </p>
      {query ? (
        <Link
          href="/admin/consultants"
          className="mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Clear search
        </Link>
      ) : null}
    </div>
  );
}

function HeaderSection() {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="font-label-sm text-xs font-medium uppercase tracking-wider text-outline">
            Network registry
          </span>
        </div>
        <h1 className="font-headline-lg text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          Consultants Directory
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant sm:text-base">
          Browse certified specialists across the clinical network.
        </p>
      </div>

      <Link
        href="/admin/add-consultant"
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <UserPlus className="size-5" aria-hidden="true" />
        Add Consultant
      </Link>
    </section>
  );
}

function ConsultantsCount({ count }: { count: number }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
      <p
        id="consultants-count"
        className="text-sm font-medium text-on-surface-variant"
      >
        Showing <span className="font-semibold text-on-surface">{count}</span>{" "}
        verified {count === 1 ? "specialist" : "specialists"}
      </p>
      <span className="flex items-center gap-1 text-xs font-medium text-outline">
        <BadgeCheck className="size-4" aria-hidden="true" />
        Credentialed providers
      </span>
    </div>
  );
}

export default async function ConsultantsPage({
  searchParams,
}: ConsultantsPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.query)
    ? params.query[0]?.trim()
    : params.query?.trim();
  const consultants = await getConsultants({ name: query, limit: 100 });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2">
      <HeaderSection />

      <ConsultantsSearchForm query={query} />

      <section aria-labelledby="consultants-count">
        <ConsultantsCount count={consultants.length} />
        {consultants.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {consultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        ) : (
          <NoConsultantsFound query={query} />
        )}
      </section>
    </main>
  );
}

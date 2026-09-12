"use client";

import { ArrowUpDown, RefreshCw, Search, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isRefreshing, startRefresh] = useTransition();

  function refreshRequests() {
    startRefresh(() => router.refresh());
  }

  return (
    <section
      aria-label="Consultation request filters"
      className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm"
    >
      <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
        <div className="relative max-w-xl flex-1">
          <label htmlFor="consultation-search" className="sr-only">
            Search consultation requests
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-outline"
            aria-hidden="true"
          />
          <input
            id="consultation-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search consultation requests by patient name, ID, or condition..."
            className="w-full rounded-xl bg-surface-container-low py-2.5 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-outline transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Clear search"
            >
              <XCircle className="size-[18px]" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 text-on-surface-variant">
            <ArrowUpDown className="size-[18px]" aria-hidden="true" />
            <label
              htmlFor="consultation-sort"
              className="font-label-sm text-label-sm font-medium"
            >
              Sort:
            </label>
            <select
              id="consultation-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="cursor-pointer bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none"
            >
              <option value="latest">Latest Requested</option>
              <option value="severity">Highest Severity</option>
              <option value="waiting">Longest Waiting</option>
            </select>
          </div>
          <button
            type="button"
            onClick={refreshRequests}
            disabled={isRefreshing}
            className="rounded-xl bg-surface-container-low p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            aria-label="Refresh consultation requests"
            title="Refresh list"
          >
            <RefreshCw
              className={`size-5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

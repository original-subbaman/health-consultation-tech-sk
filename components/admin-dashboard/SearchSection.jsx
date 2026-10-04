"use client";

import { Search, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import {
  adminConsultationOptionsSchema,
  adminConsultationStatusSchema,
} from "@/lib/validation/consultation";

export function QuerySearch({
  query,
  onQueryChange,
  label = "",
  placeholder = "",
}) {
  const inputId = useId();

  return (
    <div className="relative  flex-1">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-outline"
        aria-hidden="true"
      />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-surface-container-low py-2.5 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container focus:outline-none"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-outline transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Clear search"
        >
          <XCircle className="size-18px" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default function SearchSection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const doctor = searchParams.get("doctor") ?? "";
  const chiefComplaint = searchParams.get("chiefComplaint") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "desc";
  const urlStatuses = searchParams.getAll("status");
  const parsedStatuses = adminConsultationOptionsSchema.shape.status.safeParse(
    urlStatuses.length ? urlStatuses : undefined,
  );
  const statuses = parsedStatuses.success ? parsedStatuses.data : [];

  return (
    <SearchFilters
      key={JSON.stringify([doctor, chiefComplaint, sortBy, statuses])}
      pathname={pathname}
      searchParams={searchParams}
      initialDoctor={doctor}
      initialChiefComplaint={chiefComplaint}
      initialSortBy={sortBy}
      initialStatuses={statuses}
    />
  );
}

function SearchFilters({
  pathname,
  searchParams,
  initialDoctor,
  initialChiefComplaint,
  initialSortBy,
  initialStatuses,
}) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(initialDoctor);
  const [chiefComplaint, setChiefComplaint] = useState(initialChiefComplaint);
  const [sortBy, setSortBy] = useState(
    ["desc", "asc"].includes(initialSortBy) ? initialSortBy : "desc",
  );
  const [statuses, setStatuses] = useState(initialStatuses);
  const [isClearing, startClear] = useTransition();
  const [isApplying, startApply] = useTransition();

  function applyFilters(event) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    for (const [name, value] of Object.entries({
      doctor: doctor.trim(),
      chiefComplaint: chiefComplaint.trim(),
      sortBy,
    })) {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
    }

    params.delete("status");
    for (const status of statuses) {
      params.append("status", status);
    }
    params.delete("consultationPage"); // Reset to the first page.
    const queryString = params.toString();
    startApply(() => {
      router.replace(
        `${pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`,
        { scroll: false },
      );
    });
  }

  function clearFilters() {
    setDoctor("");
    setChiefComplaint("");
    setSortBy("desc");
    setStatuses([]);
    const params = new URLSearchParams(searchParams.toString());
    for (const name of [
      "doctor",
      "chiefComplaint",
      "submittedDate",
      "sortBy",
      "consultationPage",
      "status",
    ]) {
      params.delete(name);
    }
    const queryString = params.toString();
    startClear(() => {
      router.replace(
        `${pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`,
        { scroll: false },
      );
    });
  }

  return (
    <section
      aria-label="Consultation request filters"
      className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm"
    >
      <form
        onSubmit={applyFilters}
        className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center"
      >
        <QuerySearch
          query={chiefComplaint}
          onQueryChange={setChiefComplaint}
          label="Search by chief complaint"
          placeholder="Stomach ache, fever, headache, cough..."
        />

        {/* <QuerySearch
          query={doctor}
          onQueryChange={setDoctor}
          label="Search by consultant"
          placeholder="Name of your consulta"
        /> */}

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Select
            name="status"
            label="Status:"
            placeholder="All statuses"
            selectionMode="multiple"
            value={statuses}
            className="self-stretch"
            onChange={(value) => {
              const selected = value.filter((status) =>
                adminConsultationStatusSchema.options.includes(status),
              );
              setStatuses(selected);
            }}
            options={adminConsultationStatusSchema.options.map((status) => ({
              id: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            }))}
          />
          <Select
            name="sortBy"
            label="Sort:"
            value={sortBy}
            className="self-stretch"
            onChange={(value) => {
              setSortBy(value);
            }}
            options={[
              { id: "desc", label: "Latest First" },
              { id: "asc", label: "Oldest First" },
            ]}
          />
          <button
            type="submit"
            disabled={isApplying || isClearing}
            className="rounded-xl bg-primary px-3 py-2.5 font-label-sm text-label-sm text-on-primary disabled:opacity-50"
          >
            {isApplying ? "Applying..." : "Apply filters"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            disabled={isClearing || isApplying}
            className="rounded-xl bg-surface-container-low p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            aria-label="Clear consultation filters"
            title="Clear filters"
          >
            <XCircle className="size-5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

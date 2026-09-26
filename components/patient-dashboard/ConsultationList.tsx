import {
  getPatientConsultation,
  type PatientConsultationListItem,
  type PatientConsultationStatus,
} from "@/lib/data/consultation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const consultationStatuses: Array<{
  value: PatientConsultationStatus;
  label: string;
}> = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "completed", label: "Completed" },
];

export type ConsultationListFilters = {
  page?: number;
  doctorName?: string;
  submittedDate?: string;
  status?: PatientConsultationStatus;
};

type ConsultationListProps = {
  filters?: ConsultationListFilters;
};

function formatConsultationDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatConsultationTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function ConsultationCard({
  consultation,
}: {
  consultation: PatientConsultationListItem;
}) {
  const displayDate = consultation.submittedAt ?? consultation.createdAt;
  const dateLabel = consultation.submittedAt ? "Submitted" : "Created";

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-5 shadow-ambient sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-label-md text-label-md text-on-surface">
            {consultation.doctor?.fullName ?? "Doctor not assigned"}
          </h3>
          <span
            className={`rounded-full px-2.5 py-1 font-label-sm text-label-sm capitalize ${
              consultation.status === "submitted"
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {consultation.status}
          </span>
        </div>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          {consultation.chiefComplaint?.slice(0, 15)}
        </p>
      </div>
      <div className="flex flex-col sm:items-end">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {dateLabel}: {formatConsultationDate(displayDate)}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {formatConsultationTime(displayDate)}
        </span>
      </div>
    </article>
  );
}

function ConsultationFilters({
  filters,
}: {
  filters: ConsultationListFilters;
}) {
  return (
    <form
      action="/patient/dashboard#consultations"
      className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[minmax(12rem,1fr)_auto_auto_auto] lg:items-end"
      method="get"
    >
      <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
        Doctor name
        <input
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          defaultValue={filters.doctorName}
          name="doctor"
          placeholder="Search by name"
          type="search"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
        Submitted date
        <input
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          defaultValue={filters.submittedDate}
          name="submittedDate"
          type="date"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
        Status
        <select
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          defaultValue={filters.status ?? ""}
          name="status"
        >
          <option value="">All statuses</option>
          {consultationStatuses.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg bg-primary px-4 py-2 font-label-md text-label-md text-on-primary outline-none transition-colors hover:bg-primary-container focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
          type="submit"
        >
          Apply
        </button>
        <Link
          className="rounded-lg px-3 py-2 font-label-md text-label-md text-primary outline-none transition-colors hover:bg-primary-fixed-dim focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
          href="/patient/dashboard#consultations"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}

function getPaginationHref(page: number, filters: ConsultationListFilters) {
  const params = new URLSearchParams();

  params.set("consultationPage", String(page));

  if (filters.doctorName) {
    params.set("doctor", filters.doctorName);
  }

  if (filters.submittedDate) {
    params.set("submittedDate", filters.submittedDate);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return `/patient/dashboard?${params.toString()}#consultations`;
}

export default async function ConsultationList({
  filters = {},
}: ConsultationListProps) {
  const result = await getPatientConsultation({
    page: filters.page,
    pageSize: 10,
    doctorName: filters.doctorName,
    submittedDate: filters.submittedDate,
    status: filters.status,
  });

  return (
    <section className="w-full scroll-mt-6" id="consultations">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Your Consultations
        </h2>
        <ConsultationFilters filters={filters} />
      </div>

      {!result.success ? (
        <p
          className="rounded-lg border border-error/30 bg-error-container p-5 text-center text-body-md text-on-error-container"
          role="alert"
        >
          {result.message}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {result.consultations.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
              />
            ))}
            {result.consultations.length === 0 && (
              <p className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 text-center text-body-md text-on-surface-variant">
                No consultations match these filters.
              </p>
            )}
          </div>

          {result.pagination.totalPages > 1 && (
            <nav
              aria-label="Consultation pages"
              className="mt-5 flex items-center justify-between gap-4"
            >
              {result.pagination.page > 1 ? (
                <Link
                  className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label-md text-label-md text-on-surface outline-none transition-colors hover:bg-surface-container-high focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
                  href={getPaginationHref(result.pagination.page - 1, filters)}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  Previous
                </Link>
              ) : (
                <span />
              )}

              <span className="text-body-sm text-on-surface-variant">
                Page {result.pagination.page} of {result.pagination.totalPages}
              </span>

              {result.pagination.page < result.pagination.totalPages ? (
                <Link
                  className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label-md text-label-md text-on-surface outline-none transition-colors hover:bg-surface-container-high focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
                  href={getPaginationHref(result.pagination.page + 1, filters)}
                >
                  Next
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}

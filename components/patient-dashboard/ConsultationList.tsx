import {
  getPatientConsultations,
  type PatientConsultationListItem,
  type PatientConsultationStatus,
} from "@/lib/data/consultation";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";

export type ConsultationListFilters = {
  page?: number;
  chiefComplaint?: string;
  doctorName?: string;
  submittedDate?: string;
  status?: PatientConsultationStatus;
};

type ConsultationListProps = {
  filters?: ConsultationListFilters;
  basePath?: string;
  showViewMore?: boolean;
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
    <article
      className="flex flex-col gap-4 rounded-lg 
      border border-outline-variant bg-surface-container-lowest 
      p-5 shadow-ambient"
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <Link
          href={`/patient/consultations/${consultation.id}`}
          className={buttonStyles()}
        >
          View Details
        </Link>
        <Button
          variant="secondary"
          disabled
          aria-describedby={`summary-unavailable-${consultation.id}`}
        >
          <Download aria-hidden="true" className="size-4" />
          Download Summary
        </Button>
      </div>
    </article>
  );
}

function getPaginationHref(
  page: number,
  filters: ConsultationListFilters,
  basePath: string,
) {
  const params = new URLSearchParams();

  params.set("consultationPage", String(page));

  if (filters.chiefComplaint) {
    params.set("chiefComplaint", filters.chiefComplaint);
  }

  if (filters.doctorName) {
    params.set("doctor", filters.doctorName);
  }

  if (filters.submittedDate) {
    params.set("submittedDate", filters.submittedDate);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return `${basePath}?${params.toString()}#consultations`;
}

export default async function ConsultationList({
  filters = {},
  basePath = "/patient/dashboard",
  showViewMore = true,
}: ConsultationListProps) {
  const result = await getPatientConsultations({
    page: filters.page,
    pageSize: 10,
    chiefComplaint: filters.chiefComplaint,
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
        {showViewMore && (
          <Link href="/patient/consultations" className={buttonStyles()}>
            View More
          </Link>
        )}
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
                  className={buttonStyles({ variant: "secondary" })}
                  href={getPaginationHref(
                    result.pagination.page - 1,
                    filters,
                    basePath,
                  )}
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
                  className={buttonStyles({ variant: "secondary" })}
                  href={getPaginationHref(
                    result.pagination.page + 1,
                    filters,
                    basePath,
                  )}
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

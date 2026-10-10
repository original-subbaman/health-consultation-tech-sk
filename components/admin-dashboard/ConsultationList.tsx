import { getAdminConsultations } from "@/lib/data/consultation";
import AnalyzeConsultationButton from "@/components/admin-dashboard/AnalyzeConsultationButton";
import ConsultationRowLink from "@/components/admin-dashboard/ConsultationRowLink";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { GetAdminConsultationOptions } from "@/lib/validation/consultation";
import { capitalize } from "@/lib/helper";

type ConsultationRowProps = {
  id: string;
  submittedAt: string;
  patientName: string;
  doctorAssigned: string;
  chiefComplaint: string;
  status: string;
  isAnalyzed: boolean;
};

function ConsultationRow(
  row: ConsultationRowProps & { secondaryAction: boolean },
) {
  return (
    <ConsultationRowLink
      href={`/admin/consultation/${row.id}`}
      patientName={row.patientName}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Link href={`/admin/consultation/${row.id}`} className="inline-flex min-h-11 items-center rounded-md font-label-md text-label-md font-semibold leading-tight text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
              {row.patientName}
            </Link>
          </div>
        </div>
      </td>
      <td className="max-w-xs px-4 py-4">
        <div className="flex flex-col">
          <span className="truncate font-label-md text-label-md font-medium text-on-surface">
            {row.chiefComplaint}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">{row.doctorAssigned}</td>
      <td className="px-4 py-4">{row.status}</td>
      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex flex-col">
          <span className="font-label-md text-label-md font-medium text-on-surface">
            {row.submittedAt}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <AnalyzeConsultationButton
            consultationId={row.id}
            patientName={row.patientName}
            secondaryAction={row.secondaryAction}
            isAnalyzed={row.isAnalyzed}
          />
        </div>
      </td>
    </ConsultationRowLink>
  );
}

type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

function ConsultationPagination({
  pagination,
  rowCount,
  queryString,
}: {
  pagination: Pagination;
  rowCount: number;
  queryString: string;
}) {
  const { page, pageSize, totalCount, totalPages } = pagination;
  const start = rowCount ? (page - 1) * pageSize + 1 : 0;
  const end = rowCount ? start + rowCount - 1 : 0;
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index,
  );
  function href(target: number) {
    const params = new URLSearchParams(queryString);
    params.set("consultationPage", String(target));
    return `/admin/dashboard?${params.toString()}#consultations`;
  }
  const linkClass =
    "rounded-lg bg-surface-container px-3 py-1 text-on-surface hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <div className="flex flex-col items-center justify-between gap-3 bg-surface-container-low p-4 font-label-sm text-label-sm text-on-surface-variant sm:flex-row">
      <span>
        Showing {start} to {end} of {totalCount} consultations
      </span>
      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-center gap-1"
          aria-label="Consultation pages"
        >
          {page > 1 ? (
            <Link href={href(page - 1)} className={linkClass}>
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={`${linkClass} opacity-50`}>
              Previous
            </span>
          )}
          {pages.map((target) => (
            <Link
              key={target}
              href={href(target)}
              aria-label={`Page ${target}`}
              aria-current={target === page ? "page" : undefined}
              className={
                target === page
                  ? "rounded-lg bg-primary px-3 py-1 font-medium text-on-primary"
                  : linkClass
              }
            >
              {target}
            </Link>
          ))}
          {page < totalPages ? (
            <Link href={href(page + 1)} className={linkClass}>
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className={`${linkClass} opacity-50`}>
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}

export default async function ConsultationList({
  filters = {},
  queryString = "",
}: {
  filters?: GetAdminConsultationOptions;
  queryString?: string;
}) {
  const consultations = await getAdminConsultations(filters);
  if (
    !consultations.success ||
    !consultations.consultations ||
    !consultations.pagination
  ) {
    return (
      <p
        role="alert"
        className="rounded-lg bg-error-container p-4 text-on-error-container"
      >
        {consultations.message ?? "Consultations could not be loaded"}
      </p>
    );
  }
  const rows = consultations.consultations;
  const pagination = consultations.pagination;
  const lastPage = Math.max(1, pagination.totalPages);
  if (pagination.page > lastPage) {
    const params = new URLSearchParams(queryString);
    params.set("consultationPage", String(lastPage));
    redirect(`/admin/dashboard?${params.toString()}#consultations`);
  }

  return (
    <div
      id="consultations"
      className="scroll-mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <th scope="col" className="px-5 py-3">
                Patient Details
              </th>
              <th scope="col" className="px-4 py-3">
                Chief Complaint
              </th>
              <th scope="col" className="px-4 py-3">
                Doctor Assigned
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Submitted At
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-5 text-center text-on-surface-variant"
                >
                  No consultations found.
                </td>
              </tr>
            )}
            {rows?.map((consultation) => (
              <ConsultationRow
                key={consultation.id}
                id={consultation.id}
                patientName={consultation.patientName ?? "Hidden"}
                doctorAssigned={consultation.doctor?.fullName ?? "Not assigned"}
                chiefComplaint={consultation.chiefComplaint ?? "Not provided"}
                status={
                  consultation.status
                    ? capitalize(consultation.status)
                    : "Not Available"
                }
                submittedAt={
                  consultation.submittedAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      }).format(new Date(consultation.submittedAt)) + " IST"
                    : "Not submitted"
                }
                secondaryAction={Boolean(consultation.doctor)}
                isAnalyzed={consultation.isAnalyzed}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ConsultationPagination
        pagination={pagination}
        rowCount={rows.length}
        queryString={queryString}
      />
    </div>
  );
}

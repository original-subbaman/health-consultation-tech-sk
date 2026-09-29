import ConsultationList, {
  type ConsultationListFilters,
} from "@/components/patient-dashboard/ConsultationList";
import type { PatientConsultationStatus } from "@/lib/data/consultation";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";

const consultationStatuses: Array<{
  value: PatientConsultationStatus;
  label: string;
}> = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "completed", label: "Completed" },
];

function ConsultationFilters({
  filters,
}: {
  filters: ConsultationListFilters;
}) {
  return (
    <form
      action="/patient/consultations#consultations"
      className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto] xl:items-end"
      method="get"
    >
      <label className="flex min-w-0 flex-col gap-1 text-label-sm text-on-surface-variant">
        Chief complaint
        <input
          className="min-w-0 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
          defaultValue={filters.chiefComplaint}
          name="chiefComplaint"
          placeholder="Search by chief complaint"
          type="search"
        />
      </label>
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
        <Button type="submit">
          Apply
        </Button>
        <Link
          className={buttonStyles({ variant: "ghost" })}
          href="/patient/consultations#consultations"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PatientConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const page = Number(getSingleSearchParam(query.consultationPage));
  const status = getSingleSearchParam(query.status);
  const filters: ConsultationListFilters = {
    page: Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1,
    chiefComplaint: getSingleSearchParam(query.chiefComplaint),
    doctorName: getSingleSearchParam(query.doctor),
    submittedDate: getSingleSearchParam(query.submittedDate),
    status:
      status === "draft" || status === "submitted" || status === "completed"
        ? status
        : undefined,
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-label-sm text-label-sm text-tertiary 
          rounded-xl bg-gray-300 px-2 py-1 "
          >
            Patient Records Vault
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Consultation History &amp; Care Records
        </h1>
        <p className="font-body-lg text-body-lg text-tertiary mt-1.5 max-w-3xl">
          Review past telehealth appointments, diagnostic summaries, clinician
          notes, and care plans.
        </p>
      </div>
      <ConsultationFilters key={JSON.stringify(filters)} filters={filters} />
      <ConsultationList
        filters={filters}
        basePath="/patient/consultations"
        showViewMore={false}
      />
    </div>
  );
}

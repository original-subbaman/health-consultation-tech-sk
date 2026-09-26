import GetStartedCard from "@/components/patient-dashboard/GetStartedCard";
import ConsultationList from "@/components/patient-dashboard/ConsultationList";
import { getPatientProfile } from "@/lib/data/patient";
import { getSalutation } from "@/lib/helper";
import ActiveConsultationCard from "@/components/patient-dashboard/ActiveConsultationCard";
import type { PatientConsultationStatus } from "@/lib/data/consultation";

type PatientDashboardSearchParams = {
  consultationPage?: string | string[];
  doctor?: string | string[];
  submittedDate?: string | string[];
  status?: string | string[];
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getConsultationStatus(
  value: string | undefined,
): PatientConsultationStatus | undefined {
  return value === "draft" || value === "submitted" || value === "completed"
    ? value
    : undefined;
}

export default async function PatientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<PatientDashboardSearchParams>;
}) {
  const user = await getPatientProfile();
  const query = await searchParams;
  const page = Number(getSingleSearchParam(query.consultationPage));
  const doctorName = getSingleSearchParam(query.doctor);
  const submittedDate = getSingleSearchParam(query.submittedDate);
  const status = getConsultationStatus(getSingleSearchParam(query.status));

  return (
    <section className="flex flex-col items-start gap-4 pt-6">
      <div>
        <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface">
          {getSalutation()}, {user.fullName}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Here is your health summary for today.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <section className="h-full lg:col-span-8">
          <GetStartedCard />
        </section>
        <aside className="h-full lg:col-span-4">
          <ActiveConsultationCard />
        </aside>
      </div>
      <ConsultationList
        filters={{
          page: Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1,
          doctorName,
          submittedDate,
          status,
        }}
      />
    </section>
  );
}

import PatientProfileForm from "@/components/patient-profile/PatientProfileForm";
import { getPatientProfile } from "@/lib/data/patient";

export default async function PatientProfilePage() {
  const patient = await getPatientProfile();

  return (
    <section className="flex w-full max-w-7xl flex-col gap-section-md">
      <header className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface md:font-headline-xl md:text-headline-xl">
            Patient Profile
          </h1>
          <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
            Manage your personal information and health metrics.
          </p>
        </div>
      </header>

      <PatientProfileForm patient={patient} />
    </section>
  );
}

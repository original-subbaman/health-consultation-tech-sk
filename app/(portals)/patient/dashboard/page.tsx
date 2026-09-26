import GetStartedCard from "@/components/patient-dashboard/GetStartedCard";
import StatCard from "@/components/patient-dashboard/StatCard";
import ConsultationList from "@/components/patient-dashboard/ConsultationList";
import { getPatientProfile } from "@/lib/data/patient";
import { HeartPulse, Ruler, VenusAndMars, Weight } from "lucide-react";
import { getSalutation } from "@/lib/helper";
import ActiveConsultationCard from "@/components/patient-dashboard/ActiveConsultationCard";

export default async function PatientDashboardPage() {
  const user = await getPatientProfile();

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
      <ConsultationList />
    </section>
  );
}

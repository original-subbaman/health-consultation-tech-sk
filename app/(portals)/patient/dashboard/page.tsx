import GetStartedCard from "@/components/patient-dashboard/GetStartedCard";
import StatCard from "@/components/patient-dashboard/StatCard";
import ConsultationList from "@/components/patient-dashboard/ConsultationList";
import { getPatientProfile } from "@/lib/data/patient";
import { HeartPulse, Ruler, VenusAndMars, Weight } from "lucide-react";
import { getSalutation } from "@/lib/helper";

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
          <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-2">
            <StatCard
              icon={<Weight aria-hidden="true" className="size-5" />}
              label="Weight"
              value={user.weight ?? "--"}
              unit="kg"
            />
            <StatCard
              icon={<Ruler aria-hidden="true" className="size-5" />}
              label="Height"
              value={user.height ?? "--"}
              unit="cm"
            />
            <StatCard
              icon={<VenusAndMars aria-hidden="true" className="size-5" />}
              label="Gender"
              value={
                user.gender
                  ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                  : "--"
              }
            />
            <StatCard
              icon={<HeartPulse aria-hidden="true" className="size-5" />}
              label="Blood Pressure"
              value="--/--"
              unit="mmHg"
              status="Take On: 13/09/2023"
            />
          </div>
        </aside>
      </div>
      <ConsultationList />
    </section>
  );
}

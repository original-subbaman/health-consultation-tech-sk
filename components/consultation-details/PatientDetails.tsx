import AssignDoctorDialog from "@/components/consultation/AssignDoctorDialog";
import type { ComponentProps } from "react";
import { calculateAge, capitalize } from "@/lib/helper";
import { Calendar, Stethoscope, Video } from "lucide-react";

type PatientDetailsProps = ComponentProps<typeof AssignDoctorDialog> & {
  patientName: string | null | undefined;
  dob: string | null | undefined;
  assignedDoctor: string | null | undefined;
  status: string | null | undefined;
};

export default function PatientDetails({
  patientName,
  dob,
  assignedDoctor,
  status,
  doctors,
  error,
  assignDoctor,
  consultationId,
}: PatientDetailsProps) {
  const age = calculateAge(dob);

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 pl-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
              {patientName || "Patient name not recorded"}
            </h1>
            {status && (
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Status: {status ? capitalize(status) : "Unknown"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body-md text-body-md text-tertiary">
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {dob ? `DOB ${dob}` : "Date of birth not recorded"}
              {age !== null && ` (${age} ${age === 1 ? "year" : "years"})`}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Video className="size-4" />
              Telehealth Encounter
            </span>
            <span>•</span>
            <span className="text-on-surface font-medium flex items-center gap-1">
              <Stethoscope className="size-4" />
              {assignedDoctor || "Not assigned"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto xl:justify-end">
        <AssignDoctorDialog
          doctors={doctors}
          error={error}
          assignDoctor={assignDoctor}
          consultationId={consultationId}
        />
      </div>
    </section>
  );
}

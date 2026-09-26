import { getActiveConsultation } from "@/lib/data/consultation";
import { Stethoscope } from "lucide-react";
import ActiveConsultationContent from "./ActiveConsultationContent";

async function ActiveConsultationCard() {
  const activeConsultation = await getActiveConsultation();
  const isActiveConsultation = activeConsultation.success;

  return (
    <div
      className="flex h-full min-h-56 flex-col items-start justify-between gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-5 shadow-ambient transition-shadow duration-300 hover:shadow-ambient-hover"
    >
      {isActiveConsultation ? (
        <ActiveConsultationContent
          doctorName="Dr. Mitchell"
          submittedOn="25/09/2025"
        />
      ) : (
        <NoActiveConsultation />
      )}
    </div>
  );
}

function NoActiveConsultation() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-3 py-4 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-primary-fixed-dim text-primary">
        <Stethoscope aria-hidden="true" className="size-6" />
      </span>
      <h2 className="font-headline-md text-headline-md text-on-surface">
        No active consultation
      </h2>
      <p className="mt-2 max-w-xs font-body-md text-body-md text-on-surface-variant">
        Your active consultation will appear here once a doctor has been
        assigned.
      </p>
    </div>
  );
}

export default ActiveConsultationCard;

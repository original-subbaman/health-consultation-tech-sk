import { SPECIALTIES } from "@/lib/constants";
import type { ConsultantProfile } from "@/lib/data/consultant";
import { Stethoscope } from "lucide-react";

type ConsultantCardProps = {
  consultant: ConsultantProfile;
};

function findSpecialtyName(specialtyId: string | null | undefined) {
  const specialty = SPECIALTIES.find(({ id }) => id === specialtyId);
  return specialty?.name ?? "Specialty not specified";
}

export default function ConsultantCard({
  consultant,
}: ConsultantCardProps) {
  return (
    <article className="group flex items-start gap-4 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Stethoscope className="size-6" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate font-headline-md text-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
          {consultant.fullName}
        </h2>
        <span className="mb-2 inline-flex max-w-full truncate text-xs italic text-gray-500">
          {consultant.email || "Email not specified"}
        </span>
        <span className="mt-1 inline-flex max-w-full truncate rounded-lg bg-surface-container px-2.5 py-1 text-xs font-medium text-on-surface-variant">
          {findSpecialtyName(consultant.specialty)}
        </span>
      </div>
    </article>
  );
}

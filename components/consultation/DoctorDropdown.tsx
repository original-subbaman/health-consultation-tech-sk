"use client";

import { Select } from "@/components/ui/select";

export type DoctorOption = {
  id: string;
  label: string;
  specialty: string | null;
};

export default function DoctorDropdown({
  doctors,
}: {
  doctors: DoctorOption[];
}) {
  return (
    <Select
      name="doctorId"
      label="Doctor"
      options={doctors}
      placeholder="Select a doctor"
      isDisabled={doctors.length === 0}
      className="flex-col items-stretch gap-2"
      buttonClassName="min-h-11 w-full justify-between text-left"
      listBoxClassName="max-h-64 overflow-y-auto"
      renderOption={(doctor) => (
        <div>
          <p>{doctor.label}</p>
          {doctor.specialty && (
            <p className="text-xs text-on-surface-variant">{doctor.specialty}</p>
          )}
        </div>
      )}
    />
  );
}

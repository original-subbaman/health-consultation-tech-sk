import type { ConsultationDetails } from "@/lib/data/consultation";
import ConsultationSection from "./ConsultationSection";
import DetailField from "./DetailField";
import { HeartPulse } from "lucide-react";

export default function PatientInformationSection({
  measurement,
}: {
  measurement: ConsultationDetails["patient_measurements"][number] | undefined;
}) {
  const patientInformation = [
    {
      label: "Systolic blood pressure",
      value: measurement?.systolic_bp,
      unit: "mmHg",
    },
    {
      label: "Diastolic blood pressure",
      value: measurement?.diastolic_bp,
      unit: "mmHg",
    },
    {
      label: "Measurement date",
      value: measurement?.measured_at?.slice(0, 10),
      unit: "",
    },
    {
      label: "Current weight",
      value: measurement?.weight_kg,
      unit: "kg",
    },
  ];

  return (
    <ConsultationSection
      title="Patient Information"
      subtitle="Vitals and measurements recorded for this consultation"
      icon={HeartPulse}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {patientInformation.map(({ label, value, unit }) => (
          <DetailField key={label} label={label} value={value} unit={unit} emphasis />
        ))}
      </dl>
    </ConsultationSection>
  );
}

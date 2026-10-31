import type { ConsultationDetails } from "@/lib/data/consultation";
import ConsultationSection from "./ConsultationSection";
import DetailField from "./DetailField";
import { ClipboardList } from "lucide-react";
import { formatUnderscoreText } from "@/lib/helper";

export default function MedicalHistorySection({
  history,
  medications,
  allergies,
  documents,
}: {
  history: ConsultationDetails["patient_medical_history"];
  medications: ConsultationDetails["patient_medications"];
  allergies: ConsultationDetails["patient_allergies"];
  documents: ConsultationDetails["documents"];
}) {
  const medicalHistory = [
    {
      label: "Existing conditions",
      values: history?.existing_conditions,
    },
    {
      label: "Current or recent symptoms",
      values: history?.current_health_issues,
    },
  ];

  return (
    <ConsultationSection
      title="Medical History"
      subtitle="Conditions, recent symptoms, medications, and allergies"
      icon={ClipboardList}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {medicalHistory.map(({ label, values }) => (
          <DetailField
            key={label}
            label={label}
            value={values?.map(formatUnderscoreText).join(", ")}
          />
        ))}
      </dl>
      <div className="space-y-3">
        <h3 className="font-semibold text-on-surface">Medications</h3>
        {medications.length > 0 ? (
          <ul className="space-y-3">
            {medications.map((medication) => (
              <li key={medication.id} className="rounded-lg bg-surface-container-low p-4">
                <p className="wrap-break-words font-medium text-on-surface">
                  {medication.medication_name}
                </p>
                <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  {([
                    ["Strength", medication.strength],
                    ["Quantity", medication.quantity],
                    ["Frequency", medication.frequency],
                  ] as const).map(([label, value]) => (
                    <DetailField key={label} label={label} value={value} variant="plain" />
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-variant">No medications recorded.</p>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-on-surface">Allergies</h3>
        {allergies.length > 0 ? (
          <ul className="space-y-3">
            {allergies.map((allergy) => (
              <li key={allergy.id} className="rounded-lg bg-surface-container-low p-4">
                <p className="wrap-break-words font-medium text-on-surface">
                  {allergy.allergy_name}
                </p>
                <dl className="mt-2 text-sm">
                  <DetailField label="Details" value={allergy.details} variant="plain" />
                </dl>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-variant">No allergies recorded.</p>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-on-surface">Medical records</h3>
        {documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((document) => (
              <li key={document.id} className="wrap-break-words rounded-lg bg-surface-container-low p-3 text-sm text-on-surface">
                {document.original_filename}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-variant">No medical records uploaded.</p>
        )}
      </div>
    </ConsultationSection>
  );
}

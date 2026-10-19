import type { ConsultationDetails } from "@/lib/data/consultation";
import ConsultationSection from "./ConsultationSection";
import DetailField from "./DetailField";
import { CloudSun } from "lucide-react";
import { formatUnderscoreText } from "@/lib/helper";

export default function BaselineSnapshotSection({
  intake,
}: {
  intake: ConsultationDetails["consultation_intakes"];
}) {
  const emergencySymptomLabels: Record<string, string> = {
    chest_pain: "Severe chest pain or pressure",
    breathing: "Difficult or labored breathing",
    weakness: "Sudden weakness or numbness on one side",
    speech: "Trouble speaking or acute confusion",
    bleeding: "Severe uncontrollable bleeding",
    consciousness: "Loss of consciousness or fainting",
    allergy: "Severe allergic reaction (throat swelling)",
    none: "None of these apply",
  };
  const baselineSnapshot = [
    {
      label: "Urgent triage symptoms",
      value: intake?.emergency_symptoms
        ?.map((symptom) => emergencySymptomLabels[symptom] ?? formatUnderscoreText(symptom))
        .join(", "),
      fullWidth: true,
    },
    {
      label: "Other urgent symptoms",
      value: intake?.emergency_symptoms_other,
      fullWidth: true,
    },
    {
      label: "Chief complaint",
      value: intake?.chief_complaint,
      fullWidth: true,
    },
    {
      label: "Primary concern",
      value: intake?.primary_concern,
      fullWidth: true,
    },
    {
      label: "Consultation goals",
      value: intake?.consultation_goals?.join(", "),
      fullWidth: true,
    },
    {
      label: "Other consultation goal",
      value: intake?.consultation_goal_other,
      fullWidth: true,
    },
    {
      label: "Health compared to usual",
      value: intake?.general_health_today,
    },
    {
      label: "Symptom onset",
      value: intake?.symptom_onset,
    },
    {
      label: "Symptoms and factors",
      value: intake?.current_symptoms?.join(", "),
      fullWidth: true,
    },
    {
      label: "Other symptoms",
      value: intake?.current_symptoms_other,
      fullWidth: true,
    },
    {
      label: "Discomfort / pain severity",
      value: intake?.discomfort_severity != null
        ? `${intake.discomfort_severity} / 10`
        : null,
    },
  ];

  return (
    <ConsultationSection
      title="Baseline Snapshot"
      subtitle="Chief complaint, consultation goals, and current health"
      icon={CloudSun}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {baselineSnapshot.map(({ label, value, fullWidth }) => (
          <DetailField key={label} label={label} value={value} fullWidth={fullWidth} />
        ))}
      </dl>
    </ConsultationSection>
  );
}

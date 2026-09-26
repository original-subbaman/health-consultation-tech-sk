"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { LoaderCircle, Send } from "lucide-react";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "./FormControls";
import FormSectionHeader from "./FormSectionHeader";

const valueLabels: Record<string, string> = {
  current: "Current",
  former: "Former",
  never: "Never",
  no: "No",
  none: "None",
  occasional: "Occasional",
  regular: "Regular",
  yes: "Yes",
};

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return (
    valueLabels[value] ??
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

function formatList(values: string[]) {
  return values.length > 0
    ? values.map((value) => formatValue(value)).join(", ")
    : "None selected";
}

function ReviewSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface-container-low/60 p-4 sm:p-5">
      <h2 className="font-headline-md text-lg text-on-surface">{title}</h2>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {children}
      </dl>
    </section>
  );
}

function ReviewValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-label-sm font-semibold text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-1 break-words text-body-md text-on-surface">{value}</dd>
    </div>
  );
}

export default function ReviewConsultation({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: () => void | Promise<void>;
}) {
  const { getValues } = useFormContext<ConsultationFormValues>();
  const values = getValues();
  const { baseline, currentIssueTrend, medicalHistory, patient } = values;
  const { lifestyle } = medicalHistory;
  const bloodPressure =
    patient.systolicBp === null && patient.diastolicBp === null
      ? "Not provided"
      : `${patient.systolicBp ?? "–"}/${patient.diastolicBp ?? "–"} mmHg`;

  return (
    <FormSection>
      <FormSectionHeader
        heading="Review your consultation"
        subheading="Final review"
        helper="Check the information below before submitting it for clinical review."
      />

      <ReviewSection title="Patient vitals">
        <ReviewValue label="Blood pressure" value={bloodPressure} />
        <ReviewValue
          label="Weight"
          value={
            patient.weightKg === null
              ? "Not provided"
              : `${patient.weightKg} kg`
          }
        />
        <ReviewValue
          label="Measurement date"
          value={formatValue(patient.measuredAt)}
        />
      </ReviewSection>

      <ReviewSection title="Baseline snapshot">
        <ReviewValue label="Urgent symptoms" value={formatList(baseline.redFlags)} />
        <ReviewValue
          label="Other urgent symptoms"
          value={formatValue(baseline.redFlagsOther)}
        />
        <ReviewValue
          label="Chief complaint"
          value={formatValue(baseline.chiefComplaint)}
        />
        <ReviewValue
          label="Primary concern"
          value={formatValue(baseline.primaryConcern)}
        />
        <ReviewValue label="Goals" value={formatList(baseline.goals)} />
        <ReviewValue
          label="Other goal"
          value={formatValue(baseline.goalsOther)}
        />
        <ReviewValue
          label="Usual health"
          value={formatValue(baseline.usualHealth)}
        />
        <ReviewValue
          label="Current symptoms"
          value={formatList(baseline.symptoms)}
        />
        <ReviewValue
          label="Other symptoms"
          value={formatValue(baseline.symptomsOther)}
        />
        <ReviewValue label="Onset" value={formatValue(baseline.onset)} />
        <ReviewValue
          label="Discomfort severity"
          value={
            baseline.pain === null ? "Not provided" : `${baseline.pain}/10`
          }
        />
      </ReviewSection>

      <ReviewSection title="Symptoms and trends">
        <ReviewValue
          label="Current trend"
          value={formatValue(currentIssueTrend.trend)}
        />
        <ReviewValue
          label="Speed of change"
          value={formatValue(currentIssueTrend.speedOfChange)}
        />
        <ReviewValue
          label="Longitudinal trend"
          value={formatValue(currentIssueTrend.longitudinalTrend)}
        />
        <ReviewValue
          label="Red-flag symptoms"
          value={formatList(currentIssueTrend.redFlagSymptoms)}
        />
      </ReviewSection>

      <ReviewSection title="Medical history">
        <ReviewValue
          label="Existing conditions"
          value={formatList(medicalHistory.conditions)}
        />
        <ReviewValue
          label="Recent symptoms"
          value={formatList(medicalHistory.recentSymptoms)}
        />
        <ReviewValue
          label="Medications"
          value={
            medicalHistory.medications.length > 0
              ? medicalHistory.medications
                  .map((medication) =>
                    [
                      medication.medicationName,
                      medication.strength,
                      medication.quantity,
                      medication.frequency,
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  )
                  .join(", ")
              : "None added"
          }
        />
        <ReviewValue
          label="Allergies"
          value={
            medicalHistory.allergies.length > 0
              ? medicalHistory.allergies
                  .map((allergy) =>
                    [allergy.allergyName, allergy.details]
                      .filter(Boolean)
                      .join(" · "),
                  )
                  .join(", ")
              : "None added"
          }
        />
        <ReviewValue
          label="Selected medical record"
          value={medicalHistory.medicalRecords[0]?.name ?? "None selected"}
        />
      </ReviewSection>

      <ReviewSection title="Lifestyle assessment">
        <ReviewValue
          label="Recent significant weight change"
          value={formatValue(lifestyle.recentWeightChange)}
        />
        <ReviewValue label="Smoking" value={formatValue(lifestyle.smoking)} />
        <ReviewValue label="Alcohol" value={formatValue(lifestyle.alcohol)} />
        <ReviewValue
          label="Additional health information"
          value={formatValue(lifestyle.additionalNotes)}
        />
      </ReviewSection>

      <button
        aria-busy={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-label-md font-bold tracking-wide text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:self-end sm:w-auto"
        disabled={isSubmitting}
        onClick={onSubmit}
        type="button"
      >
        {isSubmitting ? "Submitting..." : "Submit consultation"}
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="size-5" />
        )}
      </button>
    </FormSection>
  );
}

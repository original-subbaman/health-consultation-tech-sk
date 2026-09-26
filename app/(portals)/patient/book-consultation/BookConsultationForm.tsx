"use client";

import BaselineHealthSnapshot from "@/components/book-consultation/BaselineHealthSnapshot";
import CurrentIssueTrend from "@/components/book-consultation/CurrentIssueTrend";
import MedicalHistory from "@/components/book-consultation/MedicalHistory";
import {
  consultationFormDefaultValues,
  type ConsultationFormValues,
} from "@/components/book-consultation/consultation-form";
import PatientVitals from "@/components/book-consultation/PatientVitals";
import { useConsultationStepSavers } from "@/hooks/useConsultationStepSavers";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  LoaderCircle,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { FieldPath, FormProvider, useForm } from "react-hook-form";
import { GetConsultationFormValuesResult } from "@/lib/data/consultation";
import { useSearchParams } from "next/navigation";
import LifestyleSignals from "@/components/book-consultation/LifestyleSignals";

const steps = [
  ["Patient Information", "Patient Vitals & Measurements"],
  ["Baseline Snapshot", "Current chief complaint"],
  ["Symptoms & Trends", "Progression metrics"],
  ["Medical History", "Meds & lifestyle"],
  ["Review & Consent", "Clinician match"],
];

const stepFields: Partial<Record<number, FieldPath<ConsultationFormValues>[]>> =
  {
    1: [
      "patient.systolicBp",
      "patient.diastolicBp",
      "patient.measuredAt",
      "patient.weightKg",
    ],
    2: [
      "baseline.redFlags",
      "baseline.redFlagsOther",
      "baseline.chiefComplaint",
      "baseline.primaryConcern",
      "baseline.goals",
      "baseline.goalsOther",
      "baseline.usualHealth",
      "baseline.symptoms",
      "baseline.symptomsOther",
      "baseline.onset",
      "baseline.pain",
    ],
    3: [
      "currentIssueTrend.trend",
      "currentIssueTrend.speedOfChange",
      "currentIssueTrend.longitudinalTrend",
      "currentIssueTrend.redFlagSymptoms",
    ],
    4: [
      "medicalHistory.conditions",
      "medicalHistory.recentSymptoms",
      "medicalHistory.medications",
      "medicalHistory.allergies",
    ],
  };

function HeadingSection({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary-container/15 px-2.5 py-0.5 text-label-sm font-semibold text-primary">
            Step {currentStep} of 5 • In focus
          </span>
        </div>
        <h1 className="font-headline-md text-headline-md tracking-tight text-on-surface">
          Problem Oriented Medical Record Intake & Triage
        </h1>
      </div>

      <div className="flex min-w-60 items-center gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between text-label-sm">
            <span className="font-medium text-on-surface-variant">
              Session progress
            </span>
            <span className="font-bold text-primary">45%</span>
          </div>
          <div
            aria-label="Session progress: 45%"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={45}
            className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
            role="progressbar"
          >
            <div className="h-full w-[45%] rounded-full bg-primary" />
          </div>
        </div>
        <button
          className="hidden items-center gap-1 rounded-lg bg-surface-container px-3 py-1.5 text-label-sm text-on-surface-variant transition-colors hover:text-on-surface lg:inline-flex"
          type="button"
        >
          <CircleHelp aria-hidden="true" className="size-4" />
          Intake guide
        </button>
      </div>
    </div>
  );
}

function ConsultationStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3 lg:grid-cols-5">
      {steps.map(([title, subtitle], index) => {
        const complete = index === 0;
        const active = index === currentStep - 1;

        return (
          <li
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-3 rounded-lg p-2.5 ${
              active
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-low/60 text-on-surface"
            } ${index === 3 ? "hidden sm:flex" : ""} ${index === 4 ? "hidden lg:flex" : ""}`}
            key={title}
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full ${active ? "bg-on-primary text-primary" : complete ? "bg-primary text-on-primary" : "bg-surface-container-highest text-tertiary"}`}
            >
              {complete ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <span className="text-label-md font-bold">{index + 1}</span>
              )}
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate text-label-sm font-semibold ${active ? "text-on-primary" : complete ? "text-primary" : "text-on-surface"}`}
              >
                {index + 1}. {title}
              </span>
              <span
                className={`block truncate text-label-sm ${active ? "text-on-primary-container" : "text-outline"}`}
              >
                {subtitle}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const STEP_PARAMS = [
  "patientVital",
  "intakes",
  "symptomsTrends",
  "history",
  "lifestyle",
  "review",
] as const;

export default function BookConsultationForm({
  consultationId,
  formValues,
}: {
  consultationId: string;
  formValues: GetConsultationFormValuesResult;
}) {
  const searchParams = useSearchParams();
  const stepIndex = STEP_PARAMS.findIndex(
    (step) => step === searchParams.get("step"),
  );
  const currentStep = stepIndex === -1 ? 1 : stepIndex + 1;
  const form = useForm<ConsultationFormValues>({
    defaultValues: formValues.success
      ? formValues.values
      : consultationFormDefaultValues,
    mode: "onBlur",
    shouldUnregister: false,
  });
  const { isSaving, saveError, saveStep } = useConsultationStepSavers({
    consultationId,
    getValues: form.getValues,
    setValue: form.setValue,
  });

  const navigateToStep = useCallback(
    (nextStep: number) => {
      const normalizedStep = Math.min(
        STEP_PARAMS.length,
        Math.max(1, nextStep),
      );
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", STEP_PARAMS[normalizedStep - 1]);
      window.history.pushState(null, "", `?${params.toString()}`);
    },
    [searchParams],
  );

  useEffect(() => {
    if (stepIndex !== -1) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("step", STEP_PARAMS[0]);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchParams, stepIndex]);

  function handlePreviousStep() {
    navigateToStep(currentStep - 1);
  }

  async function handleNextStep() {
    if (isSaving) {
      return;
    }

    const fields = stepFields[currentStep];
    console.log("🚀 ~ handleNextStep ~ fields:", fields);
    const isStepValid = fields
      ? await form.trigger(fields, { shouldFocus: true })
      : true;
    console.log("🚀 ~ handleNextStep ~ isStepValid:", isStepValid);

    if (!isStepValid) {
      return;
    }

    const didSave = await saveStep(currentStep);

    if (!didSave) {
      return;
    }

    navigateToStep(currentStep + 1);
  }
  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-8">
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5">
            <HeadingSection currentStep={currentStep} />
            <ConsultationStepper currentStep={currentStep} />
          </div>
        </section>

        <div className="flex flex-col gap-8 lg:col-span-8">
          {currentStep === 1 && <PatientVitals />}
          {currentStep === 2 && <BaselineHealthSnapshot />}
          {currentStep === 3 && <CurrentIssueTrend />}
          {currentStep === 4 && <MedicalHistory />}
          {currentStep === 5 && <LifestyleSignals />}

          <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
            <NavigationArrowButton
              disabled={isSaving}
              label="Previous Step"
              direction="left"
              onClick={handlePreviousStep}
              type="button"
            />

            <NavigationArrowButton
              label="Next Step"
              direction="right"
              isLoading={isSaving}
              onClick={handleNextStep}
              type="button"
            />
          </div>
          {saveError && (
            <p className="text-label-md text-error" role="alert">
              {saveError}
            </p>
          )}
        </div>
      </div>
    </FormProvider>
  );
}

function NavigationArrowButton({
  label,
  direction,
  disabled = false,
  isLoading = false,
  onClick,
  type,
}: {
  label?: string;
  direction: "left" | "right";
  disabled?: boolean;
  isLoading?: boolean;
  type: "submit" | "button";
  onClick: () => void | Promise<void>;
}) {
  return (
    <button
      aria-busy={isLoading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-label-md font-bold tracking-wide text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading ? "Saving..." : label}{" "}
      {isLoading ? (
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
      ) : direction === "left" ? (
        <ArrowLeft aria-hidden="true" className="size-5" />
      ) : (
        <ArrowRight aria-hidden="true" className="size-5" />
      )}
    </button>
  );
}

"use client";

import BaselineHealthSnapshot from "@/components/book-consultation/BaselineHealthSnapshot";
import {
  consultationFormDefaultValues,
  type ConsultationFormValues,
} from "@/components/book-consultation/consultation-form";
import PatientVitals from "@/components/book-consultation/PatientVitals";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Save } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const steps = [
  ["Patient Information", "Patient Vitals & Measurements"],
  ["Baseline Snapshot", "Current chief complaint"],
  ["Symptoms & Trends", "Progression metrics"],
  ["Medical History", "Meds & lifestyle"],
  ["Review & Consent", "Clinician match"],
];

const emergencySymptoms = [
  ["chest_pain", "Severe chest pain or pressure"],
  ["breathing", "Difficult or labored breathing"],
  ["weakness", "Sudden weakness or numbness on one side"],
  ["speech", "Trouble speaking or acute confusion"],
  ["bleeding", "Severe uncontrollable bleeding"],
  ["consciousness", "Loss of consciousness or fainting"],
  ["allergy", "Severe allergic reaction (throat swelling)"],
];

const visitGoals = [
  "Diagnosis",
  "Treatment / Prescription",
  "Medical Advice & Lifestyle",
  "Diagnostic Tests / Bloodwork",
  "Follow-up Care Plan",
  "Other",
];

const healthRatings = [
  ["Much worse", "Severely curtailed activity"],
  ["Slightly worse", "Mildly impeded"],
  ["About the same", "No significant change"],
  ["Slightly better", "Recovering well"],
];

const symptomFactors = [
  ["Pain", true],
  ["Fever", false],
  ["Cough / Breathing", false],
  ["Digestive Issue", false],
  ["Skin Issue", false],
  ["Fatigue / Energy", true],
  ["Weight Change", false],
  ["Sleep Problem", true],
  ["Mood Concern", false],
  ["Follow-up Known", false],
  ["Other unspecified symptom…", false],
] as const;

const onsetOptions = [
  "Today",
  "1–3 days ago",
  "4–14 days ago",
  "> 2 weeks ago",
  "Long-term / Chronic",
];

const trendOptions = [
  "Rapidly worsening",
  "Slowly worsening",
  "About same",
  "Slowly improving",
  "Rapidly improving",
  "Fluctuating",
];

export default function BookConsultationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<ConsultationFormValues>({
    defaultValues: consultationFormDefaultValues,
    mode: "onBlur",
    shouldUnregister: false,
  });

  function handlePreviousStep() {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }

  function handleNextStep() {
    setCurrentStep((prev) => Math.min(5, prev + 1));
  }
  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-8">
      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5">
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
                      <span className="text-label-md font-bold">
                        {index + 1}
                      </span>
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
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:col-span-8">
        {currentStep === 1 && <PatientVitals />}
        {currentStep === 2 && <BaselineHealthSnapshot />}

        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <NavigationArrowButton
            label="Previous Step"
            direction="left"
            onClick={handlePreviousStep}
            type="button"
          />

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-surface-container-low px-4 py-3 text-label-md font-medium text-on-surface transition-colors hover:bg-surface-container"
              type="button"
            >
              <Save aria-hidden="true" className="size-4" /> Save draft
            </button>
            <NavigationArrowButton
              label="Next Step"
              direction="right"
              onClick={handleNextStep}
              type="button"
            />
          </div>
        </div>
      </div>
      </div>
    </FormProvider>
  );
}

function NavigationArrowButton({
  label,
  direction,
  onClick,
  type,
}: {
  label?: string;
  direction: "left" | "right";
  type: "submit" | "button";
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-label-md font-bold tracking-wide text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-container sm:w-auto"
      type={type}
      onClick={onClick}
    >
      {label}{" "}
      {direction === "left" ? (
        <ArrowLeft aria-hidden="true" className="size-5" />
      ) : (
        <ArrowRight aria-hidden="true" className="size-5" />
      )}
    </button>
  );
}

function PatientDatum({
  label,
  value,
  detail,
  highlight = false,
}: {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-label-sm text-on-surface-variant">{label}</dt>
      <dd
        className={`text-body-md font-semibold ${highlight ? "text-primary" : "text-on-surface"}`}
      >
        {value}
      </dd>
      <dd className="text-label-sm text-outline">{detail}</dd>
    </div>
  );
}

function Field({
  label,
  description,
  required = false,
  children,
}: {
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-headline-md text-lg text-on-surface">
        {label} {required && <span className="text-error">*</span>}
      </legend>
      {description && (
        <p className="-mt-2 text-label-md text-on-surface-variant">
          {description}
        </p>
      )}
      {children}
    </fieldset>
  );
}

function OptionGroup({
  label,
  name,
  options,
  selected,
}: {
  label: string;
  name: string;
  options: string[];
  selected: number;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5 rounded-xl bg-surface-container-low/50 p-4">
      <legend className="mb-2.5 text-label-md font-semibold text-on-surface">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option, index) => (
          <label
            className={`cursor-pointer rounded-lg px-2 py-1.5 text-center text-label-sm font-medium transition-colors ${index === selected ? "bg-primary font-semibold text-on-primary shadow-sm" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`}
            key={option}
          >
            <input
              className="sr-only"
              defaultChecked={index === selected}
              name={name}
              type="radio"
              value={option}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SummaryDatum({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-label-sm text-outline">{label}</dt>
      <dd
        className={`text-right text-label-md font-semibold ${highlight ? "rounded bg-primary-fixed/30 px-2 py-0.5 text-primary" : "text-on-surface"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function VitalGauge({
  label,
  value,
  width,
  detail,
}: {
  label: string;
  value: string;
  width: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-3">
      <div className="flex justify-between gap-3 text-label-sm">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-right font-bold text-on-surface">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full rounded-full bg-primary" style={{ width }} />
      </div>
      <span className="text-[11px] text-outline">{detail}</span>
    </div>
  );
}

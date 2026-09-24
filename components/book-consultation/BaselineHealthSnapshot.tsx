"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { Check, CloudSun, TriangleAlert } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import {
  CheckboxButton,
  CheckboxField,
  CheckboxGroup,
  FieldError,
  Input,
  Label,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
  TextArea,
  TextField,
} from "react-aria-components";
import FormSectionHeader from "./FormSectionHeader";

const emergencySymptoms = [
  ["chest_pain", "Severe chest pain or pressure"],
  ["breathing", "Difficult or labored breathing"],
  ["weakness", "Sudden weakness or numbness on one side"],
  ["speech", "Trouble speaking or acute confusion"],
  ["bleeding", "Severe uncontrollable bleeding"],
  ["consciousness", "Loss of consciousness or fainting"],
  ["allergy", "Severe allergic reaction (throat swelling)"],
] as const;

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
] as const;

const symptomFactors = [
  "Pain",
  "Fever",
  "Cough / Breathing",
  "Digestive Issue",
  "Skin Issue",
  "Fatigue / Energy",
  "Weight Change",
  "Sleep Problem",
  "Mood Concern",
  "Follow-up Known",
];

const onsetOptions = [
  "Today",
  "1–3 days ago",
  "4–14 days ago",
  "> 2 weeks ago",
  "Long-term / Chronic",
];

const questionLabelClassName = "font-headline-md text-lg text-on-surface";
const descriptionClassName = "text-label-md text-on-surface-variant";
const textInputClassName =
  "w-full rounded-lg bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all placeholder:text-outline data-[focused]:bg-surface-container-lowest data-[focused]:shadow-md data-[focus-visible]:ring-3 data-[focus-visible]:ring-primary-fixed/60 data-[invalid]:ring-2 data-[invalid]:ring-error";
const errorClassName = "text-label-sm text-error";

export default function BaselineHealthSnapshot() {
  const { control } = useFormContext<ConsultationFormValues>();
  const { field: redFlags, fieldState: redFlagsState } = useController({
    control,
    name: "baseline.redFlags",
  });
  const { field: redFlagsOther, fieldState: redFlagsOtherState } =
    useController({ control, name: "baseline.redFlagsOther" });
  const { field: chiefComplaint, fieldState: chiefComplaintState } =
    useController({ control, name: "baseline.chiefComplaint" });
  const { field: primaryConcern, fieldState: primaryConcernState } =
    useController({ control, name: "baseline.primaryConcern" });
  const { field: goals, fieldState: goalsState } = useController({
    control,
    name: "baseline.goals",
  });
  const { field: goalsOther, fieldState: goalsOtherState } = useController({
    control,
    name: "baseline.goalsOther",
  });
  const { field: usualHealth, fieldState: usualHealthState } = useController({
    control,
    name: "baseline.usualHealth",
  });
  const { field: symptoms, fieldState: symptomsState } = useController({
    control,
    name: "baseline.symptoms",
  });
  const { field: symptomsOther, fieldState: symptomsOtherState } =
    useController({ control, name: "baseline.symptomsOther" });
  const { field: onset, fieldState: onsetState } = useController({
    control,
    name: "baseline.onset",
  });
  const { field: pain, fieldState: painState } = useController({
    control,
    name: "baseline.pain",
  });

  function handleRedFlagsChange(values: string[]) {
    const selectedNone = values.includes("none");
    const noneWasSelected = redFlags.value.includes("none");

    if (selectedNone && !noneWasSelected) {
      redFlags.onChange(["none"]);
      return;
    }

    redFlags.onChange(values.filter((value) => value !== "none"));
  }

  return (
    <section className="flex flex-col gap-8 rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
      <FormSectionHeader
        heading="Baseline Health Snapshot"
        subheading="Clinical assessment"
        helper="Carefully answer these foundational clinical questions so your provider can prioritize your assessment."
      />

      <CheckboxGroup
        className="flex flex-col gap-4 rounded-xl bg-error-container/25 p-5"
        name={redFlags.name}
        onBlur={redFlags.onBlur}
        onChange={handleRedFlagsChange}
        value={redFlags.value}
        isInvalid={redFlagsState.invalid}
        isRequired
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-error text-on-error shadow-sm">
            <TriangleAlert aria-hidden="true" className="size-5" />
          </span>
          <div>
            <Label className="font-headline-md text-xl font-bold text-on-error-container">
              1. Urgent triage: Are you experiencing any of the following right
              now?
            </Label>
            <Text
              className="mt-0.5 block text-label-md text-on-error-container"
              slot="description"
            >
              If you are experiencing a life-threatening medical situation, do
              not wait for an online appointment. Call emergency services or
              visit the nearest emergency room immediately.
            </Text>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
          {emergencySymptoms.map(([value, label]) => (
            <ChoiceCheckbox key={value} value={value} variant="standard">
              {label}
            </ChoiceCheckbox>
          ))}
          <ChoiceCheckbox value="none" variant="safe">
            None of these apply (safe to proceed)
          </ChoiceCheckbox>
        </div>
        <TextField
          className="flex flex-col gap-2"
          name={redFlagsOther.name}
          onBlur={redFlagsOther.onBlur}
          onChange={redFlagsOther.onChange}
          value={redFlagsOther.value}
          isInvalid={redFlagsOtherState.invalid}
        >
          <Label className="text-label-md font-medium text-on-error-container">
            Other urgent symptoms not listed above
          </Label>
          <Input
            className={textInputClassName}
            maxLength={500}
            placeholder="Enter any other urgent symptoms"
          />
          <FieldError className={errorClassName} />
        </TextField>
        <FieldError className={errorClassName} />
      </CheckboxGroup>

      <TextField
        className="flex flex-col gap-3"
        name={chiefComplaint.name}
        onBlur={chiefComplaint.onBlur}
        onChange={chiefComplaint.onChange}
        value={chiefComplaint.value}
        isInvalid={chiefComplaintState.invalid}
        isRequired
      >
        <Label className={questionLabelClassName}>
          2. In your own words, what brings you in today and what problem are
          you experiencing? <RequiredMark />
        </Label>
        <Text className={descriptionClassName} slot="description">
          Describe the sensations, affected areas, and when you first noticed a
          departure from normal health.
        </Text>
        <TextArea className={textInputClassName} maxLength={1000} rows={4} />
        <div className="flex justify-between gap-4 px-1 text-label-sm text-outline">
          <span>
            Detailed descriptions help the provider prepare ahead of your call
          </span>
          <span className="shrink-0">
            {chiefComplaint.value.length} / 1000 characters
          </span>
        </div>
        <FieldError className={errorClassName} />
      </TextField>

      <TextField
        className="flex flex-col gap-3"
        name={primaryConcern.name}
        onBlur={primaryConcern.onBlur}
        onChange={primaryConcern.onChange}
        type="text"
        value={primaryConcern.value}
        isInvalid={primaryConcernState.invalid}
        isRequired
      >
        <Label className={questionLabelClassName}>
          3. What concerns you most about this problem? <RequiredMark />
        </Label>
        <Input className={textInputClassName} />
        <FieldError className={errorClassName} />
      </TextField>

      <CheckboxGroup
        className="flex flex-col gap-3"
        name={goals.name}
        onBlur={goals.onBlur}
        onChange={goals.onChange}
        value={goals.value}
        isInvalid={goalsState.invalid}
        isRequired
      >
        <Label className={questionLabelClassName}>
          4. What are you hoping to get from this visit / consultation?{" "}
          <RequiredMark />
        </Label>
        <Text className={descriptionClassName} slot="description">
          Select all clinical outcomes you require from your provider.
        </Text>
        <div className="flex flex-wrap gap-2.5">
          {visitGoals.map((goal) => (
            <CheckboxField className="contents" key={goal} value={goal}>
              <CheckboxButton className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-4 py-2.5 text-label-md font-medium text-on-surface shadow-sm outline-none transition data-[focus-visible]:ring-3 data-[focus-visible]:ring-primary-fixed/60 data-[hovered]:bg-surface-container data-[selected]:bg-primary data-[selected]:text-on-primary">
                <Check
                  aria-hidden="true"
                  className="size-4 opacity-0 group-data-selected:opacity-100"
                />
                {goal}
              </CheckboxButton>
            </CheckboxField>
          ))}
        </div>
        <TextField
          className="mt-2 flex flex-col gap-2"
          name={goalsOther.name}
          onBlur={goalsOther.onBlur}
          onChange={goalsOther.onChange}
          value={goalsOther.value}
          isInvalid={goalsOtherState.invalid}
        >
          <Label className="text-label-md font-medium text-on-surface">
            Other consultation goal
          </Label>
          <Input
            className={textInputClassName}
            maxLength={500}
            placeholder="Describe what else you hope to get from this visit"
          />
          <FieldError className={errorClassName} />
        </TextField>
        <FieldError className={errorClassName} />
      </CheckboxGroup>

      <RadioGroup
        className="flex flex-col gap-3"
        name={usualHealth.name}
        onBlur={usualHealth.onBlur}
        onChange={usualHealth.onChange}
        value={usualHealth.value}
        isInvalid={usualHealthState.invalid}
      >
        <Label className={questionLabelClassName}>
          5. Compared to your usual health, how do you feel today?
        </Label>
        <Text className={descriptionClassName} slot="description">
          General systemic baseline rating.
        </Text>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {healthRatings.map(([title, detail]) => (
            <RadioField className="contents" key={title} value={title}>
              <RadioButton className="group flex cursor-pointer flex-col rounded-xl bg-surface-container-low p-4 text-on-surface outline-none transition-colors data-[focus-visible]:ring-3 data-[focus-visible]:ring-primary-fixed/60 data-[hovered]:bg-surface-container data-[selected]:bg-primary data-selected:text-on-primary data-selected:shadow-md">
                <CloudSun
                  aria-hidden="true"
                  className="mb-2 size-6 text-outline group-data-selected:text-primary-fixed"
                />
                <span className="text-label-md font-bold">{title}</span>
                <span className="mt-0.5 text-label-sm text-outline group-data-selected:text-on-primary-container">
                  {detail}
                </span>
              </RadioButton>
            </RadioField>
          ))}
        </div>
      </RadioGroup>

      <CheckboxGroup
        className="flex flex-col gap-3"
        name={symptoms.name}
        onBlur={symptoms.onBlur}
        onChange={symptoms.onChange}
        value={symptoms.value}
        isInvalid={symptomsState.invalid}
      >
        <Label className={questionLabelClassName}>
          6. Check any symptoms or factors that apply:
        </Label>
        <Text className={descriptionClassName} slot="description">
          Select all concurrent symptoms experienced in the past 7 days.
        </Text>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {symptomFactors.map((symptom) => (
            <CheckboxField key={symptom} value={symptom}>
              <CheckboxButton className="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg bg-surface-container-low p-3 text-label-md text-on-surface outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 data-hovered:bg-surface-container data-selected:bg-primary data-selected:font-medium data-selected:text-on-primary data-selected:shadow-sm">
                {symptom}
                {symptom === "Pain" && (
                  <span className="hidden group-data-selected:inline">
                    (Selected)
                  </span>
                )}
              </CheckboxButton>
            </CheckboxField>
          ))}
        </div>
        <TextField
          className="mt-2 flex flex-col gap-2"
          name={symptomsOther.name}
          onBlur={symptomsOther.onBlur}
          onChange={symptomsOther.onChange}
          value={symptomsOther.value}
          isInvalid={symptomsOtherState.invalid}
        >
          <Label className="text-label-md font-medium text-on-surface">
            Other symptoms not listed above
          </Label>
          <Input
            className={textInputClassName}
            maxLength={500}
            placeholder="Enter any other symptoms"
          />
          <FieldError className={errorClassName} />
        </TextField>
      </CheckboxGroup>

      <RadioGroup
        className="flex flex-col gap-3"
        name={onset.name}
        onBlur={onset.onBlur}
        onChange={onset.onChange}
        value={onset.value}
        isInvalid={onsetState.invalid}
      >
        <Label className={questionLabelClassName}>
          7. When did the problem begin?
        </Label>
        <Text className={descriptionClassName} slot="description">
          Approximate clinical timeline.
        </Text>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {onsetOptions.map((option) => (
            <RadioField className="contents" key={option} value={option}>
              <RadioButton className="cursor-pointer rounded-lg bg-surface-container-low px-3 py-2.5 text-center text-label-md font-medium text-on-surface outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 data-hovered:bg-surface-container data-selected:bg-primary data-selected:font-bold data-selected:text-on-primary data-selected:shadow-sm">
                {option}
              </RadioButton>
            </RadioField>
          ))}
        </div>
      </RadioGroup>

      <PainScale
        isInvalid={painState.invalid}
        name={pain.name}
        onBlur={pain.onBlur}
        onChange={(value) => pain.onChange(Number(value))}
        value={pain.value?.toString() ?? ""}
      />
    </section>
  );
}

function ChoiceCheckbox({
  value,
  variant,
  children,
}: {
  value: string;
  variant: "standard" | "safe";
  children: React.ReactNode;
}) {
  return (
    <CheckboxField value={value}>
      <CheckboxButton
        className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 ${
          variant === "safe"
            ? "bg-primary/10 font-semibold text-primary data-hovered:bg-primary/20"
            : "bg-surface-container-lowest text-on-surface data-hovered:bg-surface-container-high"
        }`}
      >
        <span className="grid size-4 shrink-0 place-items-center rounded border border-outline bg-surface text-transparent transition group-data-selected:border-primary group-data-selected:bg-primary group-data-selected:text-on-primary">
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        </span>
        <span className="text-label-md">{children}</span>
      </CheckboxButton>
    </CheckboxField>
  );
}

function PainScale({
  isInvalid,
  name,
  onBlur,
  onChange,
  value,
}: {
  isInvalid: boolean;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <RadioGroup
      className="flex flex-col gap-3"
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isInvalid={isInvalid}
    >
      <Label className={questionLabelClassName}>
        8. Discomfort / Pain Severity Scale
      </Label>
      <Text className={descriptionClassName} slot="description">
        Select a number from 0 (no pain) to 10 (worst imaginable pain).
      </Text>
      <div className="rounded-xl bg-surface-container-low/60 p-4 sm:p-5">
        <div className="grid grid-cols-11 gap-1 sm:gap-2">
          {Array.from({ length: 11 }, (_, value) => (
            <RadioField
              className="contents"
              key={value}
              value={value.toString()}
            >
              <RadioButton className="grid h-10 cursor-pointer place-items-center rounded-md bg-surface-container text-label-md font-semibold text-on-surface outline-none transition-all data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 data-hovered:bg-primary/20 data-selected:scale-105 data-selected:bg-primary data-selected:text-on-primary data-selected:shadow-md">
                {value}
              </RadioButton>
            </RadioField>
          ))}
        </div>
        <div className="mt-2 flex justify-between gap-2 px-1 text-[11px] text-outline">
          <span>0 = None</span>
          <span className="text-center font-medium text-on-surface-variant">
            5 = Noticeable, limits focus
          </span>
          <span>10 = Worst</span>
        </div>
      </div>
    </RadioGroup>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-error">
      *
    </span>
  );
}

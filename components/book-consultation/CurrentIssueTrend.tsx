"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { Check, TrendingUp, TriangleAlert } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import {
  Checkbox,
  CheckboxGroup,
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
} from "react-aria-components";
import FormSectionHeader from "./FormSectionHeader";

const trendOptions = [
  "Rapidly worsening",
  "Slowly worsening",
  "About the same",
  "Slowly improving",
  "Rapidly improving",
  "Fluctuating",
];

const speedOptions = ["Hours", "1–2 days", "3–7 days", "Weeks", "Months"];

const longitudinalOptions = [
  "Much worse",
  "Slightly worse",
  "Same",
  "Slightly better",
  "Much better",
];

const redFlagOptions = [
  ["weight_loss", "Unexplained weight loss"],
  ["persistent_fever", "Persistent fever"],
  ["night_sweats", "Night sweats"],
  ["blood", "Blood in stool or urine"],
  ["severe_itching", "Severe itching"],
  ["fainting", "Fainting episodes"],
] as const;

const questionClassName = "flex flex-col gap-3";
const questionLabelClassName = "font-headline-md text-lg text-on-surface";
const descriptionClassName = "text-label-md text-on-surface-variant";
const errorClassName = "text-label-sm text-error";

export default function CurrentIssueTrend() {
  const { control } = useFormContext<ConsultationFormValues>();
  const { field: trend, fieldState: trendState } = useController({
    control,
    name: "currentIssueTrend.trend",
    rules: { required: "Select how the current issue is trending." },
  });
  const { field: speed, fieldState: speedState } = useController({
    control,
    name: "currentIssueTrend.speedOfChange",
    rules: { required: "Select how quickly the issue is changing." },
  });
  const { field: longitudinal, fieldState: longitudinalState } = useController({
    control,
    name: "currentIssueTrend.longitudinalTrend",
    rules: { required: "Select how this compares with recent weeks." },
  });
  const { field: redFlags, fieldState: redFlagsState } = useController({
    control,
    name: "currentIssueTrend.redFlagSymptoms",
    rules: {
      validate: (values) =>
        values.length > 0 || "Select any symptoms that apply, or select None.",
    },
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
        heading="Trend (Current Episode)"
        subheading="Symptoms & trends"
        helper="Describe how the current issue has changed since it began and compared with your recent health."
      />

      <TrendRadioGroup
        description="Since the symptom began:"
        error={trendState.error?.message}
        label="1. What is the trend of the current issue you are facing?"
        name={trend.name}
        onBlur={trend.onBlur}
        onChange={trend.onChange}
        options={trendOptions}
        value={trend.value}
        isInvalid={trendState.invalid}
      />

      <TrendRadioGroup
        description="How quickly is the issue changing? Change occurred over:"
        error={speedState.error?.message}
        label="Speed of Change"
        name={speed.name}
        onBlur={speed.onBlur}
        onChange={speed.onChange}
        options={speedOptions}
        value={speed.value}
        isInvalid={speedState.invalid}
      />

      <TrendRadioGroup
        description="Compared to the last visit or recent weeks:"
        error={longitudinalState.error?.message}
        label="Longitudinal Trend"
        name={longitudinal.name}
        onBlur={longitudinal.onBlur}
        onChange={longitudinal.onChange}
        options={longitudinalOptions}
        value={longitudinal.value}
        isInvalid={longitudinalState.invalid}
      />

      <CheckboxGroup
        className={`${questionClassName} rounded-xl bg-error-container/20 p-5`}
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
            <Label className={questionLabelClassName}>
              Red Flag Symptoms <RequiredMark />
            </Label>
            <Text className={descriptionClassName} slot="description">
              In the past month:
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {redFlagOptions.map(([value, label]) => (
            <ChoiceCheckbox key={value} value={value}>
              {label}
            </ChoiceCheckbox>
          ))}
          <ChoiceCheckbox value="none" safe>
            None
          </ChoiceCheckbox>
        </div>
        <FieldError className={errorClassName}>
          {redFlagsState.error?.message}
        </FieldError>
      </CheckboxGroup>
    </section>
  );
}

function TrendRadioGroup({
  description,
  error,
  isInvalid,
  label,
  name,
  onBlur,
  onChange,
  options,
  value,
}: {
  description: string;
  error?: string;
  isInvalid: boolean;
  label: string;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <RadioGroup
      className={questionClassName}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isInvalid={isInvalid}
      isRequired
    >
      <Label className={questionLabelClassName}>
        {label} <RequiredMark />
      </Label>
      <Text className={descriptionClassName} slot="description">
        {description}
      </Text>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <RadioField className="contents" key={option} value={option}>
            <RadioButton className="group flex cursor-pointer items-center gap-2 rounded-lg bg-surface-container-low px-3 py-3 text-label-md font-medium text-on-surface outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 data-hovered:bg-surface-container data-selected:bg-primary data-selected:font-semibold data-selected:text-on-primary data-selected:shadow-sm">
              {option}
            </RadioButton>
          </RadioField>
        ))}
      </div>
      <FieldError className={errorClassName}>{error}</FieldError>
    </RadioGroup>
  );
}

function ChoiceCheckbox({
  children,
  safe = false,
  value,
}: {
  children: React.ReactNode;
  safe?: boolean;
  value: string;
}) {
  return (
    <Checkbox
      className={`group flex cursor-pointer items-center gap-3 rounded-lg p-3 text-label-md outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 ${
        safe
          ? "bg-primary/10 font-semibold text-primary data-hovered:bg-primary/20"
          : "bg-surface-container-lowest text-on-surface data-hovered:bg-surface-container-high"
      }`}
      value={value}
    >
      <span className="grid size-4 shrink-0 place-items-center rounded border border-outline bg-surface text-transparent transition group-data-selected:border-primary group-data-selected:bg-primary group-data-selected:text-on-primary">
        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
      </span>
      {children}
    </Checkbox>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-error">
      *
    </span>
  );
}

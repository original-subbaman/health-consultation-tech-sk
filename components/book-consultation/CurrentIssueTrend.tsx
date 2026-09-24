"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { TriangleAlert } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import {
  CheckboxGroup,
  FieldError,
  Label,
  Text,
} from "react-aria-components";
import {
  ChoiceCheckbox,
  descriptionClassName,
  errorClassName,
  FormSection,
  getExclusiveNoneValues,
  questionClassName,
  questionLabelClassName,
  RadioChoiceGroup,
} from "./FormControls";
import FormSectionHeader from "./FormSectionHeader";
import RequiredMark from "./RequiredMark";

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
    redFlags.onChange(getExclusiveNoneValues(values, redFlags.value));
  }

  return (
    <FormSection>
      <FormSectionHeader
        heading="Trend (Current Episode)"
        subheading="Symptoms & trends"
        helper="Describe how the current issue has changed since it began and compared with your recent health."
      />

      <RadioChoiceGroup
        buttonClassName="flex items-center gap-2 px-3 text-left"
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

      <RadioChoiceGroup
        buttonClassName="flex items-center gap-2 px-3 text-left"
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

      <RadioChoiceGroup
        buttonClassName="flex items-center gap-2 px-3 text-left"
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
            <ChoiceCheckbox key={value} value={value} surface="lowest">
              {label}
            </ChoiceCheckbox>
          ))}
          <ChoiceCheckbox value="none" safe surface="lowest">
            None
          </ChoiceCheckbox>
        </div>
        <FieldError className={errorClassName}>
          {redFlagsState.error?.message}
        </FieldError>
      </CheckboxGroup>
    </FormSection>
  );
}

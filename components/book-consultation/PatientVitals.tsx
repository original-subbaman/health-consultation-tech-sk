"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { HeartPulse, Scale } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { errorClassName, FormSection } from "./FormControls";
import RequiredMark from "./RequiredMark";
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
} from "react-aria-components";
import FormSectionHeader from "./FormSectionHeader";

const fieldClassName = "flex flex-col gap-1.5";
const labelClassName =
  "font-label-md text-label-md font-semibold text-on-surface";
const inputClassName =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface outline-none transition placeholder:text-outline data-[focused]:border-primary data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[invalid]:border-error data-[invalid]:ring-3 data-[invalid]:ring-error-container";
const helperClassName = "text-label-sm text-on-surface-variant";

export default function PatientVitals() {
  const { control } = useFormContext<ConsultationFormValues>();

  return (
    <FormSection>
      <FormSectionHeader
        heading="Confirm your details and vitals"
        subheading="Patient information"
        helper="Review the information below so your consultant has an accurate baseline before the appointment."
      />

      <fieldset className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="patient.systolicBp"
            rules={{
              validate: (value) =>
                value === null
                  ? "Systolic blood pressure is required."
                  : value < 40 || value > 300
                    ? "Enter a value between 40 and 300 mmHg."
                    : true,
            }}
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) =>
                  field.onChange(value === "" ? null : Number(value))
                }
                type="number"
                value={field.value?.toString() ?? ""}
                isInvalid={fieldState.invalid}
                isRequired
              >
                <Label className={labelClassName}>
                  Systolic blood pressure (mmHg) <RequiredMark />
                </Label>
                <div className="relative">
                  <HeartPulse
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-outline"
                  />
                  <Input
                    className={`${inputClassName} pl-11`}
                    inputMode="numeric"
                    max={300}
                    min={40}
                    placeholder="e.g. 120"
                  />
                </div>
                <Text className={helperClassName} slot="description">
                  Enter the upper number from your blood pressure reading.
                </Text>
                <FieldError className={errorClassName}>
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.diastolicBp"
            rules={{
              validate: (value) =>
                value === null
                  ? "Diastolic BP is required"
                  : value >= 30 && value <= 200
                    ? true
                    : "Enter a value between 30 and 200 mmHg.",
            }}
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) =>
                  field.onChange(value === "" ? null : Number(value))
                }
                type="number"
                value={field.value?.toString() ?? ""}
                isInvalid={fieldState.invalid}
              >
                <Label className={labelClassName}>
                  Diastolic blood pressure (mmHg)
                </Label>
                <Input
                  className={inputClassName}
                  inputMode="numeric"
                  max={200}
                  min={30}
                  placeholder="e.g. 80"
                />
                <Text className={helperClassName} slot="description">
                  Enter the lower number from your blood pressure reading.
                </Text>
                <FieldError className={errorClassName}>
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.measuredAt"
            rules={{ required: "Measurement date is required." }}
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                type="date"
                value={field.value ?? ""}
                isInvalid={fieldState.invalid}
                isRequired
              >
                <Label className={labelClassName}>
                  Measurement date <RequiredMark />
                </Label>
                <Input className={inputClassName} />
                <Text className={helperClassName} slot="description">
                  Select the date these measurements were recorded.
                </Text>
                <FieldError className={errorClassName}>
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.weightKg"
            rules={{
              validate: (value) =>
                value === null
                  ? "Patient weight is required"
                  : value > 0 && value <= 500
                    ? true
                    : "Enter a weight greater than 0 and no more than 500 kg.",
            }}
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) =>
                  field.onChange(value === "" ? null : Number(value))
                }
                type="number"
                value={field.value?.toString() ?? ""}
                isInvalid={fieldState.invalid}
              >
                <Label className={labelClassName}>Current weight (kg)</Label>
                <div className="relative">
                  <Scale
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-outline"
                  />
                  <Input
                    className={`${inputClassName} pl-11`}
                    inputMode="decimal"
                    max={500}
                    min={1}
                    placeholder="e.g. 70.5"
                    step={0.1}
                  />
                </div>
                <Text className={helperClassName} slot="description">
                  Enter your most recently measured weight in kilograms.
                </Text>
                <FieldError className={errorClassName}>
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />
        </div>
      </fieldset>
    </FormSection>
  );
}

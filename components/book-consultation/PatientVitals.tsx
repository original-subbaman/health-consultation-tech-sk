"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { ChevronDown, Ruler, Scale, UserRound } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import FormSectionHeader from "./FormSectionHeader";

const fieldClassName = "flex flex-col gap-1.5";
const labelClassName =
  "font-label-md text-label-md font-semibold text-on-surface";
const inputClassName =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface outline-none transition placeholder:text-outline data-[focused]:border-primary data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[invalid]:border-error data-[invalid]:ring-3 data-[invalid]:ring-error-container";
const errorClassName = "text-label-sm text-error";

const sexOptions = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "intersex", label: "Intersex" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function PatientVitals() {
  const { control } = useFormContext<ConsultationFormValues>();

  return (
    <section
      className="flex flex-col gap-8 rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-8"
    >
      <FormSectionHeader
        heading="Confirm your details and vitals"
        subheading="Patient information"
        helper="Review the information below so your consultant has an accurate baseline before the appointment."
      />

      <fieldset className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="patient.name"
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                type="text"
                value={field.value}
                isInvalid={fieldState.invalid}
                isRequired
              >
                <Label className={labelClassName}>
                  Full name <RequiredMark />
                </Label>
                <div className="relative">
                  <UserRound
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-outline"
                  />
                  <Input
                    autoComplete="name"
                    className={`${inputClassName} pl-11`}
                    placeholder="Enter your full name"
                  />
                </div>
                <FieldError className={errorClassName} />
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.nickname"
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                type="text"
                value={field.value}
                isInvalid={fieldState.invalid}
              >
                <Label className={labelClassName}>Nickname</Label>
                <Input
                  autoComplete="nickname"
                  className={inputClassName}
                  placeholder="How should we address you?"
                />
                <FieldError className={errorClassName} />
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.weight"
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
                <Label className={labelClassName}>Weight (kg)</Label>
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
                    placeholder="Enter weight"
                    step={0.1}
                  />
                </div>
                <FieldError className={errorClassName} />
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.height"
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
                <Label className={labelClassName}>Height (cm)</Label>
                <div className="relative">
                  <Ruler
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-outline"
                  />
                  <Input
                    className={`${inputClassName} pl-11`}
                    inputMode="decimal"
                    max={300}
                    min={30}
                    placeholder="Enter height"
                    step={0.1}
                  />
                </div>
                <FieldError className={errorClassName} />
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="patient.sex"
            render={({ field, fieldState }) => (
              <Select
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onSelectionChange={(key) => field.onChange(String(key))}
                placeholder="Select sex"
                selectedKey={field.value || null}
                isInvalid={fieldState.invalid}
                isRequired
              >
                <Label className={labelClassName}>
                  Sex <RequiredMark />
                </Label>
                <Button
                  className={`${inputClassName} flex cursor-pointer items-center gap-3 text-left`}
                >
                  <SelectValue className="min-w-0 flex-1 data-[placeholder]:text-outline" />
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-outline"
                  />
                </Button>
                <FieldError className={errorClassName} />
                <Popover className="w-(--trigger-width) overflow-hidden rounded-lg border border-outline-variant bg-surface p-1 shadow-lg outline-none">
                  <ListBox className="max-h-64 overflow-auto outline-none">
                    {sexOptions.map((option) => (
                      <ListBoxItem
                        className="cursor-pointer rounded-md px-3 py-2.5 text-body-md text-on-surface outline-none data-[focused]:bg-surface-container-high data-[selected]:bg-primary-fixed/50 data-[selected]:font-semibold data-[selected]:text-primary"
                        id={option.id}
                        key={option.id}
                        textValue={option.label}
                      >
                        {option.label}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="patient.dob"
            render={({ field, fieldState }) => (
              <TextField
                className={fieldClassName}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                type="date"
                value={field.value}
                isInvalid={fieldState.invalid}
                isRequired
              >
                <Label className={labelClassName}>
                  Date of birth <RequiredMark />
                </Label>
                <Input autoComplete="bday" className={inputClassName} />
                <FieldError className={errorClassName} />
              </TextField>
            )}
          />
        </div>
      </fieldset>
    </section>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-error">
      *
    </span>
  );
}

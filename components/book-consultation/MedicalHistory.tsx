"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import {
  Controller,
  useController,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import RequiredMark from "./RequiredMark";
import {
  CheckboxGroup,
  FieldError,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import {
  ChoiceCheckbox,
  descriptionClassName,
  errorClassName,
  FormSection,
  getExclusiveNoneValues,
  questionClassName,
  questionLabelClassName,
  textInputClassName,
} from "./FormControls";
import FormSectionHeader from "./FormSectionHeader";

const conditionOptions = [
  ["diabetes", "Diabetes"],
  ["high_blood_pressure", "High blood pressure"],
  ["heart_disease", "Heart disease"],
  ["thyroid_disorder", "Thyroid disorder"],
  ["kidney_disease", "Kidney disease"],
  ["asthma_lung_disease", "Asthma / lung disease"],
  ["cancer", "Cancer"],
] as const;

const recentSymptomOptions = [
  ["fever_weight_change", "Fever or unexplained weight change"],
  ["vision_problems", "Vision problems"],
  ["hearing_problems", "Hearing problems"],
  ["chest_pain_palpitations", "Chest pain or palpitations"],
  ["breathing_cough", "Shortness of breath or chronic cough"],
  ["digestive_problems", "Abdominal pain or digestive problems"],
  ["urinary_problems", "Urinary problems"],
  ["joint_muscle_pain", "Joint or muscle pain"],
  ["skin_problems", "Skin problems"],
  ["neurological_symptoms", "Headaches, dizziness, or fainting"],
  ["mental_health_sleep", "Anxiety, depression, or sleep difficulties"],
] as const;

export default function MedicalHistory() {
  const { control } = useFormContext<ConsultationFormValues>();
  const { field: conditions, fieldState: conditionsState } = useController({
    control,
    name: "medicalHistory.conditions",
    rules: {
      validate: (values) =>
        values.length > 0 || "Select a condition or select None.",
    },
  });
  const { field: recentSymptoms, fieldState: recentSymptomsState } =
    useController({
      control,
      name: "medicalHistory.recentSymptoms",
      rules: {
        validate: (values) =>
          values.length > 0 || "Select a symptom or select None of the above.",
      },
    });

  const {
    field: {
      name: medicalRecordsName,
      onBlur: handleMedicalRecordsBlur,
      onChange: handleMedicalRecordsChange,
      ref: medicalRecordsRef,
      value: medicalRecordFiles,
    },
  } = useController({ control, name: "medicalHistory.medicalRecords" });

  return (
    <FormSection>
      <FormSectionHeader
        heading="Medical History"
        subheading="Health background"
        helper="Tell your provider about existing conditions, medications, allergies, and lifestyle factors relevant to your care."
      />

      <HistoryCheckboxGroup
        error={conditionsState.error?.message}
        label="Existing conditions"
        name={conditions.name}
        noneLabel="None"
        onBlur={conditions.onBlur}
        onChange={(values) =>
          conditions.onChange(getExclusiveNoneValues(values, conditions.value))
        }
        options={conditionOptions}
        value={conditions.value}
        isInvalid={conditionsState.invalid}
      />

      <HistoryCheckboxGroup
        error={recentSymptomsState.error?.message}
        label="Current or recent symptoms"
        name={recentSymptoms.name}
        noneLabel="None of the above"
        onBlur={recentSymptoms.onBlur}
        onChange={(values) =>
          recentSymptoms.onChange(
            getExclusiveNoneValues(values, recentSymptoms.value),
          )
        }
        options={recentSymptomOptions}
        value={recentSymptoms.value}
        isInvalid={recentSymptomsState.invalid}
      />

      <MedicationsFieldArray />

      <AllergyFieldArray />

      <div className={questionClassName}>
        <Label className={questionLabelClassName}>
          Upload relevant medical records
        </Label>
        <p className={descriptionClassName}>
          Add reports, prescriptions, or test results that may help your
          provider.
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center transition-colors hover:border-primary hover:bg-primary-fixed/20">
          <Upload aria-hidden="true" className="size-6 text-primary" />
          <span className="text-label-md font-semibold text-on-surface">
            Choose medical records
          </span>
          <span className="text-label-sm text-outline">
            One PDF, JPG, PNG, DOC, or DOCX file, up to 5 MB
          </span>
          <input
            ref={medicalRecordsRef}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="sr-only"
            name={medicalRecordsName}
            onBlur={handleMedicalRecordsBlur}
            onChange={(event) =>
              handleMedicalRecordsChange(
                event.currentTarget.files?.[0]
                  ? [event.currentTarget.files[0]]
                  : [],
              )
            }
            type="file"
          />
        </label>
        {medicalRecordFiles.length > 0 && (
          <ul className="flex flex-col gap-2" aria-label="Selected files">
            {medicalRecordFiles.map((file) => (
              <li
                className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2 text-label-md text-on-surface"
                key={`${file.name}-${file.lastModified}`}
              >
                <FileText aria-hidden="true" className="size-4 text-primary" />
                <span className="min-w-0 truncate">{file.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormSection>
  );
}

function AllergyFieldArray() {
  const { control } = useFormContext<ConsultationFormValues>();
  const {
    fields: allergies,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "medicalHistory.allergies",
  });

  return (
    <div className={questionClassName}>
      <div>
        <h2 className={questionLabelClassName}>Allergy details</h2>
        <p className={descriptionClassName}>
          Add each allergy and describe the reaction or other relevant details.
        </p>
      </div>

      {allergies.map((allergy, index) => (
        <div
          className="flex flex-col gap-4 rounded-xl bg-surface-container-low/60 p-4 sm:p-5"
          key={allergy.id}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-label-lg font-semibold text-on-surface">
              Allergy {index + 1}
            </h3>
            <button
              aria-label={`Remove allergy ${index + 1}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-label-md font-medium text-error outline-none transition-colors hover:bg-error-container/30 focus-visible:ring-3 focus-visible:ring-error-container"
              onClick={() => remove(index)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name={`medicalHistory.allergies.${index}.allergyName`}
              rules={{
                required: "Allergy name is required.",
                maxLength: {
                  value: 200,
                  message: "Allergy name must be 200 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                  isRequired
                >
                  <Label className={questionLabelClassName}>
                    Allergy name <RequiredMark />
                  </Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={200}
                    placeholder="e.g. Penicillin"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name={`medicalHistory.allergies.${index}.details`}
              rules={{
                maxLength: {
                  value: 1000,
                  message: "Details must be 1000 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                >
                  <Label className={questionLabelClassName}>Details</Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={1000}
                    placeholder="e.g. Causes hives and swelling"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>
        </div>
      ))}

      <button
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary shadow-sm outline-none transition-colors hover:bg-primary-container focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
        onClick={() => append({ allergyName: "", details: "" })}
        type="button"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add allergy
      </button>
    </div>
  );
}

function MedicationsFieldArray() {
  const { control } = useFormContext<ConsultationFormValues>();
  const {
    fields: medications,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "medicalHistory.medications",
  });

  return (
    <div className={questionClassName}>
      <div>
        <h2 className={questionLabelClassName}>Medications</h2>
        <p className={descriptionClassName}>
          Add each medication you currently take, including its strength and
          schedule.
        </p>
      </div>

      {medications.map((medication, index) => (
        <div
          className="flex flex-col gap-4 rounded-xl bg-surface-container-low/60 p-4 sm:p-5"
          key={medication.id}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-label-lg font-semibold text-on-surface">
              Medication {index + 1}
            </h3>
            <button
              aria-label={`Remove medication ${index + 1}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-label-md font-medium text-error outline-none transition-colors hover:bg-error-container/30 focus-visible:ring-3 focus-visible:ring-error-container"
              onClick={() => remove(index)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name={`medicalHistory.medications.${index}.medicationName`}
              rules={{
                required: "Medication name is required.",
                maxLength: {
                  value: 200,
                  message: "Medication name must be 200 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                  isRequired
                >
                  <Label className={questionLabelClassName}>
                    Medication name <RequiredMark />
                  </Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={200}
                    placeholder="e.g. Metformin"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name={`medicalHistory.medications.${index}.strength`}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Strength must be 100 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                >
                  <Label className={questionLabelClassName}>Strength</Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={100}
                    placeholder="e.g. 500 mg"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name={`medicalHistory.medications.${index}.quantity`}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Quantity must be 100 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                >
                  <Label className={questionLabelClassName}>Quantity</Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={100}
                    placeholder="e.g. 1 tablet"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name={`medicalHistory.medications.${index}.frequency`}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Frequency must be 100 characters or fewer.",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className={questionClassName}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  isInvalid={fieldState.invalid}
                >
                  <Label className={questionLabelClassName}>Frequency</Label>
                  <Input
                    ref={field.ref}
                    className={textInputClassName}
                    maxLength={100}
                    placeholder="e.g. Twice daily"
                  />
                  <FieldError className={errorClassName}>
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>
        </div>
      ))}

      <button
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary shadow-sm outline-none transition-colors hover:bg-primary-container focus-visible:ring-3 focus-visible:ring-primary-fixed/60"
        onClick={() =>
          append({
            medicationName: "",
            strength: "",
            quantity: "",
            frequency: "",
          })
        }
        type="button"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add medication
      </button>
    </div>
  );
}

function HistoryCheckboxGroup({
  error,
  isInvalid,
  label,
  name,
  noneLabel,
  onBlur,
  onChange,
  options,
  value,
}: {
  error?: string;
  isInvalid: boolean;
  label: string;
  name: string;
  noneLabel: string;
  onBlur: () => void;
  onChange: (values: string[]) => void;
  options: ReadonlyArray<readonly [string, string]>;
  value: string[];
}) {
  return (
    <CheckboxGroup
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
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map(([optionValue, optionLabel]) => (
          <ChoiceCheckbox key={optionValue} value={optionValue}>
            {optionLabel}
          </ChoiceCheckbox>
        ))}
        <ChoiceCheckbox value="none" safe>
          {noneLabel}
        </ChoiceCheckbox>
      </div>
      <FieldError className={errorClassName}>{error}</FieldError>
    </CheckboxGroup>
  );
}

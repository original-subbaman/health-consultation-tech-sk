"use client";

import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { FileText, Upload } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import RequiredMark from "./RequiredMark";
import {
  CheckboxGroup,
  FieldError,
  Label,
  Text,
  TextArea,
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
  RadioChoiceGroup,
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
  const { control, setValue } = useFormContext<ConsultationFormValues>();
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
  const { field: medications } = useController({
    control,
    name: "medicalHistory.medications",
  });
  const { field: allergyStatus, fieldState: allergyStatusState } =
    useController({
      control,
      name: "medicalHistory.allergyStatus",
      rules: { required: "Select whether you have allergies." },
    });
  const { field: allergyDetails, fieldState: allergyDetailsState } =
    useController({
      control,
      name: "medicalHistory.allergyDetails",
      rules: {
        validate: (value) =>
          allergyStatus.value !== "yes" ||
          value.trim().length > 0 ||
          "Describe your allergies.",
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
  const { field: weightChange, fieldState: weightChangeState } = useController({
    control,
    name: "medicalHistory.lifestyle.recentWeightChange",
    rules: { required: "Select whether your weight changed recently." },
  });
  const { field: smoking, fieldState: smokingState } = useController({
    control,
    name: "medicalHistory.lifestyle.smoking",
    rules: { required: "Select your smoking status." },
  });
  const { field: alcohol, fieldState: alcoholState } = useController({
    control,
    name: "medicalHistory.lifestyle.alcohol",
    rules: { required: "Select your alcohol use." },
  });
  const { field: additionalNotes } = useController({
    control,
    name: "medicalHistory.lifestyle.additionalNotes",
  });

  function handleAllergyStatusChange(value: string) {
    allergyStatus.onChange(value);

    if (value !== "yes") {
      setValue("medicalHistory.allergyDetails", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }

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

      <TextField
        className={questionClassName}
        name={medications.name}
        onBlur={medications.onBlur}
        onChange={medications.onChange}
        value={medications.value}
      >
        <Label className={questionLabelClassName}>Medications</Label>
        <Text className={descriptionClassName} slot="description">
          List all medications you are currently taking and their quantities.
        </Text>
        <TextArea
          className={textInputClassName}
          placeholder="Medication name, dose, and frequency"
          rows={4}
        />
      </TextField>

      <RadioChoiceGroup
        error={allergyStatusState.error?.message}
        label="Allergies"
        name={allergyStatus.name}
        onBlur={allergyStatus.onBlur}
        onChange={handleAllergyStatusChange}
        options={[
          ["yes", "Yes"],
          ["none", "None"],
        ]}
        value={allergyStatus.value}
        isInvalid={allergyStatusState.invalid}
      />

      {allergyStatus.value === "yes" && (
        <TextField
          className={questionClassName}
          name={allergyDetails.name}
          onBlur={allergyDetails.onBlur}
          onChange={allergyDetails.onChange}
          value={allergyDetails.value}
          isInvalid={allergyDetailsState.invalid}
          isRequired
        >
          <Label className={questionLabelClassName}>
            Describe your allergies <RequiredMark />
          </Label>
          <TextArea
            className={textInputClassName}
            placeholder="Include the allergen and your usual reaction"
            rows={3}
          />
          <FieldError className={errorClassName}>
            {allergyDetailsState.error?.message}
          </FieldError>
        </TextField>
      )}

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
            PDF, JPG, PNG, DOC, or DOCX
          </span>
          <input
            ref={medicalRecordsRef}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="sr-only"
            multiple
            name={medicalRecordsName}
            onBlur={handleMedicalRecordsBlur}
            onChange={(event) =>
              handleMedicalRecordsChange(
                Array.from(event.currentTarget.files ?? []),
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

      <div className="border-t border-outline-variant pt-2">
        <h2 className="font-headline-md text-xl text-on-surface">
          Lifestyle Signals
        </h2>
      </div>

      <RadioChoiceGroup
        error={weightChangeState.error?.message}
        label="Recent weight change (&gt;5 kg / 10 lbs)?"
        name={weightChange.name}
        onBlur={weightChange.onBlur}
        onChange={weightChange.onChange}
        options={[
          ["yes", "Yes"],
          ["no", "No"],
        ]}
        value={weightChange.value}
        isInvalid={weightChangeState.invalid}
      />

      <RadioChoiceGroup
        error={smokingState.error?.message}
        label="Smoking"
        name={smoking.name}
        onBlur={smoking.onBlur}
        onChange={smoking.onChange}
        options={[
          ["never", "Never"],
          ["former", "Former"],
          ["current", "Current"],
        ]}
        value={smoking.value}
        isInvalid={smokingState.invalid}
      />

      <RadioChoiceGroup
        error={alcoholState.error?.message}
        label="Alcohol"
        name={alcohol.name}
        onBlur={alcohol.onBlur}
        onChange={alcohol.onChange}
        options={[
          ["none", "None"],
          ["occasional", "Occasional"],
          ["regular", "Regular"],
        ]}
        value={alcohol.value}
        isInvalid={alcoholState.invalid}
      />

      <TextField
        className={questionClassName}
        name={additionalNotes.name}
        onBlur={additionalNotes.onBlur}
        onChange={additionalNotes.onChange}
        value={additionalNotes.value}
      >
        <Label className={questionLabelClassName}>
          Is there anything else we should know about you that might impact your
          health?
        </Label>
        <Text className={descriptionClassName} slot="description">
          Include dietary restrictions or major life changes.
        </Text>
        <TextArea className={textInputClassName} maxLength={1000} rows={4} />
      </TextField>
    </FormSection>
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

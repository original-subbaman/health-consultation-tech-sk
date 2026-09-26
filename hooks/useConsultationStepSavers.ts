"use client";

import {
  saveConsultationIntakes,
  saveCurrentIssueTrend,
  saveLifestyleAssessment,
  saveMedicalHistory,
  saveMedicalRecords,
  savePatientAllergies,
  savePatientMedications,
  savePatientVitals,
  submitConsultation,
} from "@/actions/consultations";
import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { useCallback, useMemo, useState } from "react";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";

type StepSaveResult =
  | { success: true; message?: string }
  | { success: false; message: string };

type StepSaver = () => Promise<StepSaveResult>;

export function useConsultationStepSavers({
  consultationId,
  getValues,
  setValue,
}: {
  consultationId: string;
  getValues: UseFormGetValues<ConsultationFormValues>;
  setValue: UseFormSetValue<ConsultationFormValues>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const mutations = useMemo<Partial<Record<number, StepSaver>>>(
    () => ({
      1: () =>
        savePatientVitals({
          ...getValues("patient"),
          consultationId,
        }),
      2: () =>
        saveConsultationIntakes({
          ...getValues("baseline"),
          consultationId,
        }),
      3: () =>
        saveCurrentIssueTrend({
          ...getValues("currentIssueTrend"),
          consultationId,
        }),
      4: async () => {
        const medicalHistoryResult = await saveMedicalHistory({
          conditions: getValues("medicalHistory.conditions"),
          consultationId,
          recentSymptoms: getValues("medicalHistory.recentSymptoms"),
        });

        if (!medicalHistoryResult.success) {
          return medicalHistoryResult;
        }

        const medicationsResult = await savePatientMedications({
          consultationId,
          medications: getValues("medicalHistory.medications"),
        });

        if (!medicationsResult.success) {
          return medicationsResult;
        }

        const allergiesResult = await savePatientAllergies({
          allergies: getValues("medicalHistory.allergies"),
          consultationId,
        });

        if (!allergiesResult.success) {
          return allergiesResult;
        }

        const medicalRecord = getValues("medicalHistory.medicalRecords")[0];

        if (!medicalRecord) {
          return allergiesResult;
        }

        const formData = new FormData();
        formData.set("consultationId", consultationId);
        formData.set("file", medicalRecord);

        const medicalRecordResult = await saveMedicalRecords(formData);

        if (medicalRecordResult.success) {
          setValue("medicalHistory.medicalRecords", [], {
            shouldDirty: false,
          });
        }

        return medicalRecordResult;
      },
      5: () =>
        saveLifestyleAssessment({
          ...getValues("medicalHistory.lifestyle"),
          consultationId,
        }),
      6: () => submitConsultation(consultationId),
    }),
    [consultationId, getValues, setValue],
  );

  const saveStep = useCallback(
    async (step: number) => {
      const mutate = mutations[step];

      if (!mutate) {
        return true;
      }

      setSaveError(null);
      setIsSaving(true);

      try {
        const result = await mutate();

        if (!result.success) {
          setSaveError(result.message);
          return false;
        }

        return true;
      } catch {
        setSaveError("This section could not be saved. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [mutations],
  );

  return {
    isSaving,
    saveError,
    saveStep,
  };
}

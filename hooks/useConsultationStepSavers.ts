"use client";

import { savePatientVitals } from "@/actions/consultations";
import type { ConsultationFormValues } from "@/components/book-consultation/consultation-form";
import { useCallback, useMemo, useState } from "react";
import type { UseFormGetValues } from "react-hook-form";

type StepSaveResult =
  | { success: true; message?: string }
  | { success: false; message: string };

type StepSaver = () => Promise<StepSaveResult>;

export function useConsultationStepSavers({
  consultationId,
  getValues,
}: {
  consultationId: string;
  getValues: UseFormGetValues<ConsultationFormValues>;
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
    }),
    [consultationId, getValues],
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

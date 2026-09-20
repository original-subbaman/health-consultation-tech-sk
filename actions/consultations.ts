"use server";

import type { Tables } from "@/database.types";
import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";
import {
  type PatientMeasurements,
  patientMeasurementsSchema,
} from "@/lib/validation/consultation";

type ConsultationSummary = Pick<
  Tables<"consultations">,
  "id" | "patient_id" | "status"
>;

export type CreateConsultationResult =
  | {
      success: true;
      consultation: ConsultationSummary;
    }
  | {
      success: false;
      message: string;
    };

export async function createConsultation(): Promise<CreateConsultationResult> {
  const patient = await requirePatient();

  try {
    const supabase = await createClient();

    const { data: existingDraft, error: existingDraftError } = await supabase
      .from("consultations")
      .select("id, patient_id, status")
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingDraftError) {
      console.error("Failed to check for an existing consultation draft", {
        patientId: patient.id,
        error: existingDraftError,
      });

      return {
        success: false,
        message: "Consultation could not be created at the moment",
      };
    }

    if (existingDraft) {
      return {
        success: true,
        consultation: existingDraft,
      };
    }

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        patient_id: patient.id,
        status: "draft",
      })
      .select("id, patient_id, status")
      .single();

    if (error) {
      if (error.code === "23505") {
        const { data: concurrentDraft, error: concurrentDraftError } =
          await supabase
            .from("consultations")
            .select("id, patient_id, status")
            .eq("patient_id", patient.id)
            .eq("status", "draft")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!concurrentDraftError && concurrentDraft) {
          return {
            success: true,
            consultation: concurrentDraft,
          };
        }
      }

      console.error("Failed to create consultation", error);
      return {
        success: false,
        message: "Consultation could not be created at the moment",
      };
    }

    return {
      success: true,
      consultation: data,
    };
  } catch (error) {
    console.log("🚀 ~ createConsultation ~ error:", error);
    return {
      success: false,
      message: "Consultation could not be created at the moment",
    };
  }
}

export async function savePatientVitals(vitals: PatientMeasurements) {
  const patient = await requirePatient();
  const validationResult = patientMeasurementsSchema.safeParse(vitals);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Invalid vital measurements",
    };
  }

  const validatedVitals = validationResult.data;

  try {
    const client = await createClient();

    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select()
      .eq("id", validatedVitals.consultationId)
      .eq("patient_id", patient.id)
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid input",
      };
    }

    const { error } = await client
      .from("patient_measurements")
      .upsert(
        {
          patient_id: patient.id,
          consultation_id: validatedVitals.consultationId,
          systolic_bp: validatedVitals.systolicBp,
          diastolic_bp: validatedVitals.diastolicBp,
          measured_at: validatedVitals.measuredAt,
          weight_kg: validatedVitals.weightKg,
        },
        { onConflict: "patient_id,consultation_id" },
      )
      .select();

    if (error) {
      console.log("🚀 ~ savePatientVitals ~ error:", error);
      return {
        success: false,
        message: "Could not save at the moment",
      };
    }

    return {
      success: true,
      message: "Vitals saved successfully",
    };
  } catch (error) {
    console.log("~ savePatientVitals ~ error: ", error);
    return {
      success: false,
      message: "Vital measurements could not be saved",
    };
  }
}

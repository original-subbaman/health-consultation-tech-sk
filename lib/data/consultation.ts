import "server-only";

import {
  consultationFormDefaultValues,
  type ConsultationFormValues,
} from "@/components/book-consultation/consultation-form";
import type { Tables } from "@/database.types";
import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";

type GetActiveConsultationResult =
  | {
      success: true;
      consultation: Tables<"consultations">;
    }
  | {
      success: false;
      message: string;
    };

export type GetConsultationFormValuesResult =
  | {
      success: true;
      values: ConsultationFormValues;
    }
  | {
      success: false;
      message: string;
    };

export async function getActiveConsultation(): Promise<GetActiveConsultationResult> {
  const patient = await requirePatient();

  try {
    const client = await createClient();
    const { data: consultation, error } = await client
      .from("consultations")
      .select(
        "id, patient_id, doctor_id, status, created_at, updated_at, submitted_at, completed_at",
      )
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch active consultation", {
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Consultation could not be loaded at the moment",
      };
    }

    if (!consultation) {
      return {
        success: false,
        message: "No draft consultation found",
      };
    }

    return {
      success: true,
      consultation,
    };
  } catch (error) {
    console.error("Failed to fetch active consultation", {
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Consultation could not be loaded at the moment",
    };
  }
}

export async function getConsultationFormValues(
  consultationId: string,
): Promise<GetConsultationFormValuesResult> {
  const patient = await requirePatient();

  try {
    const client = await createClient();

    const { data: consultation, error } = await client
      .from("consultations")
      .select(
        `
          id,
          patient_measurements (
            systolic_bp,
            diastolic_bp,
            measured_at,
            weight_kg
          )
        `,
      )
      .eq("id", consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (error || !consultation) {
      return {
        success: false,
        message: "Failed to fetch form values",
      };
    }

    const measurement = consultation.patient_measurements[0];

    return {
      success: true,
      values: {
        ...consultationFormDefaultValues,
        patient: {
          systolicBp: measurement?.systolic_bp ?? null,
          diastolicBp: measurement?.diastolic_bp ?? null,
          measuredAt: measurement?.measured_at
            ? measurement.measured_at.slice(0, 10)
            : null,
          weightKg: measurement?.weight_kg ?? null,
        },
      },
    };
  } catch (error) {
    console.log("🚀 ~ getConsultationFormValues ~ error:", error);
    return {
      success: false,
      message: "Form values could not be loaded at the moment",
    };
  }
}

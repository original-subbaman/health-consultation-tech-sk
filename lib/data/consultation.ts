import "server-only";

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

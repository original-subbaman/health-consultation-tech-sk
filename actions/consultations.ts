"use server";

import type { Tables } from "@/database.types";
import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";

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

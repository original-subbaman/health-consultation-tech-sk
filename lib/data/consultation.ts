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

type LifestyleFormValues = ConsultationFormValues["medicalHistory"]["lifestyle"];

function toSmokingFormValue(
  value: string | null | undefined,
): LifestyleFormValues["smoking"] {
  return value === "never" || value === "former" || value === "current"
    ? value
    : "";
}

function toAlcoholFormValue(
  value: string | null | undefined,
): LifestyleFormValues["alcohol"] {
  return value === "none" ||
    value === "occasional" ||
    value === "regular"
    ? value
    : "";
}

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
          ),
          consultation_intakes (
            emergency_symptoms,
            emergency_symptoms_other,
            chief_complaint,
            primary_concern,
            consultation_goals,
            consultation_goal_other,
            general_health_today,
            current_symptoms,
            current_symptoms_other,
            symptom_onset,
            discomfort_severity,
            current_issue_trend,
            speed_of_change,
            longitudinal_trend,
            red_flag_symptoms
          ),
          patient_medical_history (
            existing_conditions,
            current_health_issues
          ),
          patient_medications (
            id,
            medication_name,
            strength,
            quantity,
            frequency
          ),
          patient_allergies (
            id,
            allergy_name,
            details
          ),
          lifestyle_assessments (
            recent_significant_weight_change,
            smoking_status,
            alcohol_use,
            additional_health_information
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
    const intake = consultation.consultation_intakes;
    const medicalHistory = consultation.patient_medical_history;
    const lifestyleAssessment = consultation.lifestyle_assessments;

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
        baseline: {
          redFlags:
            intake?.emergency_symptoms ??
            consultationFormDefaultValues.baseline.redFlags,
          redFlagsOther: intake?.emergency_symptoms_other ?? "",
          chiefComplaint: intake?.chief_complaint ?? "",
          primaryConcern: intake?.primary_concern ?? "",
          goals: intake?.consultation_goals ?? [],
          goalsOther: intake?.consultation_goal_other ?? "",
          usualHealth: intake?.general_health_today ?? "",
          symptoms: intake?.current_symptoms ?? [],
          symptomsOther: intake?.current_symptoms_other ?? "",
          onset: intake?.symptom_onset ?? "",
          pain:
            intake?.discomfort_severity ??
            consultationFormDefaultValues.baseline.pain,
        },
        currentIssueTrend: {
          trend: intake?.current_issue_trend ?? "",
          speedOfChange: intake?.speed_of_change ?? "",
          longitudinalTrend: intake?.longitudinal_trend ?? "",
          redFlagSymptoms:
            intake?.red_flag_symptoms ??
            consultationFormDefaultValues.currentIssueTrend.redFlagSymptoms,
        },
        medicalHistory: {
          ...consultationFormDefaultValues.medicalHistory,
          conditions:
            medicalHistory?.existing_conditions ??
            consultationFormDefaultValues.medicalHistory.conditions,
          recentSymptoms:
            medicalHistory?.current_health_issues ??
            consultationFormDefaultValues.medicalHistory.recentSymptoms,
          medications: consultation.patient_medications.map((medication) => ({
            id: medication.id,
            medicationName: medication.medication_name,
            strength: medication.strength ?? "",
            quantity: medication.quantity ?? "",
            frequency: medication.frequency ?? "",
          })),
          allergies: consultation.patient_allergies.map((allergy) => ({
            id: allergy.id,
            allergyName: allergy.allergy_name,
            details: allergy.details ?? "",
          })),
          lifestyle: {
            recentWeightChange:
              lifestyleAssessment?.recent_significant_weight_change == null
                ? ""
                : lifestyleAssessment.recent_significant_weight_change
                  ? "yes"
                  : "no",
            smoking: toSmokingFormValue(
              lifestyleAssessment?.smoking_status,
            ),
            alcohol: toAlcoholFormValue(lifestyleAssessment?.alcohol_use),
            additionalNotes:
              lifestyleAssessment?.additional_health_information ?? "",
          },
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

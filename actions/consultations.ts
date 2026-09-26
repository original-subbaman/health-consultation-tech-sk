"use server";

import type { Json, Tables } from "@/database.types";
import { requirePatient } from "@/lib/auth/auth";
import { saveMedicalRecordFile } from "@/lib/storage/medical-records";
import { createClient } from "@/lib/supabase/server";
import {
  type Allergies,
  allergiesSchema,
  type ConsultationIntake,
  consultationIntakeSchema,
  type CurrentIssueTrend,
  currentIssueTrendSchema,
  type MedicalHistory,
  medicalHistorySchema,
  medicalRecordUploadSchema,
  type Medications,
  medicationsSchema,
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

export async function saveConsultationIntakes(intake: ConsultationIntake) {
  const patient = await requirePatient();
  const validationResult = consultationIntakeSchema.safeParse(intake);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Invalid consultation intake",
    };
  }

  const validatedIntake = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", validatedIntake.consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const { error } = await client.from("consultation_intakes").upsert(
      {
        consultation_id: consultation.id,
        emergency_symptoms: validatedIntake.redFlags,
        emergency_symptoms_other: validatedIntake.redFlagsOther || null,
        chief_complaint: validatedIntake.chiefComplaint,
        primary_concern: validatedIntake.primaryConcern,
        consultation_goals: validatedIntake.goals,
        consultation_goal_other: validatedIntake.goalsOther || null,
        general_health_today: validatedIntake.usualHealth || null,
        current_symptoms: validatedIntake.symptoms,
        current_symptoms_other: validatedIntake.symptomsOther || null,
        symptom_onset: validatedIntake.onset || null,
        discomfort_severity: validatedIntake.pain,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "consultation_id" },
    );

    if (error) {
      console.error("Failed to save consultation intake", {
        consultationId: consultation.id,
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Could not save the baseline health snapshot",
      };
    }

    return {
      success: true,
      message: "Baseline health snapshot saved successfully",
    };
  } catch (error) {
    console.error("Failed to save consultation intake", {
      consultationId: validatedIntake.consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Baseline health snapshot could not be saved",
    };
  }
}

export async function saveCurrentIssueTrend(trend: CurrentIssueTrend) {
  const patient = await requirePatient();
  const validationResult = currentIssueTrendSchema.safeParse(trend);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Invalid current issue trend",
    };
  }

  const validatedTrend = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", validatedTrend.consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const { data: intake, error } = await client
      .from("consultation_intakes")
      .update({
        current_issue_trend: validatedTrend.trend,
        speed_of_change: validatedTrend.speedOfChange,
        longitudinal_trend: validatedTrend.longitudinalTrend,
        red_flag_symptoms: validatedTrend.redFlagSymptoms,
        updated_at: new Date().toISOString(),
      })
      .eq("consultation_id", consultation.id)
      .select("id")
      .maybeSingle();

    if (error || !intake) {
      console.error("Failed to save current issue trend", {
        consultationId: consultation.id,
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Could not save the current issue trend",
      };
    }

    return {
      success: true,
      message: "Current issue trend saved successfully",
    };
  } catch (error) {
    console.error("Failed to save current issue trend", {
      consultationId: validatedTrend.consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Current issue trend could not be saved",
    };
  }
}

export async function saveMedicalHistory(history: MedicalHistory) {
  const patient = await requirePatient();
  const validationResult = medicalHistorySchema.safeParse(history);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Invalid medical history",
    };
  }

  const validatedHistory = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", validatedHistory.consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const { error } = await client.from("patient_medical_history").upsert(
      {
        consultation_id: consultation.id,
        existing_conditions: validatedHistory.conditions,
        current_health_issues: validatedHistory.recentSymptoms,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "consultation_id" },
    );

    if (error) {
      console.error("Failed to save patient medical history", {
        consultationId: consultation.id,
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Could not save the medical history",
      };
    }

    return {
      success: true,
      message: "Medical history saved successfully",
    };
  } catch (error) {
    console.error("Failed to save patient medical history", {
      consultationId: validatedHistory.consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Medical history could not be saved",
    };
  }
}

export async function savePatientMedications(input: Medications) {
  const patient = await requirePatient();
  const validationResult = medicationsSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ?? "Invalid medications",
    };
  }

  const validatedInput = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", validatedInput.consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const medications: Json = validatedInput.medications.map((medication) => ({
      id: medication.id ?? null,
      medication_name: medication.medicationName,
      strength: medication.strength || null,
      quantity: medication.quantity || null,
      frequency: medication.frequency || null,
    }));

    const { error } = await client.rpc("save_patient_medications", {
      p_consultation_id: consultation.id,
      p_medications: medications,
    });

    if (error) {
      console.error("Failed to save patient medications", {
        consultationId: consultation.id,
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Could not save the medications",
      };
    }

    return {
      success: true,
      message: "Medications saved successfully",
    };
  } catch (error) {
    console.error("Failed to save patient medications", {
      consultationId: validatedInput.consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Medications could not be saved",
    };
  }
}

export async function savePatientAllergies(input: Allergies) {
  const patient = await requirePatient();
  const validationResult = allergiesSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ?? "Invalid allergies",
    };
  }

  const validatedInput = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", validatedInput.consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const allergies: Json = validatedInput.allergies.map((allergy) => ({
      id: allergy.id ?? null,
      allergy_name: allergy.allergyName,
      details: allergy.details || null,
    }));

    const { error } = await client.rpc("save_patient_allergies", {
      p_consultation_id: consultation.id,
      p_allergies: allergies,
    });

    if (error) {
      console.error("Failed to save patient allergies", {
        consultationId: consultation.id,
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Could not save the allergies",
      };
    }

    return {
      success: true,
      message: "Allergies saved successfully",
    };
  } catch (error) {
    console.error("Failed to save patient allergies", {
      consultationId: validatedInput.consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Allergies could not be saved",
    };
  }
}

export async function saveMedicalRecords(formData: FormData) {
  const patient = await requirePatient();
  const validationResult = medicalRecordUploadSchema.safeParse({
    consultationId: formData.get("consultationId"),
    file: formData.get("file"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Invalid medical record upload",
    };
  }

  const { consultationId, file } = validationResult.data;

  try {
    const client = await createClient();
    const { data: consultation, error: consultationError } = await client
      .from("consultations")
      .select("id")
      .eq("id", consultationId)
      .eq("patient_id", patient.id)
      .eq("status", "draft")
      .maybeSingle();

    if (consultationError || !consultation) {
      return {
        success: false,
        message: "Invalid consultation",
      };
    }

    const fileResult = await saveMedicalRecordFile({
      client,
      consultationId: consultation.id,
      file,
      patientId: patient.id,
    });

    if (!fileResult.success) {
      console.error("Failed to save medical record file", {
        consultationId: consultation.id,
        patientId: patient.id,
        stage: fileResult.stage,
        error: fileResult.error,
        cleanupError:
          fileResult.stage === "metadata"
            ? fileResult.cleanupError
            : undefined,
      });

      return {
        success: false,
        message:
          fileResult.stage === "upload"
            ? "Could not upload the medical record"
            : "Could not save the medical record",
      };
    }

    return {
      success: true,
      message: "Medical record uploaded successfully",
    };
  } catch (error) {
    console.error("Failed to save medical record", {
      consultationId,
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Medical record could not be uploaded",
    };
  }
}

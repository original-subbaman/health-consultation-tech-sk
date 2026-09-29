import "server-only";

import {
  consultationFormDefaultValues,
  type ConsultationFormValues,
} from "@/components/book-consultation/consultation-form";
import type { Tables } from "@/database.types";
import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";

const PATIENT_CONSULTATION_STATUSES = [
  "draft",
  "submitted",
  "completed",
] as const;

export type PatientConsultationStatus =
  (typeof PATIENT_CONSULTATION_STATUSES)[number];

export type GetPatientConsultationOptions = {
  page?: number;
  pageSize?: number;
  chiefComplaint?: string;
  doctorName?: string;
  submittedDate?: string;
  status?: PatientConsultationStatus;
};

export type PatientConsultationListItem = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  submittedAt: string | null;
  completedAt: string | null;
  chiefComplaint: string | null;
  doctor: {
    id: string;
    fullName: string;
    specialty: string | null;
  } | null;
};

export type GetPatientConsultationResult =
  | {
      success: true;
      consultations: PatientConsultationListItem[];
      pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
    }
  | {
      success: false;
      message: string;
    };

type GetLatestDraftConsultationResult =
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

type LifestyleFormValues =
  ConsultationFormValues["medicalHistory"]["lifestyle"];

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
  return value === "none" || value === "occasional" || value === "regular"
    ? value
    : "";
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
  maximum?: number,
) {
  const normalized =
    typeof value === "number" && Number.isFinite(value)
      ? Math.max(1, Math.trunc(value))
      : fallback;

  return maximum ? Math.min(normalized, maximum) : normalized;
}

function getUtcDateRange(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const start = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(start.getTime()) ||
    start.toISOString().slice(0, 10) !== date
  ) {
    return null;
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function getLatestDraftConsultation(): Promise<GetLatestDraftConsultationResult> {
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
      console.error("Failed to fetch latest draft consultation", {
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
    console.error("Failed to fetch latest draft consultation", {
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Consultation could not be loaded at the moment",
    };
  }
}

export async function getActiveConsultation() {
  const patient = await requirePatient();
  try {
    const client = await createClient();
    const { data: activeConsultation, error } = await client
      .from("consultations")
      .select(
        "id, patient_id, doctor_id, status, created_at, updated_at, submitted_at, completed_at",
      )
      .eq("patient_id", patient.id)
      .eq("status", "submitted")
      .not("doctor_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("🚀 ~ getActiveConsultation ~ error:", error);
      return {
        success: false,
        message: "Error fetching consultation",
      };
    }

    if (!activeConsultation) {
      return {
        success: false,
        message: "No active consultation found",
      };
    }

    return {
      success: true,
      data: activeConsultation,
    };
  } catch (error) {
    console.log("🚀 ~ getActiveConsultation ~ error:", error);
    return {
      success: false,
      message: "Error fetching consultation",
    };
  }
}

export async function getPatientConsultations(
  options: GetPatientConsultationOptions = {},
): Promise<GetPatientConsultationResult> {
  const patient = await requirePatient();
  const page = normalizePositiveInteger(options.page, 1);
  const pageSize = normalizePositiveInteger(options.pageSize, 10, 100);
  const doctorName = options.doctorName?.trim();
  const submittedDate = options.submittedDate?.trim();
  const chiefComplaint = options.chiefComplaint?.trim();

  if (
    options.status &&
    !PATIENT_CONSULTATION_STATUSES.includes(options.status)
  ) {
    return {
      success: false,
      message: "Invalid consultation status",
    };
  }

  const submittedDateRange = submittedDate
    ? getUtcDateRange(submittedDate)
    : null;

  if (submittedDate && !submittedDateRange) {
    return {
      success: false,
      message: "Submitted date must use the YYYY-MM-DD format",
    };
  }

  try {
    const client = await createClient();
    let matchingDoctorIds: string[] | undefined;

    if (doctorName) {
      const { data: doctors, error: doctorsError } = await client
        .from("profiles")
        .select("id")
        .eq("role", "consultant")
        .ilike("full_name", `%${doctorName}%`);

      if (doctorsError) {
        console.error("Failed to filter consultations by doctor", {
          patientId: patient.id,
          error: doctorsError,
        });

        return {
          success: false,
          message: "Consultations could not be loaded at the moment",
        };
      }

      matchingDoctorIds = doctors.map(({ id }) => id);

      if (matchingDoctorIds.length === 0) {
        return {
          success: true,
          consultations: [],
          pagination: {
            page,
            pageSize,
            totalCount: 0,
            totalPages: 0,
          },
        };
      }
    }

    const offset = (page - 1) * pageSize;
    let query = client
      .from("consultations")
      .select(
        `
          id,
          status,
          created_at,
          updated_at,
          submitted_at,
          completed_at,
          doctor:profiles!consultations_doctor_id_fkey (
            id,
            full_name,
            doctor_profiles (
              specialty
            )
          ),
          consultation_intakes(chief_complaint)
        `,
        { count: "exact" },
      )
      .eq("patient_id", patient.id);

    if (matchingDoctorIds) {
      query = query.in("doctor_id", matchingDoctorIds);
    }

    if (options.status) {
      query = query.eq("status", options.status);
    }

    if (submittedDateRange) {
      query = query
        .gte("submitted_at", submittedDateRange.start)
        .lt("submitted_at", submittedDateRange.end);
    }

    if (chiefComplaint) {
      query = query
        .ilike("consultation_intakes.chief_complaint", `%${chiefComplaint}%`)
        .not("consultation_intakes", "is", null);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Failed to fetch patient consultations", {
        patientId: patient.id,
        error,
      });

      return {
        success: false,
        message: "Consultations could not be loaded at the moment",
      };
    }

    const totalCount = count ?? 0;

    return {
      success: true,
      consultations: data.map((consultation) => ({
        id: consultation.id,
        status: consultation.status,
        createdAt: consultation.created_at,
        updatedAt: consultation.updated_at,
        submittedAt: consultation.submitted_at,
        completedAt: consultation.completed_at,
        chiefComplaint:
          consultation.consultation_intakes?.chief_complaint ?? null,
        doctor: consultation.doctor
          ? {
              id: consultation.doctor.id,
              fullName: consultation.doctor.full_name,
              specialty: consultation.doctor.doctor_profiles?.specialty ?? null,
            }
          : null,
      })),
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch patient consultations", {
      patientId: patient.id,
      error,
    });

    return {
      success: false,
      message: "Consultations could not be loaded at the moment",
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
            smoking: toSmokingFormValue(lifestyleAssessment?.smoking_status),
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

import { z } from "zod";

export const consultationStatusSchema = z.enum([
  "draft",
  "submitted",
  "assigned",
  "completed",
]);

export const bookConsultationSchema = z.object({
  status: z.enum(["draft", "submitted"]),
});

export const adminConsultationStatusSchema = consultationStatusSchema.exclude([
  "draft",
]);

export const adminConsultationOptionsSchema = z.object({
  status: z.array(adminConsultationStatusSchema).default([]),
  sortBy: z.enum(["desc", "asc"]).default("desc"),
  page: z
    .number()
    .optional()
    .catch(1)
    .transform((value) => Math.max(1, Math.trunc(value ?? 1))),
  pageSize: z
    .number()
    .optional()
    .catch(10)
    .transform((value) => Math.min(100, Math.max(1, Math.trunc(value ?? 10)))),
  doctorName: z.string().trim().optional(),
  chiefComplaint: z.string().trim().optional(),
  submittedDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .pipe(
      z.iso.date("Submitted date must use the YYYY-MM-DD format").optional(),
    ),
});

export type GetAdminConsultationOptions = z.input<
  typeof adminConsultationOptionsSchema
>;

export const updateConsultationStatusSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  status: consultationStatusSchema,
});

export const patientMeasurementsSchema = z
  .object({
    consultationId: z.uuid("Invalid consultation ID."),
    systolicBp: z.number().min(40).max(300).nullable(),
    diastolicBp: z.number().min(30).max(200).nullable(),
    weightKg: z.number().positive().max(500).nullable(),
    measuredAt: z.iso.date().nullable(),
  })
  .refine((measurements) => measurements.systolicBp !== null, {
    message: "Systolic blood pressure is required.",
    path: ["systolicBp"],
  })
  .refine((measurements) => measurements.measuredAt !== null, {
    message: "Measurement date is required.",
    path: ["measuredAt"],
  });

export const consultationIntakeSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  redFlags: z.array(z.string().trim().min(1)).min(1, {
    message: "Select any urgent symptoms that apply, or select none.",
  }),
  redFlagsOther: z
    .string()
    .trim()
    .max(500, "Other urgent symptoms must be 500 characters or fewer."),
  chiefComplaint: z
    .string()
    .trim()
    .min(1, "Chief complaint is required.")
    .max(1000, "Chief complaint must be 1000 characters or fewer."),
  primaryConcern: z.string().trim().min(1, "Primary concern is required."),
  goals: z.array(z.string().trim().min(1)).min(1, {
    message: "Select at least one consultation goal.",
  }),
  goalsOther: z
    .string()
    .trim()
    .max(500, "Other consultation goal must be 500 characters or fewer."),
  usualHealth: z.string().trim(),
  symptoms: z.array(z.string().trim().min(1)),
  symptomsOther: z
    .string()
    .trim()
    .max(500, "Other symptoms must be 500 characters or fewer."),
  onset: z.string().trim(),
  pain: z.number().int().min(0).max(10).nullable(),
});

export const currentIssueTrendSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  trend: z.string().trim().min(1, "Current issue trend is required."),
  speedOfChange: z.string().trim().min(1, "Speed of change is required."),
  longitudinalTrend: z
    .string()
    .trim()
    .min(1, "Longitudinal trend is required."),
  redFlagSymptoms: z.array(z.string().trim().min(1)).min(1, {
    message: "Select any red flag symptoms that apply, or select none.",
  }),
});

export const medicalHistorySchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  conditions: z.array(z.string().trim().min(1)).min(1, {
    message: "Select a condition or select none.",
  }),
  recentSymptoms: z.array(z.string().trim().min(1)).min(1, {
    message: "Select a symptom or select none.",
  }),
});

export const medicationSchema = z.object({
  id: z.uuid("Invalid medication ID.").optional(),
  medicationName: z
    .string()
    .trim()
    .min(1, "Medication name is required.")
    .max(200, "Medication name must be 200 characters or fewer."),
  strength: z
    .string()
    .trim()
    .max(100, "Strength must be 100 characters or fewer."),
  quantity: z
    .string()
    .trim()
    .max(100, "Quantity must be 100 characters or fewer."),
  frequency: z
    .string()
    .trim()
    .max(100, "Frequency must be 100 characters or fewer."),
});

export const medicationsSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  medications: z
    .array(medicationSchema)
    .max(50, "No more than 50 medications can be added."),
});

export const allergySchema = z.object({
  id: z.uuid("Invalid allergy ID.").optional(),
  allergyName: z
    .string()
    .trim()
    .min(1, "Allergy name is required.")
    .max(200, "Allergy name must be 200 characters or fewer."),
  details: z
    .string()
    .trim()
    .max(1000, "Allergy details must be 1000 characters or fewer."),
});

export const allergiesSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  allergies: z
    .array(allergySchema)
    .max(50, "No more than 50 allergies can be added."),
});

const MAX_MEDICAL_RECORD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MEDICAL_RECORD_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_MEDICAL_RECORD_EXTENSIONS = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
]);

export const medicalRecordUploadSchema = z
  .object({
    consultationId: z.uuid("Invalid consultation ID."),
    file: z.custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      { message: "Select a medical record to upload" },
    ),
  })
  .superRefine(({ file }, context) => {
    if (typeof File === "undefined" || !(file instanceof File)) {
      return;
    }

    if (file.size === 0) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: "Select a medical record to upload",
      });
    }

    if (file.size > MAX_MEDICAL_RECORD_SIZE_BYTES) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: "Medical records must be 5 MB or smaller",
      });
    }

    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];

    if (
      !extension ||
      !ALLOWED_MEDICAL_RECORD_EXTENSIONS.has(extension) ||
      !ALLOWED_MEDICAL_RECORD_TYPES.has(file.type)
    ) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: "Upload a PDF, JPG, PNG, DOC, or DOCX file",
      });
    }
  });

export const lifestyleAssessmentSchema = z.object({
  consultationId: z.uuid("Invalid consultation ID."),
  recentWeightChange: z
    .enum(["", "yes", "no"])
    .refine((value) => value !== "", {
      message: "Select whether your weight changed recently.",
    }),
  smoking: z
    .enum(["", "never", "former", "current"])
    .refine((value) => value !== "", {
      message: "Select your smoking status.",
    }),
  alcohol: z
    .enum(["", "none", "occasional", "regular"])
    .refine((value) => value !== "", {
      message: "Select your alcohol use.",
    }),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Additional information must be 1000 characters or fewer."),
});

export type ConsultationStatus = z.infer<typeof consultationStatusSchema>;
export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
export type UpdateConsultationStatusInput = z.infer<
  typeof updateConsultationStatusSchema
>;
export type PatientMeasurements = z.infer<typeof patientMeasurementsSchema>;
export type ConsultationIntake = z.infer<typeof consultationIntakeSchema>;
export type CurrentIssueTrend = z.infer<typeof currentIssueTrendSchema>;
export type MedicalHistory = z.input<typeof medicalHistorySchema>;
export type Medication = z.infer<typeof medicationSchema>;
export type Medications = z.infer<typeof medicationsSchema>;
export type Allergy = z.infer<typeof allergySchema>;
export type Allergies = z.infer<typeof allergiesSchema>;
export type LifestyleAssessment = z.input<typeof lifestyleAssessmentSchema>;
export type LifestyleAssessmentFormValues = Omit<
  LifestyleAssessment,
  "consultationId"
>;

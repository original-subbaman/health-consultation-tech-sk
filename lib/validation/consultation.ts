import { z } from "zod";

export const consultationStatusSchema = z.enum([
  "draft",
  "submitted",
  "completed",
]);

export const bookConsultationSchema = z.object({
  status: z.enum(["draft", "submitted"]),
});

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

export type ConsultationStatus = z.infer<typeof consultationStatusSchema>;
export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
export type UpdateConsultationStatusInput = z.infer<
  typeof updateConsultationStatusSchema
>;
export type PatientMeasurements = z.infer<typeof patientMeasurementsSchema>;
export type ConsultationIntake = z.infer<typeof consultationIntakeSchema>;

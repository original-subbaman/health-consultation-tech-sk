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

export type ConsultationStatus = z.infer<typeof consultationStatusSchema>;
export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
export type UpdateConsultationStatusInput = z.infer<
  typeof updateConsultationStatusSchema
>;
export type PatientMeasurements = z.infer<typeof patientMeasurementsSchema>;

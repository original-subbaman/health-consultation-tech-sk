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

export type ConsultationStatus = z.infer<typeof consultationStatusSchema>;
export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
export type UpdateConsultationStatusInput = z.infer<
  typeof updateConsultationStatusSchema
>;

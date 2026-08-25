import { z } from "zod";

export const patientRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.email("Enter a valid email address"),
  dob: z.iso.date("Enter a valid date of birth"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const emailSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const passwordSchema = z.object({
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

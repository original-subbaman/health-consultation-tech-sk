"use server";

import { updatePatientProfile } from "@/lib/data/patient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const patientProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  nickname: z.string().trim().max(50, "Nickname is too long"),
  dob: z.iso.date("Enter a valid date of birth"),
  sex: z.enum(["female", "male", "intersex", "prefer_not_to_say"]),
  height: z.preprocess(
    (value) => (value === "" ? null : value),
    z.coerce.number().min(30).max(300).nullable(),
  ),
  weight: z.preprocess(
    (value) => (value === "" ? null : value),
    z.coerce.number().min(1).max(500).nullable(),
  ),
  displayNamePreference: z.enum(["full_name", "nickname"]),
});

export type PatientProfileUpdateState = {
  success?: boolean;
  message?: string;
};

export async function updatePatientProfileAction(
  _previousState: PatientProfileUpdateState,
  formData: FormData,
): Promise<PatientProfileUpdateState> {
  const result = patientProfileSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    dob: formData.get("dob"),
    sex: formData.get("sex"),
    height: formData.get("height"),
    weight: formData.get("weight"),
    displayNamePreference: formData.get("displayNamePreference"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Check your profile details.",
    };
  }

  try {
    await updatePatientProfile({
      fullName: result.data.name,
      nickname: result.data.nickname,
      dob: result.data.dob,
      gender: result.data.sex,
      height: result.data.height,
      weight: result.data.weight,
      displayNamePreference: result.data.displayNamePreference,
    });
  } catch {
    return {
      success: false,
      message: "We could not update your profile. Please try again.",
    };
  }

  revalidatePath("/patient/profile");
  revalidatePath("/patient/dashboard");

  return {
    success: true,
    message: "Your profile has been updated.",
  };
}

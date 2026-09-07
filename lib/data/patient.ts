import "server-only";

import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";

export type PatientProfile = {
  fullName: string;
  nickname?: string;
  dob: string;
  gender: string;
  height: number | null;
  weight: number | null;
  displayNamePreference: "full_name" | "nickname";
};

export type PatientProfileUpdate = Pick<
  PatientProfile,
  | "fullName"
  | "nickname"
  | "dob"
  | "gender"
  | "height"
  | "weight"
  | "displayNamePreference"
>;

export async function getPatientProfile(): Promise<PatientProfile> {
  const user = await requirePatient();
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("patient_profiles")
    .select(
      "nickname, date_of_birth, sex, height_cm, weight_kg, display_name_preference",
    )
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to fetch patient profile", profileError);
    throw new Error("Failed to fetch patient profile");
  }

  return {
    fullName: user.name,
    nickname: profile.nickname ?? "",
    dob: profile.date_of_birth ?? "",
    gender: profile.sex ?? "",
    height: profile.height_cm ?? null,
    weight: profile.weight_kg ?? null,
    displayNamePreference: profile.display_name_preference ?? "full_name",
  };
}

export async function updatePatientProfile(
  updatedProfile: PatientProfileUpdate,
): Promise<PatientProfile> {
  const user = await requirePatient();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("patient_profiles")
    .update({
      nickname: updatedProfile.nickname || null,
      date_of_birth: updatedProfile.dob,
      sex: updatedProfile.gender,
      height_cm: updatedProfile.height,
      weight_kg: updatedProfile.weight,
      display_name_preference: updatedProfile.displayNamePreference,
    })
    .eq("user_id", user.id)
    .select(
      "nickname, date_of_birth, sex, height_cm, weight_kg, display_name_preference",
    )
    .single();

  if (error) {
    console.error("Failed to update patient profile", error);
    throw new Error("Failed to update patient profile");
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: updatedProfile.fullName },
  });

  if (authError) {
    console.error("Failed to update patient name", authError);
    throw new Error("Failed to update patient name");
  }

  return {
    fullName: updatedProfile.fullName,
    nickname: profile.nickname ?? "",
    dob: profile.date_of_birth ?? "",
    gender: profile.sex ?? "",
    height: profile.height_cm ?? null,
    weight: profile.weight_kg ?? null,
    displayNamePreference: profile.display_name_preference ?? "full_name",
  };
}

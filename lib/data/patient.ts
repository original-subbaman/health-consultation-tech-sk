"use server";

import { requirePatient } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";

export type PatientProfile = {
  fullName: string;
  dob: string;
  gender: string;
  height: number | null;
  weight: number | null;
};

export async function getPatientProfile(): Promise<PatientProfile> {
  const user = await requirePatient();
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("patient_profiles")
    .select("date_of_birth, sex, height_cm, weight_kg")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to fetch patient profile", profileError);
    throw new Error("Failed to fetch patient profile");
  }

  return {
    fullName: user.name,
    dob: profile.date_of_birth ?? "",
    gender: profile.sex ?? "",
    height: profile.height_cm ?? null,
    weight: profile.weight_kg ?? null,
  };
}

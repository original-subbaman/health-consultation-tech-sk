import "server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { USER_ROLES } from "@/lib/constants";

export type PatientUser = {
  id: string;
  name: string;
  role: typeof USER_ROLES.PATIENT;
};

/**
 * Verifies the current Supabase session and authorizes access to patient-only
 * server-rendered routes. The result is cached for the lifetime of a render so
 * layouts, pages, and data loaders can safely call it without duplicate reads.
 */
export const requirePatient = cache(async (): Promise<PatientUser> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/patient/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to authorize patient", profileError);
    redirect("/");
  }

  if (profile.role !== USER_ROLES.PATIENT) {
    redirect("/");
  }

  const metadataName = user.user_metadata.full_name;

  return {
    id: user.id,
    name:
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim()
        : (user.email ?? "Patient"),
    role: "patient",
  };
});

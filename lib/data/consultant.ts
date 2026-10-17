import "server-only";

import { requireAdmin } from "@/lib/auth/auth";
import { USER_ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export type ConsultantProfile = {
  id: string;
  email: string | null;
  fullName: string;
  role: string;
  specialty: string | null;
  createdAt: string;
};

/** Minimal doctor details for the admin consultation picker. */
export async function getDoctorOptions() {
  await requireAdmin();
  const client = await createClient();
  const doctors: { id: string; label: string; specialty: string | null }[] = [];

  // Supabase caps result sizes, so fetch every page of doctors.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client
      .from("profiles")
      .select("id, full_name, doctor_profiles(specialty)")
      .eq("role", USER_ROLES.CONSULTANT)
      .order("full_name")
      .order("id")
      .range(offset, offset + 999);

    if (error) throw new Error("Failed to fetch doctors");
    doctors.push(...data.map((doctor) => ({
      id: doctor.id,
      label: doctor.full_name,
      specialty: doctor.doctor_profiles?.specialty ?? null,
    })));
    if (data.length < 1000) break;
  }

  return doctors;
}

export async function getConsultants({
  name,
  limit = 10,
  offset = 0,
}: {
  name?: string;
  limit?: number;
  offset?: number;
}): Promise<ConsultantProfile[]> {
  await requireAdmin();

  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const safeOffset = Math.max(Math.trunc(offset), 0);

  try {
    const client = await createClient();
    let query = client
      .from("profiles")
      .select(
        `
          id,
          full_name,
          role,
          created_at,
          email,
          doctor_profiles (
            specialty
          )
        `,
      )
      .eq("role", USER_ROLES.CONSULTANT)
      .order("created_at", { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1);

    const trimmedName = name?.trim();

    if (trimmedName) {
      query = query.ilike("full_name", `%${trimmedName}%`);
    }

    const { data: consultants, error } = await query;

    if (error) throw error;

    return consultants.map((consultant) => ({
      id: consultant.id,
      email: consultant.email,
      fullName: consultant.full_name,
      role: consultant.role,
      specialty: consultant.doctor_profiles?.specialty ?? null,
      createdAt: consultant.created_at,
    }));
  } catch (error) {
    console.error("Error fetching consultants:", error);
    throw new Error("Failed to fetch consultants");
  }
}

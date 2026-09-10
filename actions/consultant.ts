"use server";

import { USER_ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { z } from "zod";

const createConsultantSchema = z.object({
  email: z.email(),
  temporaryPassword: z.string().min(8),
  fullName: z.string().trim().min(2).max(100),
  specialty: z.string().trim().min(1).optional(),
  licenseNumber: z.string().trim().min(1).optional(),
  licenseRegion: z.string().trim().min(1).optional(),
});

export type CreateConsultantInput = z.infer<typeof createConsultantSchema>;

export type CreateConsultantState = {
  success?: boolean;
  message?: string;
};

export async function createConsultant(input: CreateConsultantInput) {
  const result = createConsultantSchema.safeParse(input);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Invalid consultant details",
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: adminProfile, error: adminProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfileError || adminProfile?.role !== USER_ROLES.ADMIN) {
    throw new Error("Forbidden");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured");
  }

  const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email: result.data.email,
      password: result.data.temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: result.data.fullName,
      },
      app_metadata: {
        role: USER_ROLES.CONSULTANT,
      },
    });

  if (createUserError) {
    throw new Error(createUserError.message);
  }

  const consultantId = data.user.id;
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      role: USER_ROLES.CONSULTANT,
      full_name: result.data.fullName,
    })
    .eq("id", consultantId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: doctorProfileError } = await supabaseAdmin
    .from("doctor_profiles")
    .insert({
      user_id: consultantId,
      specialty: result.data.specialty ?? null,
    });

  if (doctorProfileError) {
    throw new Error(doctorProfileError.message);
  }

  return {
    id: consultantId,
    email: data.user.email,
  };
}

export async function createConsultantAction(
  _previousState: CreateConsultantState,
  formData: FormData,
): Promise<CreateConsultantState> {
  try {
    await createConsultant({
      email: String(formData.get("email") ?? ""),
      temporaryPassword: String(formData.get("password") ?? ""),
      fullName: String(formData.get("name") ?? ""),
      specialty: String(formData.get("specialty") ?? ""),
    });

    return {
      success: true,
      message: "Consultant account created successfully.",
    };
  } catch (error) {
    console.error("Consultant creation failed", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "We could not create the consultant account.",
    };
  }
}

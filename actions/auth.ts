"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, patientRegistrationSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export type RegistrationState = {
  success?: boolean;
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    dob?: string[];
    password?: string[];
  };
};

export type LoginState = {
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function registerPatient(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const result = patientRegistrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    dob: formData.get("dob"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = z.treeifyError(result.error);

    return {
      fieldErrors: {
        ...(errors.properties?.name?.errors.length && {
          name: errors.properties.name.errors,
        }),
        ...(errors.properties?.email?.errors.length && {
          email: errors.properties.email.errors,
        }),
        ...(errors.properties?.dob?.errors.length && {
          dob: errors.properties.dob.errors,
        }),
        ...(errors.properties?.password?.errors.length && {
          password: errors.properties.password.errors,
        }),
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        full_name: result.data.name,
        date_of_birth: result.data.dob,
      },
    },
  });

  if (error) {
    // Log the detailed error on the server.
    console.error("Patient registration failed", error);

    // Avoid revealing whether an email address already exists.
    return {
      message:
        "We could not complete registration. Check your information and try again.",
    };
  }

  return {
    success: true,
    message: "Check your email to confirm your account.",
  };
}

export async function loginPatient(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = z.treeifyError(result.error);

    return {
      fieldErrors: {
        ...(errors.properties?.email?.errors.length && {
          email: errors.properties.email.errors,
        }),
        ...(errors.properties?.password?.errors.length && {
          password: errors.properties.password.errors,
        }),
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      message: "The email address or password is incorrect.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();

    return {
      message: "We could not verify your account.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "patient") {
    await supabase.auth.signOut();

    return {
      message: "This account cannot access the patient portal.",
    };
  }

  redirect("/patient/dashboard");
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = z.treeifyError(result.error);

    return {
      fieldErrors: {
        ...(errors.properties?.email?.errors.length && {
          email: errors.properties.email.errors,
        }),
        ...(errors.properties?.password?.errors.length && {
          password: errors.properties.password.errors,
        }),
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      message: "The email address or password is incorrect.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();

    return {
      message: "We could not verify your account.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();

    return {
      message: "This account cannot access the admin portal.",
    };
  }

  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed", error);
    return;
  }

  redirect("/");
}

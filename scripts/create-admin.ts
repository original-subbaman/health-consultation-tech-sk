import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} in .env.local`);
  }

  return value;
}

async function createAdmin() {
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseSecretKey = getRequiredEnv(
    "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  );

  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    throw new Error("Usage: node scripts/create-admin.ts <email> <password>");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role: "admin",
    },
    user_metadata: {
      full_name: "Admin User",
    },
  });

  if (error) {
    throw error;
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      role: "admin",
    })
    .eq("id", data.user.id);

  if (profileError) {
    throw profileError;
  }

  console.log(`Admin created: ${data.user.id}`);
}

createAdmin().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to create admin: ${message}`);
  process.exitCode = 1;
});

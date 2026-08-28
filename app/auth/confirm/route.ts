import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = getEmailOtpType(url.searchParams.get("type"));
  const next = getSafeNextPath(url.searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/patient/login?error=confirmation_failed", url.origin),
  );
}

function getEmailOtpType(value: string | null): EmailOtpType | null {
  if (!value || !emailOtpTypes.has(value as EmailOtpType)) {
    return null;
  }

  return value as EmailOtpType;
}

function getSafeNextPath(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

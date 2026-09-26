import "server-only";

import type { createClient } from "@/lib/supabase/server";

const MEDICAL_RECORDS_BUCKET = "medical-records";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type SaveMedicalRecordFileResult =
  | { success: true }
  | {
      success: false;
      stage: "upload";
      error: unknown;
    }
  | {
      success: false;
      stage: "metadata";
      error: unknown;
      cleanupError: unknown;
    };

export async function saveMedicalRecordFile({
  client,
  consultationId,
  file,
  patientId,
}: {
  client: ServerSupabaseClient;
  consultationId: string;
  file: File;
  patientId: string;
}): Promise<SaveMedicalRecordFileResult> {
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
  const sanitizedFilename =
    file.name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-120) || `medical-record${extension}`;
  const storagePath = `${patientId}/${consultationId}/${crypto.randomUUID()}-${sanitizedFilename}`;
  const { data: uploadedFile, error: uploadError } = await client.storage
    .from(MEDICAL_RECORDS_BUCKET)
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      stage: "upload",
      error: uploadError,
    };
  }

  const { error: documentError } = await client.from("documents").insert({
    consultation_id: consultationId,
    document_type: "medical_record",
    file_size: file.size,
    mime_type: file.type,
    original_filename: file.name,
    storage_path: uploadedFile.path,
    uploaded_by: patientId,
  });

  if (documentError) {
    const { error: cleanupError } = await client.storage
      .from(MEDICAL_RECORDS_BUCKET)
      .remove([uploadedFile.path]);

    return {
      success: false,
      stage: "metadata",
      error: documentError,
      cleanupError,
    };
  }

  return { success: true };
}

"use client";

import { generateConsultationScript } from "@/actions/consultations";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState, useTransition } from "react";

export default function AIConsultationScriptSection({
  consultationId,
  savedScript,
  initialLoadError = null,
}: {
  consultationId: string;
  savedScript: string | null;
  initialLoadError?: string | null;
}) {
  const [script, setScript] = useState<string | null>(savedScript);
  const [error, setError] = useState<string | null>(initialLoadError);
  const [isPending, startTransition] = useTransition();

  function generate() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await generateConsultationScript({ consultationId });
        if (!result.success) {
          setError(result.message);
          return;
        }
        setScript(result.script);
      } catch {
        setError(
          "Consultation script could not be generated. Please try again.",
        );
      }
    });
  }

  return (
    <section
      aria-label="AI consultation script"
      className="space-y-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          AI Consultation Script
        </h2>
        <Button
          onClick={generate}
          disabled={isPending}
          aria-busy={isPending}
          className="sm:ml-auto"
        >
          {isPending
            ? "Generating..."
            : script
              ? "Regenerate script"
              : "Generate script"}
        </Button>
      </div>
      <p role="status" className="text-sm text-on-surface-variant">
        {isPending
          ? "Generating the consultation briefing. Please wait."
          : "A spoken briefing based on the AI evaluation, for clinician review."}
      </p>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      {script && (
        <div className="whitespace-pre-wrap wrap-break-words rounded-lg bg-surface-container-low p-4 leading-relaxed text-on-surface">
          {script}
        </div>
      )}
    </section>
  );
}

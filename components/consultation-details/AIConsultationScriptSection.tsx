"use client";

import {
  generateConsultationAudioAction,
  generateConsultationScript,
} from "@/actions/consultations";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

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
  const [isAudioPending, startAudioTransition] = useTransition();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const currentAudioUrl = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (currentAudioUrl.current) URL.revokeObjectURL(currentAudioUrl.current);
    };
  }, []);

  function clearAudio() {
    if (currentAudioUrl.current) URL.revokeObjectURL(currentAudioUrl.current);
    currentAudioUrl.current = null;
    setAudioUrl(null);
  }

  function generateAudio() {
    if (!script?.trim() || isPending || isAudioPending) return;
    setError(null);
    startAudioTransition(async () => {
      try {
        const result = await generateConsultationAudioAction({
          consultationId,
        });
        if (!mounted.current) return;
        if (!result.success) {
          setError(result.message);
          return;
        }
        // Keep the displayed text aligned with the saved script that was spoken.
        setScript(result.script);
        const blob = new Blob([new Uint8Array(result.audio)], {
          type: "audio/mpeg",
        });
        const url = URL.createObjectURL(blob);
        clearAudio();
        currentAudioUrl.current = url;
        setAudioUrl(url);
      } catch {
        if (mounted.current) {
          setError(
            "Consultation audio could not be generated. Please try again.",
          );
        }
      }
    });
  }

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
        clearAudio();
      } catch {
        setError(
          "Consultation script could not be generated. Please try again.",
        );
      }
    });
  }

  return (
    <details
      aria-label="AI consultation script"
      className="group rounded-xl bg-surface-container-lowest shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-6 outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <h2 className="min-w-0 flex-1 font-headline-md text-headline-md text-on-surface">
          AI Consultation Script
        </h2>
        <ChevronDown
          className="size-5 shrink-0 text-on-surface-variant transition-transform group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-5 px-6 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-on-surface-variant">
            {isAudioPending
              ? "Generating audio. Please wait."
              : isPending
                ? "Generating the consultation briefing. Please wait."
                : "A spoken briefing based on the AI evaluation, for clinician review."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={generate}
              disabled={isPending || isAudioPending}
              aria-busy={isPending}
              className="shrink-0"
            >
              {isPending
                ? "Generating..."
                : script
                  ? "Regenerate script"
                  : "Generate script"}
            </Button>
            {script?.trim() && (
              <Button
                type="button"
                variant="secondary"
                onClick={generateAudio}
                disabled={isPending || isAudioPending}
                aria-busy={isAudioPending}
                className="shrink-0"
              >
                {isAudioPending ? "Generating Audio..." : "Generate Audio"}
              </Button>
            )}
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        {audioUrl && (
          <audio
            key={audioUrl}
            controls
            src={audioUrl}
            aria-label="AI consultation briefing audio"
            className="w-full"
            onError={() =>
              setError(
                "The generated audio could not be played. Please try generating it again.",
              )
            }
          />
        )}
        {script && (
          <div className="whitespace-pre-wrap wrap-break-words rounded-lg bg-surface-container-low p-4 leading-relaxed text-on-surface">
            {script}
          </div>
        )}
      </div>
    </details>
  );
}

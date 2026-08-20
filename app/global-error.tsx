"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8f9ff", color: "#0b1c30", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <title>Something went wrong | Serene Health</title>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px", boxSizing: "border-box" }}>
          <section style={{ width: "100%", maxWidth: "640px", boxSizing: "border-box", border: "1px solid #bcc9c6", borderRadius: "16px", background: "#ffffff", padding: "48px 32px", textAlign: "center", boxShadow: "0 10px 25px -5px rgb(13 148 136 / 0.05)" }}>
            <div style={{ margin: "0 auto", display: "grid", width: "56px", height: "56px", placeItems: "center", borderRadius: "999px", background: "#ffdad6", color: "#ba1a1a", fontSize: "24px", fontWeight: 700 }}>!</div>
            <p style={{ margin: "24px 0 0", color: "#ba1a1a", fontSize: "14px", fontWeight: 600, letterSpacing: ".05em" }}>SOMETHING WENT WRONG</p>
            <h1 style={{ margin: "12px 0 0", fontSize: "32px", lineHeight: 1.25 }}>We couldn&apos;t load Serene Health</h1>
            <p style={{ margin: "16px auto 0", maxWidth: "480px", color: "#3d4947", fontSize: "16px", lineHeight: 1.5 }}>This may be a temporary problem. Please try loading the app again.</p>
            {error.digest ? <p style={{ margin: "12px 0 0", color: "#6d7a77", fontFamily: "monospace", fontSize: "12px" }}>Reference: {error.digest}</p> : null}
            <button type="button" onClick={() => retry()} style={{ marginTop: "32px", cursor: "pointer", border: 0, borderRadius: "12px", background: "#00685f", padding: "14px 24px", color: "#ffffff", fontSize: "14px", fontWeight: 600 }}>
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

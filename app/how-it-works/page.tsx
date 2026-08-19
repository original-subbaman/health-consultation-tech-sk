import Link from "next/link";

const steps = [
  { title: "Share Your Health Information", description: "Fill out a simple intake form with your symptoms, medical history, medications, and other relevant details.", note: "Usually takes 10–15 minutes", icon: "form" },
  { title: "Upload Supporting Documents", description: "Add any previous reports, test results, prescriptions, or medical images that may help the doctor understand your case.", note: "Securely stored with your case", icon: "upload" },
  { title: "AI Creates a Clinical Summary", description: "AI reviews the information you provide and creates a concise summary to help the doctor quickly understand your case. Your original intake and documents remain available for the doctor to review.", note: "AI organizes your information — it does not diagnose", icon: "spark" },
  { title: "A Doctor Reviews Your Case", description: "The assigned doctor reviews your information, documents, and AI-generated summary before providing their assessment.", note: "Every case is reviewed by a qualified doctor", icon: "doctor" },
  { title: "Receive Your Report", description: "Once the doctor has completed and approved their feedback, you can view and download a clear patient-friendly report.", note: "Clear next steps you can keep and revisit", icon: "report" },
] as const;

function StepIcon({ type }: { type: (typeof steps)[number]["icon"] }) {
  if (type === "form") return <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8m-8 5h8m-8 4h5m-7 8h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />;
  if (type === "upload") return <><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4" /><path strokeLinecap="round" d="M5 13v6h14v-6" /></>;
  if (type === "spark") return <><path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z" /><path strokeLinecap="round" d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" /></>;
  if (type === "doctor") return <><circle cx="12" cy="8" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-3a6 6 0 0 1 12 0v3m-9-5 3 3 3-3" /></>;
  return <><path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l4 4v14H7V3Z" /><path strokeLinecap="round" d="M14 3v5h4M10 12h5m-5 4h5" /></>;
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background text-on-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-on-surface" aria-label="Serene Health home">
          <span className="grid size-10 place-items-center rounded-md bg-primary text-xl text-on-primary">+</span><span>Serene Health</span>
        </Link>
        <Link href="/" className="text-label-md text-primary transition hover:text-primary-container">Back to home</Link>
      </nav>

      <header className="relative overflow-hidden border-y border-outline-variant/40 bg-surface-container-low py-16 sm:py-24">
        <div className="absolute -right-20 -top-28 size-72 rounded-full bg-secondary-fixed/50" />
        <div className="absolute -bottom-28 -left-20 size-64 rounded-full bg-primary-fixed/40" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-8">
          <span className="inline-flex rounded-full bg-primary-fixed px-4 py-2 text-label-sm text-on-primary-fixed-variant">YOUR CARE JOURNEY</span>
          <h1 className="mt-6 text-[2.5rem] leading-tight font-bold tracking-[-0.02em] text-on-surface sm:text-headline-xl">How it works</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-on-surface-variant">From sharing your health story to receiving a doctor-approved report, every step is designed to feel simple, secure, and clear.</p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-24">
        <ol className="relative">
          <div aria-hidden="true" className="absolute bottom-12 left-7 top-12 hidden w-px bg-outline-variant sm:block" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative grid gap-5 pb-10 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:gap-8 sm:pb-12">
              <div className="relative z-10 grid size-14 place-items-center rounded-full bg-primary font-semibold text-on-primary shadow-ambient">{index + 1}</div>
              <article className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-fixed text-primary">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8"><StepIcon type={step.icon} /></svg>
                  </span>
                  <div><p className="text-label-sm text-primary">STEP {index + 1}</p><h2 className="mt-1 text-xl font-semibold text-on-surface sm:text-headline-md">{step.title}</h2></div>
                </div>
                <p className="mt-5 text-body-md text-on-surface-variant">{step.description}</p>
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg>
                  <span>{step.note}</span>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-4 mb-16 rounded-xl bg-inverse-surface px-6 py-12 text-center text-inverse-on-surface sm:mx-8 sm:mb-24 sm:px-10 lg:mx-auto lg:max-w-6xl">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-inverse-primary/15 text-inverse-primary"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.8 2.9 8.2 7 10 4.1-1.8 7-5.2 7-10V6l-7-3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></svg></div>
          <h2 className="mt-5 text-headline-md">Ready to share your health concern?</h2>
          <p className="mt-3 text-inverse-on-surface/75">Your information stays private and is shared only with the care team reviewing your case.</p>
          <Link href="/#consultation" className="mt-7 inline-flex rounded-lg bg-inverse-primary px-6 py-3.5 text-label-md text-on-primary-fixed shadow-ambient transition hover:-translate-y-0.5">Start your consultation</Link>
        </div>
      </section>
    </main>
  );
}

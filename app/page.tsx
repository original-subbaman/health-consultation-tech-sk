const CalendarIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.8 2.9 8.2 7 10 4.1-1.8 7-5.2 7-10V6l-7-3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>
);

const MessageIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v12H9l-5 4V5Z" />
    <path strokeLinecap="round" d="M8 9h8m-8 4h5" />
  </svg>
);

export default function Home() {
  const steps = [
    { icon: <CalendarIcon />, title: "Choose your time", copy: "Find an appointment that works around your day." },
    { icon: <MessageIcon />, title: "Talk to a clinician", copy: "Meet securely by video and discuss what’s worrying you." },
    { icon: <ShieldIcon />, title: "Get a clear plan", copy: "Leave with practical next steps and ongoing support." },
  ];

  return (
    <main className="min-h-screen bg-background text-on-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8 lg:px-16">
        <a href="#" className="flex items-center gap-3 font-semibold tracking-tight text-on-surface" aria-label="Serene Health home">
          <span className="grid size-10 place-items-center rounded-md bg-primary text-xl text-on-primary">+</span>
          <span>Serene Health</span>
        </a>
        <a href="#consultation" className="rounded-lg border border-primary px-4 py-2.5 text-label-md text-primary transition hover:-translate-y-0.5 hover:bg-primary-fixed/40">Sign in</a>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-8 md:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-16 lg:pb-20">
        <div>
          <span className="inline-flex rounded-full bg-primary-fixed px-4 py-2 text-label-sm text-on-primary-fixed-variant">CARE THAT FITS YOUR LIFE</span>
          <h1 className="mt-6 max-w-2xl text-[2.5rem] leading-[1.12] font-bold tracking-[-0.02em] text-on-surface sm:text-headline-xl lg:text-[3.75rem] lg:leading-[1.08]">Feel better, with the right care at the right time.</h1>
          <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">Connect with trusted clinicians from the comfort of home. Clear guidance, thoughtful support, and care that puts you first.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#consultation" className="rounded-lg bg-primary px-6 py-3.5 text-center text-label-md text-on-primary shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover">Book a consultation</a>
            <a href="/how-it-works" className="rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-3.5 text-center text-label-md text-primary transition hover:-translate-y-0.5 hover:border-primary">See how it works</a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-container p-5 sm:p-8">
          <div className="absolute -right-16 -top-16 size-52 rounded-full bg-secondary-fixed/70" />
          <div className="absolute -bottom-20 -left-12 size-56 rounded-full bg-primary-fixed/50" />
          <div className="relative rounded-xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-label-sm text-on-surface-variant">UPCOMING APPOINTMENT</p><h2 className="mt-2 text-headline-md">Today, 3:30 PM</h2></div>
              <span className="grid size-12 place-items-center rounded-full bg-primary-fixed text-primary"><CalendarIcon /></span>
            </div>
            <div className="my-6 h-px bg-outline-variant/60" />
            <div className="flex items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary-fixed text-lg font-semibold text-on-secondary-fixed-variant">AM</div>
              <div><p className="font-semibold">Dr. Ananya Mehta</p><p className="text-sm text-on-surface-variant">General Physician · Video visit</p></div>
            </div>
            <div className="mt-6 rounded-lg bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">Your consultation is confirmed. We’ll send a reminder 10 minutes before it begins.</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-surface-container-low py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <div className="max-w-xl"><p className="text-label-md text-primary">SIMPLE &amp; SUPPORTIVE</p><h2 className="mt-3 text-headline-lg text-on-surface">Healthcare without the hurdles</h2></div>
          <div id="consultation" className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((item) => (
              <article key={item.title} className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover sm:p-8">
                <span className="grid size-12 place-items-center rounded-lg bg-primary-fixed text-primary">{item.icon}</span>
                <h3 className="mt-6 text-xl font-semibold text-on-surface">{item.title}</h3>
                <p className="mt-3 leading-6 text-on-surface-variant">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import { Rocket } from "lucide-react";
import Link from "next/link";

export default function GetStartedCard() {
  return (
    <section className="relative h-full overflow-hidden rounded-lg border border-surface-variant bg-surface-container-low p-gutter shadow-ambient transition-shadow duration-300 hover:shadow-ambient-hover">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
      <div className="flex flex-col items-start gap-4 p-2">
        <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-xl">
          <Rocket aria-hidden="true" className="size-4 text-primary" />
          Get Started
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Begin Your Health Journey
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Book your first consultation with a specialist or complete your health
          profile to unlock personalized insights.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link href="/patient/book-consultation">
            <button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2.5 px-5 rounded-md transition-colors">
              Book Consultation
            </button>
          </Link>
          <Link href="/patient/profile">
            <button className="bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-2.5 px-5 rounded-md transition-colors border border-outline-variant">
              Complete Profile
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

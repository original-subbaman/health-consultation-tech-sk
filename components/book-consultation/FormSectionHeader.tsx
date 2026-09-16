export default function FormSectionHeader({
  heading,
  subheading,
  helper,
}: {
  heading: string;
  subheading?: string;
  helper?: string;
}) {
  return (
    <header className="flex flex-col gap-2 pt-4">
      <span className="font-label-md text-label-md font-semibold uppercase tracking-wider text-primary">
        {subheading}
      </span>
      <h5 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface md:font-headline-md md:text-headline-md">
        {heading}
      </h5>
      <p className="max-w-3xl font-body-lg text-body-md text-on-surface-variant">
        {helper}
      </p>
    </header>
  );
}

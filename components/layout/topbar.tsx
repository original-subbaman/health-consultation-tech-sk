type TopBarProps = {
  user: { name: string; role: string };
};

export default function TopBar({ user }: TopBarProps) {
  const userInitial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-surface px-margin-mobile shadow-sm dark:bg-inverse-surface dark:shadow-none md:hidden">
      <div className="flex items-center gap-2">
        <span className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">
          HealthSync
        </span>
      </div>
      <div
        aria-label={`${user.name}, ${user.role}`}
        className="grid size-9 place-items-center rounded-full bg-primary text-label-sm font-bold text-on-primary"
      >
        {userInitial}
      </div>
    </header>
  );
}

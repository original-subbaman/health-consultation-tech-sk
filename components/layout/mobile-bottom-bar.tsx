import MobileNavItem from "../navigation/mobile-nav-item";
import { NavigationItem } from "../portal/portal-shell";

type MobileBottomBarProps = {
  navigation: NavigationItem[];
};

export default function MobileBottomBar({ navigation }: MobileBottomBarProps) {
  return (
    <nav className="fixed bottom-0 w-full md:hidden rounded-t-xl bg-surface dark:bg-inverse-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-center h-16 pb-safe px-2 z-50">
      {navigation.map(({ href, label, icon: Icon }) => (
        <MobileNavItem
          key={href}
          icon={<Icon className="size-5" />}
          href={href}
          label={label}
        />
      ))}
    </nav>
  );
}

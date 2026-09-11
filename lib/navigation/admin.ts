import { BriefcaseMedical, ClipboardList, LayoutDashboard } from "lucide-react";

export const adminNavigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Consultants",
    href: "/admin/consultants",
    icon: ClipboardList,
  },
  {
    label: "Add Consultants",
    href: "/admin/add-consultant",
    icon: BriefcaseMedical,
  },
];

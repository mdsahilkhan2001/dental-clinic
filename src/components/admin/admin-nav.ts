import {
  CalendarDays,
  Images,
  LayoutDashboard,
  type LucideIcon,
  MessagesSquare,
  Newspaper,
  Settings,
  Sparkles,
  Stethoscope,
  UserRound,
  HelpCircle,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
  exact?: boolean;
};

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", Icon: LayoutDashboard, exact: true },
  { label: "Appointments", href: "/admin/appointments", Icon: CalendarDays },
  { label: "Services", href: "/admin/services", Icon: Sparkles },
  { label: "Doctors", href: "/admin/doctors", Icon: Stethoscope },
  { label: "Gallery", href: "/admin/gallery", Icon: Images },
  { label: "Testimonials", href: "/admin/testimonials", Icon: MessagesSquare },
  { label: "FAQs", href: "/admin/faqs", Icon: HelpCircle },
  { label: "Content", href: "/admin/content", Icon: Newspaper },
  { label: "Clinic Settings", href: "/admin/settings", Icon: Settings },
  { label: "Admin Profile", href: "/admin/profile", Icon: UserRound },
];

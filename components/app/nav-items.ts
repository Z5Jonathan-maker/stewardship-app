import {
  LayoutDashboard,
  Receipt,
  PieChart,
  LineChart,
  Target,
  HandHeart,
  Wallet,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary app navigation — shared by the desktop sidebar and mobile drawer. */
export const appNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: Receipt },
  { label: "Budget", href: "/budget", icon: PieChart },
  { label: "Cash Flow", href: "/cashflow", icon: LineChart },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Giving", href: "/giving", icon: HandHeart },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Ask Unite", href: "/assistant", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

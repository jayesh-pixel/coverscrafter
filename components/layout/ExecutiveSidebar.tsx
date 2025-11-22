"use client";

import Sidebar, { NavItem } from "./Sidebar";
import { MdDashboard, MdAddCircle, MdHistory, MdLocalOffer, MdConfirmationNumber, MdAccountBalance, MdAttachMoney, MdAccountBalanceWallet } from "react-icons/md";

const executiveNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/executive", icon: ({ active }: { active: boolean }) => <MdDashboard className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Create Insurance", href: "/dashboard/executive/create-insurance", icon: ({ active }: { active: boolean }) => <MdAddCircle className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Insurance History", href: "/dashboard/executive/insurance-history", icon: ({ active }: { active: boolean }) => <MdHistory className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Claims Tickets", href: "/dashboard/executive/claims-tickets", icon: ({ active }: { active: boolean }) => <MdLocalOffer className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Tickets", href: "/dashboard/executive/tickets", icon: ({ active }: { active: boolean }) => <MdConfirmationNumber className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Financiers Tickets", href: "/dashboard/executive/financiers-tickets", icon: ({ active }: { active: boolean }) => <MdAccountBalance className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Price List", href: "/dashboard/executive/price-list", icon: ({ active }: { active: boolean }) => <MdAttachMoney className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
  { label: "Top-Up", href: "/dashboard/executive/top-up", icon: ({ active }: { active: boolean }) => <MdAccountBalanceWallet className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} /> },
];

export default function ExecutiveSidebar() {
  return <Sidebar navItems={executiveNavItems} userName="Arjun Mehta" userRole="Executive" />;
}

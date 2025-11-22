"use client";

import Sidebar, { NavItem } from "./Sidebar";
import { MdDashboard, MdHistory, MdConfirmationNumber, MdAccountBalance, MdAttachMoney, MdAccountBalanceWallet, MdWallet, MdReceipt, MdAssessment, MdManageAccounts, MdPerson } from "react-icons/md";

const ownerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/owner", icon: ({ active }: { active: boolean }) => <MdDashboard className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Insurance History", href: "/dashboard/owner/insurance-history", icon: ({ active }: { active: boolean }) => <MdHistory className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Tickets", href: "/dashboard/owner/tickets", icon: ({ active }: { active: boolean }) => <MdConfirmationNumber className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Financiers Tickets", href: "/dashboard/owner/financiers-tickets", icon: ({ active }: { active: boolean }) => <MdAccountBalance className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Price List", href: "/dashboard/owner/price-list", icon: ({ active }: { active: boolean }) => <MdAttachMoney className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Wallet Transaction", href: "/dashboard/owner/wallet-transaction", icon: ({ active }: { active: boolean }) => <MdWallet className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Top-Up", href: "/dashboard/owner/top-up", icon: ({ active }: { active: boolean }) => <MdAccountBalanceWallet className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Invoice", href: "/dashboard/owner/invoices", icon: ({ active }: { active: boolean }) => <MdReceipt className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Business Report", href: "/dashboard/owner/business-report", icon: ({ active }: { active: boolean }) => <MdAssessment className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Accounts", href: "/dashboard/owner/accounts", icon: ({ active }: { active: boolean }) => <MdManageAccounts className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
  { label: "Profile", href: "/dashboard/owner/profile", icon: ({ active }: { active: boolean }) => <MdPerson className={`h-5 w-5 ${active ? "text-white" : "text-slate-600"}`} /> },
];

export default function OwnerSidebar() {
  return <Sidebar navItems={ownerNavItems} userName="Shalini Verma" userRole="Owner" />;
}

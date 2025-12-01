"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ComponentType, ReactNode, useEffect, useMemo, useState } from "react";
import { clearAuthSession, getAuthSession } from "@/lib/utils/storage";

export type NavItem = {
  label: string;
  href?: string;
  icon?: ComponentType<{ active: boolean }> | ReactNode;
  children?: Array<{ label: string; href: string }>;
};

type SidebarProps = {
  navItems?: NavItem[];
  userName?: string;
  userRole?: string;
  userInitials?: string;
};

const defaultNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: DashboardIcon },
  {
    label: "Dealers",
    href: "/dashboard/admin/dealers",
    icon: DealerIcon,
    children: [
      { label: "Create Dealer", href: "/dashboard/admin/dealers" },
      { label: "Dealer List", href: "/dashboard/admin/dealers/list" },
    ],
  },
  {
    label: "RM/Associate",
    href: "/dashboard/admin/rm-management",
    icon: ConsolidationIcon,
    children: [
      { label: "Create RM/Associate", href: "/dashboard/admin/rm-management" },
      { label: "RM/Associate List", href: "/dashboard/admin/rm-management/list" },
      { label: "Dealer List", href: "/dashboard/admin/dealers/list" },
      { label: "Business Entry", href: "/dashboard/admin/rm-management/business" },
      { label: "Broker Registry", href: "/dashboard/admin/rm-management/brokers" },
      { label: "Bank Names", href: "/dashboard/admin/rm-management/banks" },
    ],
  },
];

export default function Sidebar({ navItems = defaultNavItems, userName = "Jayesh Pandey", userRole = "Admin", userInitials }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [currentUserName, setCurrentUserName] = useState(userName);
  const [currentUserRole, setCurrentUserRole] = useState(userRole);

  const initials = useMemo(() => {
    if (userInitials?.trim()) return userInitials.trim().slice(0, 3).toUpperCase();
    return currentUserName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 3);
  }, [userInitials, currentUserName]);

  useEffect(() => {
    const session = getAuthSession();
    if (session?.user) {
      const user = session.user as any;
      if (user.name) setCurrentUserName(user.name);
      if (user.role) setCurrentUserRole(user.role.charAt(0).toUpperCase() + user.role.slice(1));
    }
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/");
  };

  const handleGroupToggle = (label: string, nextState: boolean) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setOpenGroups((prev) => ({ ...prev, [label]: true }));
      return;
    }

    setOpenGroups((prev) => ({ ...prev, [label]: !nextState }));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white shadow-lg lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen flex-col border-r border-slate-200 bg-slate-50/80 backdrop-blur-md py-6 text-slate-700 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "flex" : "hidden lg:flex"
        } ${isExpanded ? "w-72 px-5" : "w-[90px] px-3"}`}
      >
      <div className="flex h-full flex-col gap-6 overflow-y-auto scrollbar-hide">
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? "flex-row justify-between px-1" : "flex-col justify-center gap-4"}`}>
          <Link href="/" className="transition-transform hover:scale-105">
            <Image src="/brand/coverscrafter-logo.png" alt="CoversCrafter" width={isExpanded ? 56 : 48} height={isExpanded ? 56 : 48} />
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex h-11 w-11 items-center justify-center self-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-600 hover:ring-blue-200 ${!isExpanded ? "mt-2" : ""}`}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <SidebarCollapseIcon /> : <MenuIcon />}
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const parentActive = item.href ? pathname === item.href : false;
            const childActive = item.children?.some((child) => pathname === child.href) ?? false;
            const isActive = parentActive || childActive;
            const isOpen = hasChildren
              ? isExpanded
                ? openGroups[item.label] ?? childActive
                : false
              : false;

            if (!hasChildren) {
              return (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  className={`group relative flex items-center rounded-2xl transition-all duration-300 hover:scale-105 hover:z-10 ${
                    isExpanded ? "px-4 py-3.5 gap-3" : "h-14 w-14 justify-center mx-auto gap-0"
                  } ${
                    isActive
                      ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20"
                      : "bg-white/50 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50"
                  }`}
                  aria-label={item.label}
                >
                  <div className="shrink-0">
                    {Icon ? (
                      typeof Icon === 'function' ? (
                        <Icon active={Boolean(isActive)} />
                      ) : (
                        Icon
                      )
                    ) : (
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </span>
                </Link>
              );
            }

            return (
              <div key={item.label} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleGroupToggle(item.label, Boolean(isOpen))}
                  className={`group relative flex items-center rounded-2xl transition-all duration-300 hover:scale-105 hover:z-10 ${
                    isExpanded ? "px-4 py-3.5 gap-3" : "h-14 w-14 justify-center mx-auto gap-0"
                  } ${
                    isActive
                      ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20"
                      : "bg-white/50 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50"
                  }`}
                  aria-label={item.label}
                >
                  <div className="shrink-0">
                    {Icon ? (
                      typeof Icon === 'function' ? (
                        <Icon active={Boolean(isActive)} />
                      ) : (
                        Icon
                      )
                    ) : (
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      isExpanded ? "flex flex-1 items-center justify-between w-auto opacity-100" : "w-0 opacity-0"
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <ChevronDownIcon open={Boolean(isOpen)} />
                  </div>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className={`overflow-hidden flex flex-col gap-2 ${isExpanded ? "pl-4" : ""}`}>
                    {item.children?.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition ${
                            childActive
                              ? "bg-slate-300 text-slate-900 shadow-inner font-semibold"
                              : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-800"
                          }`}
                          style={childActive ? {
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)'
                          } : {}}
                        >
                          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                            {child.label}
                          </span>
                          {childActive && isExpanded && <span className="text-xs font-bold uppercase tracking-wide text-slate-700">●</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto flex flex-col gap-3 border-t border-slate-200 pt-6 transition-all duration-300 ${isExpanded ? "px-2 items-start" : "items-center"}`}>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "h-4 opacity-100" : "h-0 opacity-0"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active User</p>
        </div>
        
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? "flex-row gap-3" : "flex-col gap-0"}`}>
           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-800 text-sm font-bold text-white shadow-md ring-2 ring-white">
             {initials || "--"}
           </div>
           <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
               <span className="truncate text-sm font-bold text-slate-700">{currentUserName}</span>
               <span className="truncate text-xs font-medium text-slate-500">{currentUserRole}</span>
           </div>
        </div>

        <button
          onClick={handleLogout}
          className={`group relative flex items-center rounded-2xl transition-all duration-300 hover:scale-105 hover:z-10 ${
            isExpanded ? "px-4 py-3.5 gap-3 w-full" : "h-14 w-14 justify-center mx-auto gap-0"
          } bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-md hover:shadow-rose-200/50`}
          aria-label="Logout"
        >
          <div className="shrink-0">
            <LogoutIcon />
          </div>
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <span className="text-sm font-semibold">Logout</span>
          </span>
        </button>
      </div>
    </aside>
    </>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 4H10V11H5V4ZM14 4H19V8H14V4ZM14 12H19V20H14V12ZM5 15H10V20H5V15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.8}
      />
    </svg>
  );
}

export function DealerIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21M4 7H20M4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V9C22 8.46957 21.7893 7.96086 21.4142 7.58579C21.0391 7.21071 20.5304 7 20 7H4C3.46957 7 2.96086 7.21071 2.58579 7.58579C2.21071 7.96086 2 8.46957 2 9V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.8}
      />
    </svg>
  );
}

export function ConsolidationIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9C3 7.89543 3.89543 7 5 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.85}
      />
      <path
        d="M9 12H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.7}
      />
      <path
        d="M9 16H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.7}
      />
      <path
        d="M9 3H15C16.1046 3 17 3.89543 17 5V7H7V5C7 3.89543 7.89543 3 9 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.85}
      />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarCollapseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 3V21" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17L21 12L16 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

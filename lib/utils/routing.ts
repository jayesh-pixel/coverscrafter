const ROLE_ROUTE_MAP: Record<string, string> = {
  admin: "/dashboard/admin",
  superadmin: "/dashboard/admin",
  executive: "/dashboard/executive",
  owner: "/dashboard/owner",
  rm: "/dashboard/rm",
  "relationship-manager": "/dashboard/rm",
  associate: "/dashboard/associate",
  pos: "/dashboard/associate",
};

export function resolveDashboardRoute(role?: string) {
  if (!role) {
    return "/dashboard/admin";
  }

  const normalizedRole = role.trim().toLowerCase();
  return ROLE_ROUTE_MAP[normalizedRole] ?? "/dashboard/admin";
}

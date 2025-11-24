"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthSession } from "@/lib/utils/storage";
import { resolveDashboardRoute } from "@/lib/utils/routing";

// Map dashboard paths to allowed roles
const PATH_ROLE_MAP: Record<string, string[]> = {
  "/dashboard/rm-management": ["rmadmin"],
  "/dashboard/admin": ["admin", "superadmin"],
  "/dashboard/rm": ["rm", "relationship-manager"],
  "/dashboard/associate": ["associate", "pos"],
  "/dashboard/executive": ["executive"],
  "/dashboard/owner": ["owner"],
};

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const session = getAuthSession();
      
      // 1. Check if user is logged in
      if (!session?.token || !session?.user) {
        router.replace("/");
        return;
      }

      const userRole = (session.user as any).role?.toLowerCase();
      
      // 2. Check if the current path requires specific roles
      // We sort keys by length descending to match the most specific path first
      const protectedPath = Object.keys(PATH_ROLE_MAP)
        .sort((a, b) => b.length - a.length)
        .find(path => pathname.startsWith(path));

      if (protectedPath) {
        const allowedRoles = PATH_ROLE_MAP[protectedPath];
        
        // Special case: rmadmin should only access /dashboard/admin/rm-management and its children?
        // Or is rmadmin allowed in the whole admin dashboard?
        // Based on routing.ts, rmadmin goes to /dashboard/admin/rm-management.
        // If rmadmin tries to go to /dashboard/admin (root), they might be allowed or not.
        // For now, we allow them in /dashboard/admin tree as per the map.
        
        if (!allowedRoles.includes(userRole)) {
          // User is not allowed in this section
          console.warn(`Access denied: User role '${userRole}' is not allowed in '${protectedPath}'`);
          
          // Redirect to their assigned dashboard
          const correctRoute = resolveDashboardRoute(userRole);
          router.replace(correctRoute);
          return;
        }
      }

      // 3. Authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

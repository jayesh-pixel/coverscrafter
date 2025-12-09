"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RmManagementPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/rm-management/business-overview");
  }, [router]);

  return null;
}

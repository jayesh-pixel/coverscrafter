"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssociateOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/associate/business-overview");
  }, [router]);

  return null;
}

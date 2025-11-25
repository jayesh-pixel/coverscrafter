"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RMOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/rm/business");
  }, [router]);

  return null;
}

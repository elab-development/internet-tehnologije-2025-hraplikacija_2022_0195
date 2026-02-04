import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";

export default async function HrLayout({ children }: { children: ReactNode }) {
  try {
    await requireHrAdmin();
  } catch (e) {
    redirect("/forbidden");
  }

  return <>{children}</>;
}

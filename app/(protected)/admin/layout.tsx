"use client";
 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
 
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const data = await res.json();
      const ulogaId = data?.korisnik?.ulogaId;
 
      if (ulogaId !== 1) {
        router.replace("/forbidden");
      }
    })();
  }, [router]);
 
  return <>{children}</>;
}
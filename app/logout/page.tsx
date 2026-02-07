"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      await logout();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace("/login");
    })();
  }, [logout, router]);

  return <div className="min-h-screen flex items-center justify-center">Odjavljujem se...</div>;
}

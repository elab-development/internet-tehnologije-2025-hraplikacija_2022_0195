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
      router.replace("/login");
    })();
  }, [logout, router]);

  return <div>Odjavljujem se...</div>;
}

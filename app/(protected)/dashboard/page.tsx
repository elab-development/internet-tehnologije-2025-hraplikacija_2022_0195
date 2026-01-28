"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";




export default function DashboardPage() {
  const { korisnik, loading } = useAuth();


  

  if(loading) return <div>Ucitavanje...</div>

  return <div>
    Zdravo, {korisnik?.email}
        </div>;
}

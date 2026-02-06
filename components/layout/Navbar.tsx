"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { korisnik, logout } = useAuth();

  const isHr = korisnik?.ulogaId === 2;

  return (
    <div className="w-full border-b border-zinc-700 bg-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex gap-3">
          <Link href="/zaposleni">
            <Button>Moj profil</Button>
          </Link>

          {isHr && (
            <Link href="/hr">
              <Button>HR</Button>
            </Link>
          )}
        </div>

        <Button onClick={logout} className="bg-gray-600">
          Logout
        </Button>
      </div>
    </div>
  );
}

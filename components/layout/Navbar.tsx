"use client";
 
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
 
export default function Navbar() {
  const router = useRouter();
  const { korisnik, logout } = useAuth();
 
  const isHr = korisnik?.ulogaId === 2;
  const isAdmin = korisnik?.ulogaId === 1;
 
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };
 
  return (
    <div className="w-full border-b border-zinc-700 bg-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          {!isAdmin && (
            <>
              <Link href="/zaposleni">
                <Button>Moj profil</Button>
              </Link>
 
              {isHr && (
                <Link href="/hr">
                  <Button>HR</Button>
                </Link>
              )}
            </>
          )}
        </div>
        <Button className="bg-gray-600" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

type Weather = {
  city: string;
  tempC: number | null;
  description: string | null;
  icon: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const { korisnik, logout } = useAuth();

  const isHr = korisnik?.ulogaId === 2;
  const isAdmin = korisnik?.ulogaId === 1;

  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/weather", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Weather;
        if (!cancelled) setWeather(data);
      } catch {

      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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


        <div className="flex items-center gap-3">
          {weather?.tempC != null && (
            <div className="flex items-center gap-3 border-r border-zinc-700 pr-4 mr-2">
              {weather?.tempC != null && (
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="font-medium">
                    {weather.city}: {weather.tempC}°C
                  </span>
                </div>
              )}
            </div>
          )}

          <Button className="bg-gray-600" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

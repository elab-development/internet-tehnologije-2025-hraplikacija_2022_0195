"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Korisnik = {
  id: number;
  email: string;
  ulogaId: number;
  statusNaloga?: boolean;
};

type AuthContextValue = {
  korisnik: Korisnik | null;
  loading: boolean;
  error: string | null;

  refreshMe: () => Promise<void>;
  login: (email: string, lozinka: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMe = async () => {
    setError(null);
    try {
      const res = await fetch("/api/me", { method: "GET" });
      if (!res.ok) {
        setKorisnik(null);
        return;
      }
      const data = (await res.json()) as { korisnik: Korisnik };
      setKorisnik(data.korisnik);
    } catch {
      setKorisnik(null);
    }
  };

  const login = async (email: string, lozinka: string) => {
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lozinka }),
    });

    const data = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      const msg = (data as any)?.error ?? "Greska pri loginu";
      setKorisnik(null);
      setError(msg);
      throw new Error(msg);
    }

    setKorisnik((data as any).korisnik ?? null);
  };

  const logout = async () => {
    setError(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setKorisnik(null);
    }
  };

  useEffect(() => {
    (async () => {
      await refreshMe();
      setLoading(false);
    })();
  }, []);

  const value = useMemo(
    () => ({ korisnik, loading, error, refreshMe, login, logout }),
    [korisnik, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth mora biti koriscen unutar <AuthProvider>");
  return ctx;
}

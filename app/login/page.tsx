"use client";

import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login, error, korisnik, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
  if (!loading && korisnik) {
    const uloga = korisnik.ulogaId;
    if (uloga === 1) router.replace("/dashboard");
    else if (uloga === 2) router.replace("/hr");
    else router.replace("/dashboard");
  }
}, [loading, korisnik, router]);


    const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    await login(email.trim(), lozinka);
  } catch (e) {
    console.error(e);
  } finally {
    setSubmitting(false);
  }
};

    
    if (loading) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur"
            >
                <h1 className="text-center text-2xl font-semibold text-white">
                    Prijava
                </h1>

                <InputField
                    label="Email"
                    value={email}
                    placeholder="email@example.com"
                    onChange={setEmail}
                />

                <InputField
                    label="Lozinka"
                    type="password"
                    value={lozinka}
                    onChange={setLozinka}
                />

                {error ? (
                    <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
                        {error}
                    </div>
                ) : null}

                <Button type="submit" disabled={submitting}>
                    {submitting ? "Učitavanje..." : "Uloguj se"}
                </Button>
            </form>
        </div>
    );

}

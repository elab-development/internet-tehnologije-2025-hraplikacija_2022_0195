"use client";
 
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ModalCreateHrAdmin, { CreateHrAdminData } from "@/components/ui/ModalCreateHrAdmin";
 
type HrAdmin = {
  id: number;
  ime: string;
  prezime: string;
  pozicija: string;
  plata: string | number;
  datumRodjenja: string;
  datumZaposlenja: string;
  statusZaposlenja: boolean;
  korisnik: {
    id: number;
    email: string;
    statusNaloga: boolean;
    ulogaId: number;
  };
};
 
export default function AdminHrAdminiPage() {
  const [hrAdmini, setHrAdmini] = useState<HrAdmin[]>([]);
  const [loading, setLoading] = useState(true);
 
  const [showCreate, setShowCreate] = useState(false);
  const [myUserId, setMyUserId] = useState<number | null>(null);
 
  async function loadHrAdmini() {
    setLoading(true);
    const res = await fetch("/api/admin/hr-admini", { cache: "no-store" });
    if (res.ok) setHrAdmini(await res.json());
    setLoading(false);
  }
 
  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/me", { cache: "no-store" });
      if (meRes.ok) {
        const meData = await meRes.json();
        setMyUserId(meData.korisnik?.id ?? null);
      }
      loadHrAdmini();
    })();
  }, []);
 
  const createHrAdmin = async (data: CreateHrAdminData) => {
    const res = await fetch("/api/admin/hr-admini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
 
    if (!res.ok) {
      const txt = await res.text();
      alert(txt || "Greška pri kreiranju");
      return;
    }
 
    setShowCreate(false);
    loadHrAdmini();
  };
 
  if (loading) return <p className="text-center mt-10 text-gray-400">Učitavanje...</p>;
 
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">HR administratori</h1>
 
      <div className="flex justify-center mb-6 gap-4">
        <Button onClick={() => setShowCreate(true)} className="w-48">
          Dodaj HR admina
        </Button>
      </div>
 
      <div className="overflow-x-auto rounded-lg border border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Ime</th>
              <th className="px-4 py-3">Prezime</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status naloga</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
 
          <tbody className="bg-zinc-900 divide-y divide-zinc-700">
            {hrAdmini
              // ako želiš, sakrij sebe (kao u HR panelu)
              .filter((a) => myUserId == null || a.korisnik.id !== myUserId)
              .map((a) => (
                <tr key={a.id} className="hover:bg-zinc-800 transition">
                  <td className="px-4 py-3">{a.id}</td>
                  <td className="px-4 py-3">{a.ime}</td>
                  <td className="px-4 py-3">{a.prezime}</td>
                  <td className="px-4 py-3">{a.korisnik.email}</td>
 
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        a.korisnik.statusNaloga ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {a.korisnik.statusNaloga ? "Aktivan" : "Neaktivan"}
                    </span>
                  </td>
 
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      onClick={async () => {
                        await fetch(`/api/admin/hr-admini/${a.id}/toggle`, { method: "PATCH" });
                        loadHrAdmini();
                      }}
                    >
                      {a.korisnik.statusNaloga ? "Deaktiviraj" : "Reaktiviraj"}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
 
      <ModalCreateHrAdmin
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={createHrAdmin}
      />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ModalUser, { UserEmployeeData } from "@/components/ui/ModalUser";

type Zaposleni = {
  id: number;
  ime: string;
  prezime: string;
  pozicija: string;
  plata: number;
  datumRodjenja: string;
  datumZaposlenja: string;
  korisnik: {
    id: number;
    email: string;
    statusNaloga: boolean;
  };
};

export default function HrPage() {
  const [zaposleni, setZaposleni] = useState<Zaposleni[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Zaposleni | null>(null);

  async function loadZaposleni() {
    setLoading(true);
    const res = await fetch("/api/hr/zaposleni", { cache: "no-store" });
    if (res.ok) setZaposleni(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadZaposleni();
  }, []);

  const openAddModal = () => {
    setEditEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (employee: Zaposleni) => {
    setEditEmployee(employee);
    setShowModal(true);
  };
  // Funkcija za formatiranje datuma za input polja
  const formatDateForInput = (date: string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const saveEmployee = async (data: UserEmployeeData) => {
    console.log("editEmployee:", editEmployee);  // ceo objekat zaposlenog
    console.log("editEmployee.id:", editEmployee?.id);  // konkretan ID
    console.log("Payload:", data);  // ceo payload koji šalješ

    if (editEmployee) {
      await fetch(`/api/hr/zaposleni/${editEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/hr/zaposleni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowModal(false);
    setEditEmployee(null);
    loadZaposleni();
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Učitavanje...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Zaposleni</h1>

      <div className="flex justify-center mb-6">
        <Button onClick={openAddModal} className="w-48">
          Dodaj zaposlenog
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Ime</th>
              <th className="px-4 py-3">Prezime</th>
              <th className="px-4 py-3">Pozicija</th>
              <th className="px-4 py-3">Plata</th>
              <th className="px-4 py-3">Status naloga</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-700">
            {zaposleni.map((e) => (
              <tr key={e.id} className="hover:bg-zinc-800 transition">
                <td className="px-4 py-3">{e.id}</td>
                <td className="px-4 py-3">{e.ime}</td>
                <td className="px-4 py-3">{e.prezime}</td>
                <td className="px-4 py-3">{e.pozicija}</td>
                <td className="px-4 py-3">{Number(e.plata).toFixed(2)} €</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${e.korisnik.statusNaloga ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                  >
                    {e.korisnik.statusNaloga ? "Aktivan" : "Neaktivan"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Button onClick={() => openEditModal(e)}>Azuriraj</Button>
                  {/* Drugo dugme ostaje za kasnije */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalUser
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={saveEmployee}
        initialData={editEmployee ? {
          email: editEmployee.korisnik.email,
          ime: editEmployee.ime,
          prezime: editEmployee.prezime,
          datumRodjenja: formatDateForInput(editEmployee.datumRodjenja),
          pozicija: editEmployee.pozicija,
          plata: editEmployee.plata.toString(),
          datumZaposlenja: formatDateForInput(editEmployee.datumZaposlenja),
          ulogaId: 3,
        } : undefined}
        isEdit={!!editEmployee}
      />
    </div>
  );
}

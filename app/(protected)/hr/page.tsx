"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ModalUser, { UserEmployeeData } from "@/components/ui/ModalUser";

type Zahtev = {
  id: number;
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  statusId: number;
};

type Zaposleni = {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: string;
  pozicija: string;
  plata: number;
  datumZaposlenja: string;
  statusZaposlenja: boolean;
  korisnik: {
    id: number;
    email: string;
    statusNaloga: boolean;
    ulogaId: number;
  };
};

export default function HrOdsustvaPage() {
  const [odsustva, setOdsustva] = useState<Zahtev[]>([]);
  const [zaposleni, setZaposleni] = useState<Zaposleni[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Zaposleni | null>(null);

  // --- Load odsustva i zaposlene ---
  async function load() {
    setLoading(true);

    const resOdsustva = await fetch("/api/hr/odsustva");
    if (resOdsustva.ok) setOdsustva(await resOdsustva.json());

    const resZaposleni = await fetch("/api/hr/zaposleni");
    if (resZaposleni.ok) setZaposleni(await resZaposleni.json());

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // --- Odsustva akcije ---
  const approve = async (id: number) => {
    await fetch(`/api/hr/odsustva/${id}/approve`, { method: "PATCH" });
    load();
  };

  const deny = async (id: number) => {
    await fetch(`/api/hr/odsustva/${id}/deny`, { method: "PATCH" });
    load();
  };

  // --- Zaposleni akcije ---
  const openAddModal = () => {
    setEditEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (employee: Zaposleni) => {
    setEditEmployee(employee);
    setShowModal(true);
  };

  const saveEmployee = async (data: UserEmployeeData) => {
    if (editEmployee) {
      // --- Update korisnika ---
      await fetch(`/api/hr/korisnik/${editEmployee.korisnik.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          ulogaId: data.ulogaId,
        }),
      });

      // --- Update zaposlenog ---
      await fetch(`/api/hr/zaposleni/${editEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ime: data.ime,
          prezime: data.prezime,
          datumRodjenja: data.datumRodjenja,
          pozicija: data.pozicija,
          plata: data.plata,
          datumZaposlenja: data.datumZaposlenja,
        }),
      });
    } else {
      // --- Create korisnik ---
      const resUser = await fetch(`/api/hr/korisnik`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          lozinka: data.lozinka, // samo kod kreiranja
          ulogaId: data.ulogaId,
          statusNaloga: true,
        }),
      });

      const newUser = await resUser.json();

      // --- Create zaposlenog ---
      await fetch(`/api/hr/zaposleni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ime: data.ime,
          prezime: data.prezime,
          datumRodjenja: data.datumRodjenja,
          pozicija: data.pozicija,
          plata: data.plata,
          datumZaposlenja: data.datumZaposlenja,
          statusZaposlenja: true,
          korisnikId: newUser.id,
        }),
      });
    }

    setShowModal(false);
    load();
  };

  const deactivateEmployee = async (employee: Zaposleni) => {
    await fetch(`/api/hr/korisnik/${employee.korisnik.id}/deactivate`, { method: "PATCH" });
    load();
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div className="p-6">
      {/* Odsustva tabela */}
      <h1 className="text-xl font-bold mb-4">Zahtevi za odsustvo</h1>
      <table className="w-full border mb-6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Od</th>
            <th>Do</th>
            <th>Razlog</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {odsustva.map((z) => (
            <tr key={z.id} className="border-t">
              <td>{z.id}</td>
              <td>{z.datumOd}</td>
              <td>{z.datumDo}</td>
              <td>{z.razlog}</td>
              <td>
                {z.statusId === 1 && "Na čekanju"}
                {z.statusId === 2 && "Odobren"}
                {z.statusId === 3 && "Odbijen"}
              </td>
              <td className="flex gap-2">
                {z.statusId === 1 && <Button onClick={() => approve(z.id)}>Odobri</Button>}
                {z.statusId === 1 && <Button className="bg-red-500" onClick={() => deny(z.id)}>Odbij</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Zaposleni tabela */}
      <h2 className="text-xl font-bold mb-4">Zaposleni</h2>
      <Button onClick={openAddModal} className="mb-4 w-auto">
        Dodaj zaposlenog
      </Button>

      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Pozicija</th>
            <th>Plata</th>
            <th>Status naloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {zaposleni.map((e) => (
            <tr key={e.id} className="border-t">
              <td>{e.id}</td>
              <td>{e.ime}</td>
              <td>{e.prezime}</td>
              <td>{e.pozicija}</td>
              <td>{e.plata}</td>
              <td>{e.korisnik.statusNaloga ? "Aktivan" : "Neaktivan"}</td>
              <td className="flex gap-2">
                <Button onClick={() => openEditModal(e)}>Azuriraj</Button>
                {e.korisnik.statusNaloga && (
                  <Button className="bg-red-500" onClick={() => deactivateEmployee(e)}>
                    Deaktiviraj
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reusable ModalUser */}
      <ModalUser
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={saveEmployee}
        initialData={editEmployee ? {
          email: editEmployee.korisnik.email,
          ulogaId: editEmployee.korisnik.ulogaId,
          ime: editEmployee.ime,
          prezime: editEmployee.prezime,
          datumRodjenja: editEmployee.datumRodjenja,
          pozicija: editEmployee.pozicija,
          plata: editEmployee.plata.toString(),
          datumZaposlenja: editEmployee.datumZaposlenja,
        } : undefined}
        isEdit={!!editEmployee}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ModalUser, { UserEmployeeData } from "@/components/ui/ModalUser";
import ModalOdsustvo, { ZahtevOdsustvo } from "@/components/ui/ModalOdsustvo";
import ModalOceneRada, { OcenaRadaRow } from "@/components/ui/ModalOceneRada";
import { OcenaRadaPayload } from "@/components/ui/ModalOcenaRada";

type Employee = {
  id: number;
  ime: string;
  prezime: string;
  pozicija: string;
  plata: number;
  datumRodjenja: string;
  datumZaposlenja: string;
  statusZaposlenja: boolean;
  korisnik: {
    id: number;
    email: string;
    statusNaloga: boolean;
  };
};

export default function HrPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalUser, setShowModalUser] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const [showModalOdsustvo, setShowModalOdsustvo] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [podneti, setPodneti] = useState<ZahtevOdsustvo[]>([]);
  const [zavrseni, setZavrseni] = useState<ZahtevOdsustvo[]>([]);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  const [showModalOcene, setShowModalOcene] = useState(false);
  const [selectedEmployeeForOcene, setSelectedEmployeeForOcene] = useState<Employee | null>(null);
  const [ocene, setOcene] = useState<OcenaRadaRow[]>([]);

  async function loadEmployees() {
    setLoading(true);
    const res = await fetch("/api/hr/zaposleni", { cache: "no-store" });
    if (res.ok) setEmployees(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/me", { cache: "no-store" });
      if (meRes.ok) {
        const meData = await meRes.json();
        setMyUserId(meData.korisnik?.id ?? null);
      }
      loadEmployees();
    })();
  }, []);

  const openAddModal = () => {
    setEditEmployee(null);
    setShowModalUser(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditEmployee(employee);
    setShowModalUser(true);
  };

  const openOdsustvoModal = async (employee: Employee) => {
    setSelectedEmployee(employee);
    try {
      const res = await fetch(`/api/hr/odsustva/${employee.id}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        setPodneti([]);
        setZavrseni([]);
        setShowModalOdsustvo(true);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setPodneti(data.filter((z: ZahtevOdsustvo) => z.statusId === 1));
        setZavrseni(data.filter((z: ZahtevOdsustvo) => z.statusId !== 1));
      } else if (data && (data.podneti || data.zavrseni)) {
        setPodneti(data.podneti ?? []);
        setZavrseni(data.zavrseni ?? []);
      } else {
        setPodneti([]);
        setZavrseni([]);
      }
    } catch {
      setPodneti([]);
      setZavrseni([]);
    } finally {
      setShowModalOdsustvo(true);
    }
  };

  const openOceneModal = async (employee: Employee) => {
    setSelectedEmployeeForOcene(employee);
    try {
      const res = await fetch(`/api/hr/ocene-rada/${employee.id}`, { cache: "no-store" });
      if (res.ok) setOcene(await res.json());
      else setOcene([]);
    } catch {
      setOcene([]);
    } finally {
      setShowModalOcene(true);
    }
  };

  const formatDateForInput = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const saveEmployee = async (data: UserEmployeeData) => {
    if (editEmployee) {
      const payload = {
        ime: data.ime,
        prezime: data.prezime,
        email: data.email,
        datumRodjenja: data.datumRodjenja,
        datumZaposlenja: data.datumZaposlenja,
        pozicija: data.pozicija,
        plata: data.plata,
      };
      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );
      await fetch(`/api/hr/zaposleni/${editEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredPayload),
      });
    } else {
      await fetch("/api/hr/zaposleni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowModalUser(false);
    setEditEmployee(null);
    loadEmployees();
  };

  const handleApprove = async (id: number) => {
    await fetch(`/api/hr/odsustva/${id}/approve`, { method: "PATCH" });
    if (selectedEmployee) openOdsustvoModal(selectedEmployee);
  };

  const handleDeny = async (id: number) => {
    await fetch(`/api/hr/odsustva/${id}/deny`, { method: "PATCH" });
    if (selectedEmployee) openOdsustvoModal(selectedEmployee);
  };

  const addOcenaRada = async (payload: OcenaRadaPayload) => {
    if (!selectedEmployeeForOcene) return;

    const res = await fetch(`/api/hr/ocene-rada/${selectedEmployeeForOcene.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = "Greška pri čuvanju.";
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch {}
      throw new Error(msg);
    }

    const listRes = await fetch(`/api/hr/ocene-rada/${selectedEmployeeForOcene.id}`, {
      cache: "no-store",
    });
    if (listRes.ok) setOcene(await listRes.json());
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Učitavanje...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Zaposleni</h1>

      <div className="flex justify-center mb-6 gap-4">
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
            {employees
              .filter((e) => myUserId == null || e.korisnik.id !== myUserId)
              .map((employee) => (
                <tr key={employee.id} className="hover:bg-zinc-800 transition">
                  <td className="px-4 py-3">{employee.id}</td>
                  <td className="px-4 py-3">{employee.ime}</td>
                  <td className="px-4 py-3">{employee.prezime}</td>
                  <td className="px-4 py-3">{employee.pozicija}</td>
                  <td className="px-4 py-3">{Number(employee.plata).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        employee.korisnik.statusNaloga
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {employee.korisnik.statusNaloga ? "Aktivan" : "Neaktivan"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button onClick={() => openEditModal(employee)}>Azuriraj</Button>
                    <Button
                      onClick={async () => {
                        await fetch(`/api/hr/zaposleni/${employee.id}/toggle`, { method: "PATCH" });
                        loadEmployees();
                      }}
                    >
                      {employee.korisnik.statusNaloga ? "Deaktiviraj" : "Reaktiviraj"}
                    </Button>
                    <Button onClick={() => openOdsustvoModal(employee)}>Odsustva</Button>
                    <Button onClick={() => openOceneModal(employee)}>Ocene</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ModalUser
        isOpen={showModalUser}
        onClose={() => setShowModalUser(false)}
        onSave={saveEmployee}
        initialData={
          editEmployee
            ? {
                email: editEmployee.korisnik.email,
                ime: editEmployee.ime,
                prezime: editEmployee.prezime,
                datumRodjenja: formatDateForInput(editEmployee.datumRodjenja),
                pozicija: editEmployee.pozicija,
                plata: editEmployee.plata.toString(),
                datumZaposlenja: formatDateForInput(editEmployee.datumZaposlenja),
                ulogaId: 3,
              }
            : undefined
        }
        isEdit={!!editEmployee}
      />

      {selectedEmployee && (
        <ModalOdsustvo
          isOpen={showModalOdsustvo}
          onClose={() => setShowModalOdsustvo(false)}
          employee={{
            id: selectedEmployee.id,
            ime: selectedEmployee.ime,
            prezime: selectedEmployee.prezime,
            email: selectedEmployee.korisnik.email,
            pozicija: selectedEmployee.pozicija,
          }}
          podneti={podneti}
          zavrseni={zavrseni}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      )}

      {selectedEmployeeForOcene && (
        <ModalOceneRada
          isOpen={showModalOcene}
          onClose={() => setShowModalOcene(false)}
          employee={{
            id: selectedEmployeeForOcene.id,
            ime: selectedEmployeeForOcene.ime,
            prezime: selectedEmployeeForOcene.prezime,
            email: selectedEmployeeForOcene.korisnik.email,
            pozicija: selectedEmployeeForOcene.pozicija,
          }}
          ocene={ocene}
          onAddOcena={addOcenaRada}
        />
      )}
    </div>
  );
}
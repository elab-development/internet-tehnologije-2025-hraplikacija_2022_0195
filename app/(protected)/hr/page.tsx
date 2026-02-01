"use client";

import { useEffect, useState } from "react";

type Zahtev = {
  id: number;
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  statusId: number;
};

export default function HrOdsustvaPage() {
  const [data, setData] = useState<Zahtev[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/hr/odsustva");
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }

  async function approve(id: number) {
    await fetch(`/api/hr/odsustva/${id}/approve`, {
      method: "PATCH",
    });
    load();
  }

  async function deny(id: number) {
    await fetch(`/api/hr/odsustva/${id}/deny`, {
      method: "PATCH",
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Ucitavanje...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Zahtevi za odsustvo</h1>

      <table className="w-full border">
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
          {data.map((z) => (
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
              <td>
                {z.statusId === 1 && (
                  <>
                    <button
                      onClick={() => approve(z.id)}
                      className="mr-2 px-2 py-1 bg-green-500 text-white"
                    >
                      Odobri
                    </button>
                    <button
                      onClick={() => deny(z.id)}
                      className="px-2 py-1 bg-red-500 text-white"
                    >
                      Odbij
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

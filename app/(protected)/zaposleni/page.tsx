"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type MeEmployee = {
  zaposleniId: number;
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  plata: string;
  datumRodjenja: string;
  datumZaposlenja: string;
  statusZaposlenja: boolean;
  ulogaId: number;
};

type ZahtevOdsustvo = {
  id: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  datumKreiranja: string;
  datumAzuriranja?: string;
  statusId: number;
};

type OcenaRada = {
  id: number;
  autorId: number;
  ocenjeniId: number;
  datumOd: string;
  datumDo: string;
  ocena: number;
  komentar?: string | null;
  datumKreiranja: string;
  autorIme: string;
  autorPrezime: string;
  autorEmail: string;
};

export default function ZaposleniPage() {
  const [me, setMe] = useState<MeEmployee | null>(null);
  const [zahtevi, setZahtevi] = useState<ZahtevOdsustvo[]>([]);
  const [loading, setLoading] = useState(true);
  const [ocene, setOcene] = useState<OcenaRada[]>([]);
  const [open, setOpen] = useState(false);
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [razlog, setRazlog] = useState("");

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  const renderStatus = (statusId: number) => {
    if (statusId === 1) return <span className="px-2 py-1 text-xs rounded-full bg-yellow-400 text-black">Podnet</span>;
    if (statusId === 2) return <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">Odobren</span>;
    if (statusId === 3) return <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white">Odbijen</span>;
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-white">Nepoznato</span>;
  };

  async function loadAll() {
    setLoading(true);

    const meRes = await fetch("/api/zaposleni/me", { cache: "no-store" });
    if (!meRes.ok) {
      setLoading(false);
      return;
    }
    const meData = await meRes.json();
    setMe({
      zaposleniId: meData.me.zaposleniId,
      ime: meData.me.ime,
      prezime: meData.me.prezime,
      email: meData.me.email,
      pozicija: meData.me.pozicija,
      plata: meData.me.plata,
      datumRodjenja: meData.me.datumRodjenja,
      datumZaposlenja: meData.me.datumZaposlenja,
      statusZaposlenja: meData.me.statusZaposlenja,
      ulogaId: meData.me.ulogaId,
    });

    const zRes = await fetch("/api/zaposleni/odsustva", { cache: "no-store" });
    if (zRes.ok) setZahtevi(await zRes.json());

    const oRes = await fetch("/api/zaposleni/ocene-rada", { cache: "no-store" });
    if (oRes.ok) setOcene(await oRes.json());

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const openModal = () => {
    setDatumOd("");
    setDatumDo("");
    setRazlog("");
    setOpen(true);
  };

  const saveZahtev = async () => {
    const res = await fetch("/api/zaposleni/odsustva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datumOd, datumDo, razlog }),
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    setOpen(false);
    loadAll();
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Učitavanje...</p>;
  if (!me) return <p className="text-center mt-10 text-red-400">Nema podataka o zaposlenom.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{me.ime} {me.prezime}</h1>
        <div className="text-sm text-zinc-300 space-y-1">
          <p>Email: {me.email}</p>
          <p>Pozicija: {me.pozicija}</p>
          <p>Plata: {Number(me.plata).toFixed(2)} €</p>
          <p>Datum zaposlenja: {formatDate(me.datumZaposlenja)}</p>
          <p>Status zaposlenja: {me.statusZaposlenja ? "Aktivan" : "Neaktivan"}</p>
        </div>

        <div className="mt-4 flex gap-3">
          <Button onClick={openModal}>Napravi zahtev za odsustvo</Button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Moji zahtevi</h2>

        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-3 py-2">Datum od</th>
                <th className="px-3 py-2">Datum do</th>
                <th className="px-3 py-2">Razlog</th>
                <th className="px-3 py-2">Kreiran</th>
                <th className="px-3 py-2">Ažuriran</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900 divide-y divide-zinc-700">
              {zahtevi.map((z) => (
                <tr key={z.id} className="hover:bg-zinc-800 transition">
                  <td className="px-3 py-2">{formatDate(z.datumOd)}</td>
                  <td className="px-3 py-2">{formatDate(z.datumDo)}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={z.razlog}>{z.razlog}</td>
                  <td className="px-3 py-2">{formatDate(z.datumKreiranja)}</td>
                  <td className="px-3 py-2">{z.datumAzuriranja ? formatDate(z.datumAzuriranja) : "-"}</td>
                  <td className="px-3 py-2">{renderStatus(z.statusId)}</td>
                </tr>
              ))}
              {zahtevi.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-zinc-400" colSpan={6}>Nema zahteva.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Moje ocene rada</h2>

        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-3 py-2">Datum od</th>
                <th className="px-3 py-2">Datum do</th>
                <th className="px-3 py-2">Ocena</th>
                <th className="px-3 py-2">Komentar</th>
                <th className="px-3 py-2">Autor</th>
                <th className="px-3 py-2">Kreirano</th>
              </tr>
            </thead>

            <tbody className="bg-zinc-900 divide-y divide-zinc-700">
              {ocene.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800 transition">
                  <td className="px-3 py-2">{formatDate(o.datumOd)}</td>
                  <td className="px-3 py-2">{formatDate(o.datumDo)}</td>
                  <td className="px-3 py-2 font-semibold">{o.ocena}</td>

                  <td className="px-3 py-2 max-w-xs truncate" title={o.komentar ?? ""}>
                    {o.komentar ? o.komentar : "-"}
                  </td>

                  <td className="px-3 py-2">
                    <div className="leading-tight">
                      <div className="text-white">{o.autorIme} {o.autorPrezime}</div>
                      <div className="text-xs text-zinc-400">{o.autorEmail}</div>
                    </div>
                  </td>

                  <td className="px-3 py-2">{formatDate(o.datumKreiranja)}</td>
                </tr>
              ))}

              {ocene.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-zinc-400" colSpan={6}>
                    Nema ocena.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Novi zahtev za odsustvo"
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={saveZahtev}
        saveLabel="Pošalji zahtev"
      >
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Datum od</label>
          <input
            type="date"
            value={datumOd}
            onChange={(e) => setDatumOd(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Datum do</label>
          <input
            type="date"
            value={datumDo}
            onChange={(e) => setDatumDo(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Razlog</label>
          <textarea
            value={razlog}
            onChange={(e) => setRazlog(e.target.value)}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            maxLength={500}
          />
          <p className="text-xs text-zinc-400">{razlog.length}/500</p>
        </div>
      </Modal>
    </div>
  );
}

// components/ui/ModalOcenaRada.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button";

export type OcenaRadaPayload = {
  datumOd: string; // YYYY-MM-DD
  datumDo: string; // YYYY-MM-DD
  ocena: number;
  komentar?: string;
};

type ModalOcenaRadaProps = {
  isOpen: boolean;
  onClose: () => void;

  employee: {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    pozicija: string;
  };

  onSave: (payload: OcenaRadaPayload) => Promise<void> | void;
};

const toInputDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function ModalOcenaRada({
  isOpen,
  onClose,
  employee,
  onSave,
}: ModalOcenaRadaProps) {
  const today = useMemo(() => toInputDate(new Date()), []);
  const [datumOd, setDatumOd] = useState<string>(today);
  const [datumDo, setDatumDo] = useState<string>(today);
  const [ocena, setOcena] = useState<number>(5);
  const [komentar, setKomentar] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDatumOd(today);
    setDatumDo(today);
    setOcena(5);
    setKomentar("");
    setError(null);
    setSaving(false);
  }, [isOpen, today]);

  if (!isOpen) return null;

  const validate = () => {
    if (!datumOd || !datumDo) return "Datumi su obavezni.";

    const dOd = new Date(datumOd);
    const dDo = new Date(datumDo);

    if (Number.isNaN(dOd.getTime()) || Number.isNaN(dDo.getTime())) {
      return "Neispravan format datuma.";
    }
    if (dDo < dOd) return "Datum do ne može biti pre datuma od.";

    if (!Number.isInteger(ocena) || ocena < 1 || ocena > 5) {
      return "Ocena mora biti ceo broj od 1 do 5.";
    }

    const k = komentar.trim();
    if (k.length > 1000) return "Komentar je predugačak (max 1000 karaktera).";

    return null;
  };

  const handleSave = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSaving(true);
    setError(null);

    const payload: OcenaRadaPayload = {
      datumOd,
      datumDo,
      ocena,
      komentar: komentar.trim() ? komentar.trim() : undefined,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Greška pri čuvanju.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-lg font-bold"
          aria-label="Zatvori"
        >
          &times;
        </button>

        <div className="mb-6 text-white">
          <h2 className="text-xl font-bold mb-1">Dodaj ocenu rada</h2>
          <p className="text-sm">
            Ocenjeni: <span className="font-semibold">{employee.ime} {employee.prezime}</span>
          </p>
          <p className="text-sm">Email: {employee.email}</p>
          <p className="text-sm">Pozicija: {employee.pozicija}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Datum od</label>
            <input
              type="date"
              value={datumOd}
              onChange={(e) => setDatumOd(e.target.value)}
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Datum do</label>
            <input
              type="date"
              value={datumDo}
              onChange={(e) => setDatumDo(e.target.value)}
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Ocena (1–5)</label>
            <select
              value={ocena}
              onChange={(e) => setOcena(Number(e.target.value))}
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-zinc-500"
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-zinc-200">Komentar (opciono)</label>
            <textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="Unesi komentar (max 1000)..."
              className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-zinc-500 resize-none"
            />
            <div className="text-right text-xs text-zinc-400">
              {komentar.length}/1000
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-600">
            Otkaži
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Čuvam..." : "Sačuvaj"}
          </Button>
        </div>
      </div>
    </div>
  );
}
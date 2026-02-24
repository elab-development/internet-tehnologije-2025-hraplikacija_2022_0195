"use client";

import React, { useEffect, useState } from "react";
import Button from "./Button";
import ModalOcenaRada, { OcenaRadaPayload } from "./ModalOcenaRada";

export type OcenaRadaRow = {
  id: number;
  autorId: number;
  ocenjeniId: number;
  datumOd: string;
  datumDo: string;
  ocena: number;
  komentar?: string | null;
  datumKreiranja: string;

  autorIme?: string;
  autorPrezime?: string;
  autorEmail?: string;
};

export type ModalOceneRadaProps = {
  isOpen: boolean;
  onClose: () => void;

  employee: {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    pozicija: string;
  };

  ocene: OcenaRadaRow[];

  onAddOcena: (payload: OcenaRadaPayload) => Promise<void> | void;
};

export default function ModalOceneRada({
  isOpen,
  onClose,
  employee,
  ocene,
  onAddOcena,
}: ModalOceneRadaProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowAddModal(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 rounded-2xl max-w-5xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-lg font-bold">
          &times;
        </button>

        <div className="mb-6 text-white flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {employee.ime} {employee.prezime}
            </h2>
            <p className="text-sm">Email: {employee.email}</p>
            <p className="text-sm">Pozicija: {employee.pozicija}</p>
          </div>

          <div className="shrink-0">
            <Button onClick={() => setShowAddModal(true)}>Dodaj ocenu rada</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Ocene rada</h3>

          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-3 py-2">Period</th>
                  <th className="px-3 py-2">Ocena</th>
                  <th className="px-3 py-2">Autor</th>
                  <th className="px-3 py-2">Komentar</th>
                  <th className="px-3 py-2">Datum kreiranja</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                {ocene.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4 text-zinc-400" colSpan={5}>
                      Nema ocena rada.
                    </td>
                  </tr>
                ) : (
                  ocene.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-800 transition">
                      <td className="px-3 py-2">
                        {formatDate(o.datumOd)} – {formatDate(o.datumDo)}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-600 text-white font-semibold">
                          {o.ocena}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {o.autorIme || o.autorPrezime || o.autorEmail ? (
                          <div className="leading-tight">
                            <div className="text-white">
                              {[o.autorIme, o.autorPrezime].filter(Boolean).join(" ")}
                            </div>
                            <div className="text-xs text-zinc-400">{o.autorEmail}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-400">Autor #{o.autorId}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 max-w-sm truncate" title={o.komentar ?? ""}>
                        {o.komentar ? o.komentar : <span className="text-zinc-400">-</span>}
                      </td>
                      <td className="px-3 py-2">{formatDate(o.datumKreiranja)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ModalOcenaRada
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          employee={employee}
          onSave={onAddOcena}
        />
      </div>
    </div>
  );
}
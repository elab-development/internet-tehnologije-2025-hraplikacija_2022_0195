"use client";

import React from "react";

export type ZahtevOdsustvo = {
  id: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  datumKreiranja: string;
  datumAzuriranja?: string;
  statusId: number; // 1 = podnet, 2 = odbijen, 3 = odobren
};

export type ModalOdsustvoProps = {
  isOpen: boolean;
  onClose: () => void;
  zaposleni: {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    pozicija: string;
  };
  podneti: ZahtevOdsustvo[];
  zavrseni: ZahtevOdsustvo[];
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
};

export default function ModalOdsustvo({
  isOpen,
  onClose,
  zaposleni,
  podneti,
  zavrseni,
  onApprove,
  onDeny,
}: ModalOdsustvoProps) {
  if (!isOpen) return null;

  const renderStatus = (statusId: number) => {
    if (statusId === 1) return <span className="px-2 py-1 text-xs rounded-full bg-yellow-400 text-black">Podnet</span>;
    if (statusId === 2) return <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">Odobren</span>;
    if (statusId === 3) return <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white">Odbijen</span>;
    return null;
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 rounded-2xl max-w-5xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-lg font-bold"
        >
          &times;
        </button>

        <div className="mb-6 text-white">
          <h2 className="text-xl font-bold mb-1">{zaposleni.ime} {zaposleni.prezime}</h2>
          <p className="text-sm">Email: {zaposleni.email}</p>
          <p className="text-sm">Pozicija: {zaposleni.pozicija}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Podneti zahtevi</h3>
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-3 py-2">Datum od</th>
                  <th className="px-3 py-2">Datum do</th>
                  <th className="px-3 py-2">Razlog</th>
                  <th className="px-3 py-2">Datum kreiranja</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Akcije</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                {podneti.map((z) => (
                  <tr key={z.id} className="hover:bg-zinc-800 transition">
                    <td className="px-3 py-2">{formatDate(z.datumOd)}</td>
                    <td className="px-3 py-2">{formatDate(z.datumDo)}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={z.razlog}>{z.razlog}</td>
                    <td className="px-3 py-2">{formatDate(z.datumKreiranja)}</td>
                    <td className="px-3 py-2">{renderStatus(z.statusId)}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        onClick={() => onApprove(z.id)}
                        className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Odobri
                      </button>
                      <button
                        onClick={() => onDeny(z.id)}
                        className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Odbij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Završeni zahtevi</h3>
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-700 text-sm text-left">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-3 py-2">Datum od</th>
                  <th className="px-3 py-2">Datum do</th>
                  <th className="px-3 py-2">Razlog</th>
                  <th className="px-3 py-2">Datum kreiranja</th>
                  <th className="px-3 py-2">Datum ažuriranja</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                {zavrseni.map((z) => (
                  <tr key={z.id} className="hover:bg-zinc-800 transition">
                    <td className="px-3 py-2">{formatDate(z.datumOd)}</td>
                    <td className="px-3 py-2">{formatDate(z.datumDo)}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={z.razlog}>{z.razlog}</td>
                    <td className="px-3 py-2">{formatDate(z.datumKreiranja)}</td>
                    <td className="px-3 py-2">{z.datumAzuriranja ? formatDate(z.datumAzuriranja) : "-"}</td>
                    <td className="px-3 py-2">{renderStatus(z.statusId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

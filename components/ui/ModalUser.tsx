"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import InputField from "./InputField";
import Button from "./Button";

export type UserEmployeeData = {
  email: string;
  lozinka?: string;
  ulogaId: number;
  ime: string;
  prezime: string;
  datumRodjenja: string;
  pozicija: string;
  plata: string;
  datumZaposlenja: string;
};

type ModalUserProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserEmployeeData) => void;
  initialData?: UserEmployeeData;
  isEdit?: boolean;
};

export default function ModalUser({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit = false,
}: ModalUserProps) {
  const [email, setEmail] = useState(initialData?.email || "");
  const [lozinka, setLozinka] = useState(""); // lozinka se unosi samo za novi korisnik
  const [ulogaId, setUlogaId] = useState(initialData?.ulogaId || 2);

  const [ime, setIme] = useState(initialData?.ime || "");
  const [prezime, setPrezime] = useState(initialData?.prezime || "");
  const [datumRodjenja, setDatumRodjenja] = useState(initialData?.datumRodjenja || "");
  const [pozicija, setPozicija] = useState(initialData?.pozicija || "");
  const [plata, setPlata] = useState(initialData?.plata || "");
  const [datumZaposlenja, setDatumZaposlenja] = useState(initialData?.datumZaposlenja || "");

  const handleSave = () => {
    onSave({
      email,
      lozinka,
      ulogaId,
      ime,
      prezime,
      datumRodjenja,
      pozicija,
      plata,
      datumZaposlenja,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={isEdit ? "Azuriraj zaposlenog" : "Dodaj zaposlenog"}
      saveLabel={isEdit ? "Sačuvaj" : "Dodaj"}
    >
      {/* Korisnik polja */}
      <InputField label="Email" value={email} onChange={setEmail} />
      {!isEdit && <InputField label="Lozinka" type="password" value={lozinka} onChange={setLozinka} />}
      <InputField label="Uloga ID" type="number" value={ulogaId.toString()} onChange={(v) => setUlogaId(Number(v))} />

      {/* Zaposleni polja */}
      <InputField label="Ime" value={ime} onChange={setIme} />
      <InputField label="Prezime" value={prezime} onChange={setPrezime} />
      <InputField label="Datum rođenja" type="date" value={datumRodjenja} onChange={setDatumRodjenja} />
      <InputField label="Pozicija" value={pozicija} onChange={setPozicija} />
      <InputField label="Plata" type="number" value={plata} onChange={setPlata} />
      <InputField label="Datum zaposlenja" type="date" value={datumZaposlenja} onChange={setDatumZaposlenja} />
    </Modal>
  );
}

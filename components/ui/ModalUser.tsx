"use client";

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputField from "./InputField";

export type UserEmployeeData = {
  email: string;
  lozinka: string;
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
};

export default function ModalUser({
  isOpen,
  onClose,
  onSave,
}: ModalUserProps) {
  const ulogaId = 3;

  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [pozicija, setPozicija] = useState("");
  const [plata, setPlata] = useState("");
  const [datumZaposlenja, setDatumZaposlenja] = useState("");
  // Validacija
  const validate = () => {
    if (!email.includes("@")) {
      alert("Email nije validan");
      return false;
    }

    if (!lozinka || lozinka.length < 6) {
      alert("Lozinka mora imati najmanje 6 karaktera");
      return false;
    }

    if (!ime || !prezime) {
      alert("Ime i prezime su obavezni");
      return false;
    }

    if (!datumRodjenja) {
      alert("Datum rođenja je obavezan");
      return false;
    }

    const birthYear = new Date(datumRodjenja).getFullYear();
    const employmentYear = new Date(datumZaposlenja).getFullYear();
    const currentYear = new Date().getFullYear();

    if (currentYear - birthYear > 100) {
      alert("Osoba ne može biti starija od 100 godina");
      return false;
    }

    if (employmentYear < birthYear) {
      alert("Datum zaposlenja ne može biti pre datuma rođenja");
      return false;
    }

    return true;
  };
  // Reset forme kad se modal zatvori
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setLozinka("");
      setIme("");
      setPrezime("");
      setDatumRodjenja("");
      setPozicija("");
      setPlata("");
      setDatumZaposlenja("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!validate()) return;
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
      title="Dodaj zaposlenog"
      saveLabel="Dodaj"
    >
      <InputField label="Email" value={email} onChange={setEmail} />
      <InputField label="Lozinka" type="password" value={lozinka} onChange={setLozinka} />
      <InputField label="Ime" value={ime} onChange={setIme} />
      <InputField label="Prezime" value={prezime} onChange={setPrezime} />
      <InputField
        label="Datum rođenja"
        type="date"
        value={datumRodjenja}
        onChange={setDatumRodjenja}
      />
      <InputField label="Pozicija" value={pozicija} onChange={setPozicija} />
      <InputField label="Plata" type="number" value={plata} onChange={setPlata} />
      <InputField
        label="Datum zaposlenja"
        type="date"
        value={datumZaposlenja}
        onChange={setDatumZaposlenja}
      />
    </Modal>
  );
}

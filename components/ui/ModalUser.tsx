"use client";

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputField from "./InputField";
import Button from "./Button";

export type UserEmployeeData = {
  email: string;
  lozinka?: string; // opcionalno za edit
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
  initialData?: UserEmployeeData; // za edit
  isEdit?: boolean;               // flag za edit
};

export default function ModalUser({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit = false,
}: ModalUserProps) {
  const ulogaId = 3;

  const [email, setEmail] = useState(initialData?.email || "");
  const [lozinka, setLozinka] = useState("");
  const [ime, setIme] = useState(initialData?.ime || "");
  const [prezime, setPrezime] = useState(initialData?.prezime || "");
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [pozicija, setPozicija] = useState(initialData?.pozicija || "");
  const [plata, setPlata] = useState(initialData?.plata || "");
  const [datumZaposlenja, setDatumZaposlenja] = useState("");

  // Funkcija za formatiranje datuma u YYYY-MM-DD
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Popuni formu kad se modal otvori
  useEffect(() => {
    console.log("Initial Data:", initialData);
    if (isOpen) {
      setEmail(initialData?.email || "");
      setLozinka("");
      setIme(initialData?.ime || "");
      setPrezime(initialData?.prezime || "");
      setDatumRodjenja(formatDate(initialData?.datumRodjenja));
      setPozicija(initialData?.pozicija || "");
      setPlata(initialData?.plata || "");
      setDatumZaposlenja(formatDate(initialData?.datumZaposlenja));
    }
  }, [isOpen, initialData]);


  // Validacija
  const validate = () => {
    if (!email.includes("@")) {
      alert("Email nije validan");
      return false;
    }

    if (!isEdit && (!lozinka || lozinka.length < 6)) {
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
    const employmentYear = datumZaposlenja ? new Date(datumZaposlenja).getFullYear() : birthYear;
    const currentYear = new Date().getFullYear();

    if (currentYear - birthYear > 100) {
      alert("Osoba ne može biti starija od 100 godina");
      return false;
    }

    if (datumZaposlenja && employmentYear < birthYear) {
      alert("Datum zaposlenja ne može biti pre datuma rođenja");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      email,
      lozinka: lozinka || undefined,
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
      title={isEdit ? "Azuriraj zaposlenog" : "Dodaj zaposlenog"}
      saveLabel={isEdit ? "Sačuvaj" : "Dodaj"}
      onSave={handleSave} // samo jedan set dugmadi
    >
      <div className="space-y-4">
        <InputField label="Email" value={email} onChange={setEmail} />
        {!isEdit && <InputField label="Lozinka" type="password" value={lozinka} onChange={setLozinka} />}
        <InputField label="Ime" value={ime} onChange={setIme} />
        <InputField label="Prezime" value={prezime} onChange={setPrezime} />
        <InputField label="Datum rođenja" type="date" value={datumRodjenja} onChange={setDatumRodjenja} />
        <InputField label="Pozicija" value={pozicija} onChange={setPozicija} />
        <InputField label="Plata" type="number" value={plata} onChange={setPlata} />
        <InputField label="Datum zaposlenja" type="date" value={datumZaposlenja} onChange={setDatumZaposlenja} />
      </div>
    </Modal>
  );
}

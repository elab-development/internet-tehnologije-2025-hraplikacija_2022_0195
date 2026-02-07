"use client";
 
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputField from "./InputField";
 
export type CreateHrAdminData = {
  email: string;
  lozinka: string;
  ime?: string;
  prezime?: string;
};
 
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateHrAdminData) => void;
};
 
export default function ModalCreateHrAdmin({ isOpen, onClose, onSave }: Props) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [ime, setIme] = useState("HR");
  const [prezime, setPrezime] = useState("Admin");
 
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setLozinka("");
      setIme("HR");
      setPrezime("Admin");
    }
  }, [isOpen]);
 
  const validate = () => {
    if (!email.includes("@")) {
      alert("Email nije validan");
      return false;
    }
    if (!lozinka || lozinka.length < 6) {
      alert("Lozinka mora imati najmanje 6 karaktera");
      return false;
    }
    return true;
  };
 
  const handleSave = () => {
    if (!validate()) return;
    onSave({ email, lozinka, ime, prezime });
  };
 
  return (
    <Modal title="Dodaj HR admina" isOpen={isOpen} onClose={onClose} onSave={handleSave} saveLabel="Dodaj">
      <div className="space-y-4">
        <InputField label="Email" value={email} onChange={setEmail} />
        <InputField label="Lozinka" type="password" value={lozinka} onChange={setLozinka} />
        <InputField label="Ime (opciono)" value={ime} onChange={setIme} />
        <InputField label="Prezime (opciono)" value={prezime} onChange={setPrezime} />
      </div>
    </Modal>
  );
}
 
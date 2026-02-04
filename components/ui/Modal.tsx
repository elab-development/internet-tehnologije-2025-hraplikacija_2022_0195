"use client";

import React, { ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
  saveLabel?: string;
};

export default function Modal({
  title,
  isOpen,
  onClose,
  onSave,
  children,
  saveLabel = "Sačuvaj",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-auto">
      <div className="bg-zinc-900 p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="space-y-3">{children}</div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} className="bg-gray-600">
            Otkaži
          </Button>
          <Button onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  );
}

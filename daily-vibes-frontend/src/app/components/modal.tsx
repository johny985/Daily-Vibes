"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import style from "./modal.module.css";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({ top: 0 });
    }
  }, []);

  return createPortal(
    <dialog
      onClick={(e) => {
        if ((e.target as HTMLElement).nodeName === "DIALOG") {
          if (onClose) onClose();
        }
      }}
      ref={dialogRef}
      className={style.modal}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (onClose) onClose();
        }
      }}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root") as HTMLElement
  );
}

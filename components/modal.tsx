"use client";

import { useAnimatedTransitionClasses } from "@/hooks/useAnimatedTransitionClasses";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal(props: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { isOpen, onClose, children } = props;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const [state, transitionClasses] = useAnimatedTransitionClasses(props, 300, "animate__fadeIn", "animate__fadeOut");

  if (!state?.isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 p-2 overflow-y-auto z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate__animated ${transitionClasses}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg rounded-lg shadow-lg bg-zinc-800 animate__animated ${transitionClasses}UpBig`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none ring-offset-zinc-950 focus:ring-zinc-800 data-[state=open]:bg-zinc-800"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

/**
 * Submit button for admin forms. Disables itself while the action runs so a
 * double-click can't send the same change twice, and can ask for confirmation
 * first (for destructive actions).
 */
export default function SubmitButton({
  children,
  className = "",
  confirm,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  confirm?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const busy = useRef(false);
  useEffect(() => {
    if (!pending) busy.current = false;
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={`${className} disabled:opacity-50 disabled:cursor-wait`}
      onClick={(e) => {
        if (busy.current) {
          e.preventDefault();
          return;
        }
        if (confirm && !window.confirm(confirm)) {
          e.preventDefault();
          return;
        }
        busy.current = true;
        // Safety valve in case the submit never starts (e.g. offline).
        setTimeout(() => {
          busy.current = false;
        }, 8000);
      }}
    >
      {children}
    </button>
  );
}

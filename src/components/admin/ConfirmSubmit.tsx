"use client";

import type { ReactNode } from "react";
import SubmitButton from "./SubmitButton";

/** Submit button that asks for confirmation first (for destructive admin actions). */
export default function ConfirmSubmit({ message, className, children }: { message: string; className?: string; children: ReactNode }) {
  return (
    <SubmitButton confirm={message} className={className}>
      {children}
    </SubmitButton>
  );
}

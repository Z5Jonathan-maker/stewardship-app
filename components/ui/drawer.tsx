"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/**
 * Accessible slide-in drawer built on Radix Dialog. Radix gives us the full
 * modal-dialog contract for free: focus moves in on open, focus is trapped,
 * Escape closes, focus is restored on close, body scroll is locked, and the
 * rest of the page is hidden from assistive tech.
 */

export const DrawerClose = Dialog.Close;

interface DrawerProps {
  /** The element that opens the drawer (e.g. a hamburger button). */
  trigger: React.ReactNode;
  /** Accessible title (visually hidden). */
  title: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  trigger,
  title,
  side = "left",
  children,
  className,
}: DrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-evergreen-900/40 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 z-50 flex w-72 max-w-[80%] flex-col bg-cream-50 shadow-lift focus:outline-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200",
            side === "left"
              ? "left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
              : "right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            className
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

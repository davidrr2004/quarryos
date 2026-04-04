import type { ReactNode } from "react";

type DialogShellProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName: string;
};

export default function DialogShell({ open, onClose, children, panelClassName }: DialogShellProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`w-full ${panelClassName}`}>{children}</div>
    </div>
  );
}

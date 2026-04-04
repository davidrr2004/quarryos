import type { Worker } from "./types";
import DialogShell from "../../components/DialogShell";

type DeleteWorkerDialogProps = {
  worker: Worker | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteWorkerDialog({ worker, onCancel, onConfirm }: DeleteWorkerDialogProps) {
  return (
    <DialogShell
      open={Boolean(worker)}
      onClose={onCancel}
      panelClassName="max-w-sm rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900">Delete worker</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Are you sure you want to delete {worker?.name}? This action cannot be undone.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[var(--radius-field)] bg-[var(--color-error)] px-4 py-3 text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

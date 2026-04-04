import type { WorkerCard } from "./types";
import DialogShell from "../../components/DialogShell";

type IssueDialogProps = {
  worker: WorkerCard | null;
  issueReason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function IssueDialog({
  worker,
  issueReason,
  onReasonChange,
  onCancel,
  onConfirm,
}: IssueDialogProps) {
  return (
    <DialogShell
      open={Boolean(worker)}
      onClose={onCancel}
      panelClassName="max-w-md rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Record issue</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Worker: {worker.name}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-2 py-1 text-xl leading-none text-[var(--color-dimmed)] hover:bg-slate-100"
            aria-label="Close issue dialog"
          >
            ×
          </button>
        </div>

        <label className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-dimmed)]">
          Issue reason
        </label>
        <textarea
          value={issueReason}
          onChange={(event) => onReasonChange(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)]"
          placeholder="Describe the issue briefly"
        />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-[var(--radius-field)] bg-[var(--color-error)] px-4 py-3 text-sm font-semibold text-white"
          >
            Save Issue
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

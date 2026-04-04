import type { WorkerFormValues } from "./types";
import DialogShell from "../../components/DialogShell";

type WorkerFormDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  values: WorkerFormValues;
  onChange: (field: keyof WorkerFormValues, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function WorkerFormDialog({
  open,
  mode,
  values,
  onChange,
  onCancel,
  onSave,
}: WorkerFormDialogProps) {
  return (
    <DialogShell
      open={open}
      onClose={onCancel}
      panelClassName="max-w-md rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900">{mode === "add" ? "Add Worker" : "Edit Worker"}</h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Name</label>
            <input
              value={values.name}
              onChange={(event) => onChange("name", event.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="Worker name"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Employee ID</label>
            <input
              value={values.eid}
              onChange={(event) => onChange("eid", event.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="EMP-001"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Phone</label>
            <input
              value={values.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="+60..."
            />
          </div>
        </div>

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
            onClick={onSave}
            className="rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

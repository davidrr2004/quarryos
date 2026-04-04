import type { FleetCostType } from "./types";
import DialogShell from "../../components/DialogShell";

type AddCostDialogProps = {
  vehicleNumber: string | null;
  costType: FleetCostType;
  amount: string;
  note: string;
  onTypeChange: (value: FleetCostType) => void;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function AddCostDialog({
  vehicleNumber,
  costType,
  amount,
  note,
  onTypeChange,
  onAmountChange,
  onNoteChange,
  onCancel,
  onSave,
}: AddCostDialogProps) {
  return (
    <DialogShell
      open={Boolean(vehicleNumber)}
      onClose={onCancel}
      panelClassName="max-w-md rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900">Add cost</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Vehicle: {vehicleNumber}</p>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Type</label>
            <select
              value={costType}
              onChange={(event) => onTypeChange(event.target.value as FleetCostType)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
            >
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Parking">Parking</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Amount</label>
            <input
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Note</label>
            <input
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="Brief note"
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
            Save Cost
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

import type { FleetAddVehicleValues, FleetVehicleStatus, FleetVehicleType } from "./types";
import DialogShell from "../../components/DialogShell";

type AddVehicleDialogProps = {
  open: boolean;
  values: FleetAddVehicleValues;
  onChangePlate: (value: string) => void;
  onChangeType: (value: FleetVehicleType) => void;
  onChangeStatus: (value: FleetVehicleStatus) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function AddVehicleDialog({
  open,
  values,
  onChangePlate,
  onChangeType,
  onChangeStatus,
  onCancel,
  onSave,
}: AddVehicleDialogProps) {
  return (
    <DialogShell
      open={open}
      onClose={onCancel}
      panelClassName="max-w-md rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900">Add vehicle</h3>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Plate</label>
            <input
              value={values.plate}
              onChange={(event) => onChangePlate(event.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              placeholder="KL-1234"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Type</label>
            <select
              value={values.type}
              onChange={(event) => onChangeType(event.target.value as FleetVehicleType)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
            >
              <option value="Truck">Truck</option>
              <option value="Pickup">Pickup</option>
              <option value="Minivan">Minivan</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dimmed)]">Status</label>
            <select
              value={values.status}
              onChange={(event) => onChangeStatus(event.target.value as FleetVehicleStatus)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
            >
              <option value="Working">Working</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Not Working">Not Working</option>
            </select>
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
            Save Vehicle
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

import type { FleetVehicle, FleetVehicleType } from "./types";

type FleetVehicleCardProps = {
  type: FleetVehicleType;
  vehicle: FleetVehicle;
  isOpen: boolean;
  onToggle: (vehicleNumber: string) => void;
  onOpenCostModal: (vehicleNumber: string) => void;
  onDeleteVehicle: (type: FleetVehicleType, vehicleNumber: string) => void;
};

const statusBadgeClass: Record<FleetVehicle["status"], string> = {
  Working: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  Maintenance: "bg-[#fff7ed] text-[#c2410c]",
  "Not Working": "bg-[#fef2f2] text-[var(--color-error)]",
};

export default function FleetVehicleCard({
  type,
  vehicle,
  isOpen,
  onToggle,
  onOpenCostModal,
  onDeleteVehicle,
}: FleetVehicleCardProps) {
  const totalCosts = vehicle.costs.reduce((sum, cost) => sum + cost.amt, 0);
  const detailId = `vd-${vehicle.num.replace(/-/g, "")}`;

  return (
    <div className="space-y-2">
      <div
        className="flex cursor-pointer items-center justify-between rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-4 py-3 shadow-[var(--shadow-soft)] transition-colors hover:bg-slate-50"
        onClick={() => onToggle(vehicle.num)}
      >
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-slate-900">{vehicle.num}</div>
          <div className="mt-1 text-[0.72rem] font-medium text-[var(--color-muted)]">
            {type} · {vehicle.assignedTo || "Unassigned"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${statusBadgeClass[vehicle.status]}`}>
            {vehicle.status}
          </span>
          <span className="text-[var(--color-dimmed)]">{isOpen ? "▾" : "▸"}</span>
        </div>
      </div>

      <div
        id={detailId}
        className="overflow-hidden transition-all duration-200"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-sans text-[17px] font-semibold tracking-[0.08em] text-slate-900">
                {vehicle.num} · {type.toUpperCase()}
              </div>
              <div className="mt-1 text-[10px] text-[var(--color-dimmed)]">
                {vehicle.assignedTo ? `Assigned: ${vehicle.assignedTo}` : "Unassigned"} · {vehicle.status}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenCostModal(vehicle.num);
                }}
                className="rounded-[var(--radius-selector)] bg-[var(--color-primary-light)] px-3 py-2 text-xs font-bold text-[var(--color-primary)]"
              >
                + Cost
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteVehicle(type, vehicle.num);
                }}
                className="rounded-[var(--radius-selector)] bg-[var(--color-error)] px-3 py-2 text-xs font-bold text-white"
              >
                Del
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-field)] bg-[var(--color-primary-light)] px-3 py-3 text-center">
              <div className="text-xl font-black text-slate-900">{vehicle.totalRuns}</div>
              <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">Total Runs</div>
            </div>
            <div className="rounded-[var(--radius-field)] bg-[#ecfdf5] px-3 py-3 text-center">
              <div className="text-xl font-black text-[var(--color-success)]">RM {vehicle.totalEarn}</div>
              <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">Earnings</div>
            </div>
            <div className="rounded-[var(--radius-field)] bg-[#fef2f2] px-3 py-3 text-center">
              <div className="text-xl font-black text-[var(--color-error)]">RM {totalCosts}</div>
              <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">Expenses</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-dimmed)]">Cost Log</div>
            <div className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2">
              {vehicle.costs.length ? (
                vehicle.costs.map((cost, index) => (
                  <div key={`${vehicle.num}-${cost.type}-${index}`} className="flex items-center justify-between gap-3 border-b border-white/60 py-2 last:border-b-0">
                    <span className="text-sm text-slate-700">{cost.type} · {cost.note}</span>
                    <span className="font-mono text-sm font-semibold text-slate-900">RM {cost.amt}</span>
                  </div>
                ))
              ) : (
                <div className="py-1 text-sm text-[var(--color-dimmed)]">No costs logged.</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-dimmed)]">Trip History</div>
            <div className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2">
              {vehicle.trips.length ? (
                vehicle.trips.map((trip, index) => {
                  const colors = ["var(--color-warning)", "var(--color-primary)", "var(--color-success)"];
                  return (
                    <div key={`${vehicle.num}-${trip.route}-${index}`} className="flex items-start gap-3 border-b border-white/60 py-2 last:border-b-0">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colors[index % 3] }} />
                      <div>
                        <div className="text-sm text-slate-700">{trip.route} · {trip.runs} runs · RM {trip.earn}</div>
                        <div className="text-[11px] text-[var(--color-dimmed)]">{trip.date} · {trip.worker}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-1 text-sm text-[var(--color-dimmed)]">No trips yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

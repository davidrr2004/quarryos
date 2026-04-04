import FleetVehicleCard from "./FleetVehicleCard";
import type { FleetFilterStatus, FleetVehicle, FleetVehicleType } from "./types";

type FleetTypeSectionProps = {
  type: FleetVehicleType;
  vehicles: FleetVehicle[];
  filterState: FleetFilterStatus;
  openGroup: boolean;
  openVehicleNumber: string | null;
  onToggleGroup: (type: FleetVehicleType) => void;
  onToggleVehicle: (vehicleNumber: string) => void;
  onOpenCostModal: (vehicleNumber: string) => void;
  onDeleteVehicle: (type: FleetVehicleType, vehicleNumber: string) => void;
};

export default function FleetTypeSection({
  type,
  vehicles,
  filterState,
  openGroup,
  openVehicleNumber,
  onToggleGroup,
  onToggleVehicle,
  onOpenCostModal,
  onDeleteVehicle,
}: FleetTypeSectionProps) {
  const filtered = filterState === "all" ? vehicles : vehicles.filter((vehicle) => vehicle.status === filterState);
  if (!filtered.length) return null;

  const workingCount = vehicles.filter((vehicle) => vehicle.status === "Working").length;
  const sectionId = `ft-${type.toLowerCase()}`;

  return (
    <div className="mb-3">
      <div
        className="flex cursor-pointer items-center justify-between rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-4 py-3 shadow-[var(--shadow-soft)] transition-colors hover:bg-slate-50"
        onClick={() => onToggleGroup(type)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-selector)] bg-[var(--color-primary-light)] text-lg">
            {type === "Truck" ? "🚛" : type === "Pickup" ? "🛻" : "🚐"}
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-slate-900">{type}</div>
            <div className="text-[0.72rem] text-[var(--color-muted)]">{vehicles.length} vehicles · {workingCount} working</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${workingCount > 0 ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "bg-[#fef2f2] text-[var(--color-error)]"}`}>
            {workingCount} active
          </span>
          <span className="text-[var(--color-dimmed)]">{openGroup ? "▾" : "▸"}</span>
        </div>
      </div>

      <div id={sectionId} className="mt-2 space-y-2" style={{ display: openGroup ? "block" : "none" }}>
        {filtered.map((vehicle) => (
          <FleetVehicleCard
            key={vehicle.num}
            type={type}
            vehicle={vehicle}
            isOpen={openVehicleNumber === vehicle.num}
            onToggle={onToggleVehicle}
            onOpenCostModal={onOpenCostModal}
            onDeleteVehicle={onDeleteVehicle}
          />
        ))}
      </div>
    </div>
  );
}

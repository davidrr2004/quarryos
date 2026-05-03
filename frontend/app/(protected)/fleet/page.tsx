"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddCostDialog from "./components/AddCostDialog";
import AddVehicleDialog from "./components/AddVehicleDialog";
import FleetFilterTabs from "./components/FleetFilterTabs";
import FleetTypeSection from "./components/FleetTypeSection";
import FinanceShortcutCard from "../components/FinanceShortcutCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import { StatCard, StatsGrid } from "../components/StatsGrid";
import { api, ApiResponse } from "../../lib/api";
import type {
  FleetAddVehicleValues,
  FleetCostType,
  FleetFilterStatus,
  FleetVehicle,
  FleetVehicleType,
  FleetVehicleStatus,
  FleetCostEntry,
  FleetTripEntry,
} from "./components/types";

// Backend types
interface BackendVehicle {
  id: string;
  plate_number: string;
  vehicle_type: "truck" | "pickup" | "minivan";
  status: "working" | "maintenance" | "not_working";
  is_active: boolean;
  created_at: string;
}

interface BackendCost {
  id: string;
  vehicle_id: string;
  cost_type: string;
  amount: string;
  note: string | null;
  recorded_at: string;
}

interface BackendAssignment {
  id: string;
  vehicle_id: string;
  worker: { name: string } | null;
  batch: { route_from: string; route_to: string } | null;
  runs_completed: number;
  total_earned: string;
  return_status: string;
}

const TAB_LABELS: Array<{ label: string; value: FleetFilterStatus; short: string }> = [
  { label: "All", value: "all", short: "ALL" },
  { label: "Working", value: "Working", short: "WORKING" },
  { label: "Maintenance", value: "Maintenance", short: "MAINT." },
  { label: "Off", value: "Not Working", short: "OFF" },
];

const EMPTY_VEHICLE: FleetAddVehicleValues = {
  plate: "",
  type: "Truck",
  status: "Working",
};

// Map backend status to frontend status
function mapStatus(status: BackendVehicle["status"]): FleetVehicleStatus {
  const statusMap: Record<BackendVehicle["status"], FleetVehicleStatus> = {
    working: "Working",
    maintenance: "Maintenance",
    not_working: "Not Working",
  };
  return statusMap[status];
}

// Map backend vehicle type to frontend type
function mapVehicleType(type: BackendVehicle["vehicle_type"]): FleetVehicleType {
  const typeMap: Record<BackendVehicle["vehicle_type"], FleetVehicleType> = {
    truck: "Truck",
    pickup: "Pickup",
    minivan: "Minivan",
  };
  return typeMap[type];
}

export default function FleetPage() {
  const router = useRouter();

  const [fleet, setFleet] = useState<Record<FleetVehicleType, FleetVehicle[]>>({
    Truck: [],
    Pickup: [],
    Minivan: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FleetFilterStatus>("all");
  const [openGroups, setOpenGroups] = useState<Record<FleetVehicleType, boolean>>({
    Truck: false,
    Pickup: false,
    Minivan: false,
  });
  const [openVehicleNumber, setOpenVehicleNumber] = useState<string | null>(null);
  const [costTargetVnum, setCostTargetVnum] = useState<string | null>(null);
  const [costType, setCostType] = useState<FleetCostType>("Fuel");
  const [costAmount, setCostAmount] = useState("");
  const [costNote, setCostNote] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState<FleetAddVehicleValues>(EMPTY_VEHICLE);
  // plate → vehicle_id map so we don't re-fetch on every cost/delete action
  const [plateToId, setPlateToId] = useState<Map<string, string>>(new Map());  // Reusable fetchData — called on mount and after every mutation
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesRes, costsRes, assignmentsRes] = await Promise.all([
        api.listVehicles() as Promise<ApiResponse<BackendVehicle[]>>,
        api.listCosts() as Promise<ApiResponse<BackendCost[]>>,
        api.listAssignments() as Promise<ApiResponse<BackendAssignment[]>>,
      ]);

      const vehicles = vehiclesRes.data || [];
      const costs = costsRes.data || [];
      const assignments = assignmentsRes.data || [];

      // Build plate → id map
      const idMap = new Map<string, string>();
      vehicles.forEach((v) => idMap.set(v.plate_number, v.id));
      setPlateToId(idMap);

      // Group costs by vehicle_id
      const costsByVehicle = new Map<string, FleetCostEntry[]>();
      costs.forEach((cost) => {
        const existing = costsByVehicle.get(cost.vehicle_id) || [];
        existing.push({
          type: cost.cost_type as FleetCostType,
          amt: parseFloat(cost.amount),
          note: cost.note || "—",
        });
        costsByVehicle.set(cost.vehicle_id, existing);
      });

      // Group assignments by vehicle_id
      const assignmentsByVehicle = new Map<string, FleetTripEntry[]>();
      assignments.forEach((a) => {
        if (a.vehicle_id) {
          const existing = assignmentsByVehicle.get(a.vehicle_id) || [];
          existing.push({
            route: a.batch ? `${a.batch.route_from} → ${a.batch.route_to}` : "—",
            runs: a.runs_completed,
            earn: parseFloat(a.total_earned) || 0,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            worker: a.worker?.name || "Unassigned",
          });
          assignmentsByVehicle.set(a.vehicle_id, existing);
        }
      });

      const mappedFleet: Record<FleetVehicleType, FleetVehicle[]> = { Truck: [], Pickup: [], Minivan: [] };
      vehicles.forEach((vehicle) => {
        const vType = mapVehicleType(vehicle.vehicle_type);
        const vehicleCosts = costsByVehicle.get(vehicle.id) || [];
        const vehicleTrips = assignmentsByVehicle.get(vehicle.id) || [];
        const totalEarn = vehicleTrips.reduce((sum, t) => sum + t.earn, 0);
        const totalRuns = vehicleTrips.reduce((sum, t) => sum + t.runs, 0);
        const assignedWorker = assignments
          .find((a) => a.vehicle_id === vehicle.id && a.return_status === "pending")
          ?.worker?.name || null;
        mappedFleet[vType].push({
          num: vehicle.plate_number,
          status: mapStatus(vehicle.status),
          assignedTo: assignedWorker,
          totalRuns,
          totalEarn,
          costs: vehicleCosts,
          trips: vehicleTrips,
        });
      });

      setFleet(mappedFleet);
    } catch (err) {
      console.error("Failed to fetch fleet data:", err);
      setError("Failed to load fleet data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const allVehicles = useMemo(() => Object.values(fleet).flat(), [fleet]);
  const counts = useMemo(() => {
    return {
      working: allVehicles.filter((vehicle) => vehicle.status === "Working").length,
      maintenance: allVehicles.filter((vehicle) => vehicle.status === "Maintenance").length,
      off: allVehicles.filter((vehicle) => vehicle.status === "Not Working").length,
    };
  }, [allVehicles]);

  const totalVehicles = allVehicles.length;

  const toggleGroup = (type: FleetVehicleType) => {
    setOpenGroups((current) => ({
      ...current,
      [type]: !current[type],
    }));
  };

  const toggleVehicle = (vehicleNumber: string) => {
    setOpenVehicleNumber((current) => (current === vehicleNumber ? null : vehicleNumber));
  };

  const openCostModal = (vehicleNumber: string) => {
    setCostTargetVnum(vehicleNumber);
    setCostAmount("");
    setCostNote("");
    setCostType("Fuel");
  };

  const saveCost = async () => {
    if (!costTargetVnum) return;
    const amt = Number.parseFloat(costAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      // Use plateToId map — no re-fetch needed
      const vehicleId = plateToId.get(costTargetVnum);
      if (!vehicleId) {
        alert("Vehicle not found. Please refresh.");
        return;
      }

      await api.createCost({
        vehicle_id: vehicleId,
        cost_type: costType.toLowerCase(),
        amount: amt,
        note: costNote || undefined,
      });

      setCostTargetVnum(null);
      // Re-fetch to stay in sync with backend
      await fetchData();
    } catch (err) {
      console.error("Failed to save cost:", err);
      alert("Failed to save cost. Please try again.");
    }
  };

  const deleteVehicle = async (type: FleetVehicleType, vehicleNumber: string) => {
    const confirmed = window.confirm(`Delete vehicle ${vehicleNumber}?`);
    if (!confirmed) return;

    try {
      // Use plateToId map — no re-fetch needed
      const vehicleId = plateToId.get(vehicleNumber);
      if (vehicleId) {
        await api.deleteVehicle(vehicleId);
      }
      // Re-fetch to get the accurate list (soft-deleted vehicles gone)
      await fetchData();
      if (openVehicleNumber === vehicleNumber) setOpenVehicleNumber(null);
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      alert("Failed to delete vehicle. Please try again.");
    }
  };

  const saveVehicle = async () => {
    const plate = newVehicle.plate.trim().toUpperCase();
    if (!plate) {
      alert("Plate number required.");
      return;
    }

    try {
      // Create vehicle in backend
      const vehicleTypeMap: Record<FleetVehicleType, BackendVehicle["vehicle_type"]> = {
        Truck: "truck",
        Pickup: "pickup",
        Minivan: "minivan",
      };

      const statusMap: Record<FleetVehicleStatus, BackendVehicle["status"]> = {
        Working: "working",
        Maintenance: "maintenance",
        "Not Working": "not_working",
      };

      await api.createVehicle({
        plate_number: plate,
        vehicle_type: vehicleTypeMap[newVehicle.type],
        status: statusMap[newVehicle.status],
      });

      setShowAddVehicle(false);
      setNewVehicle(EMPTY_VEHICLE);
      // Re-fetch everything so plateToId map and fleet state are in sync
      await fetchData();
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      alert("Failed to save vehicle. Plate number may already exist.");
    }
  };

  return (
    <PageShell>
      <PageContainer maxWidth="6xl">
        <PageHeader
          label="P6 Fleet"
          title="Fleet"
          subtitle="vehicles · maintenance · history"
          action={
            <button
              type="button"
              onClick={() => setShowAddVehicle(true)}
              className="rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)]"
            >
              + Add
            </button>
          }
        />

        <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            value={totalVehicles}
            label="Total"
            cardClassName="bg-[var(--color-primary-light)]"
            valueClassName="text-slate-900"
          />
          <StatCard
            value={counts.working}
            label="Working"
            cardClassName="bg-[#ecfdf5]"
            valueClassName="text-[var(--color-success)]"
          />
          <StatCard
            value={counts.maintenance}
            label="Maint."
            cardClassName="bg-[#fff7ed]"
            valueClassName="text-[#c2410c]"
          />
          <StatCard
            value={counts.off}
            label="Off"
            cardClassName="bg-[#fef2f2]"
            valueClassName="text-[var(--color-error)]"
          />
        </StatsGrid>

        {loading && (
          <div className="py-8 text-center text-slate-500">
            <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
            <p className="text-sm">Loading fleet data...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <FleetFilterTabs
              tabs={TAB_LABELS}
              filterState={filterState}
              onChange={setFilterState}
              getCount={(value) =>
                value === "all" ? totalVehicles : value === "Working" ? counts.working : value === "Maintenance" ? counts.maintenance : counts.off
              }
            />

            <section className="space-y-3">
              <SectionLabel title="Fleet Groups" />

              <FleetTypeSection
                type="Truck"
                vehicles={fleet.Truck}
                filterState={filterState}
                openGroup={openGroups.Truck}
                openVehicleNumber={openVehicleNumber}
                onToggleGroup={toggleGroup}
                onToggleVehicle={toggleVehicle}
                onOpenCostModal={openCostModal}
                onDeleteVehicle={deleteVehicle}
              />
              <FleetTypeSection
                type="Pickup"
                vehicles={fleet.Pickup}
                filterState={filterState}
                openGroup={openGroups.Pickup}
                openVehicleNumber={openVehicleNumber}
                onToggleGroup={toggleGroup}
                onToggleVehicle={toggleVehicle}
                onOpenCostModal={openCostModal}
                onDeleteVehicle={deleteVehicle}
              />
              <FleetTypeSection
                type="Minivan"
                vehicles={fleet.Minivan}
                filterState={filterState}
                openGroup={openGroups.Minivan}
                openVehicleNumber={openVehicleNumber}
                onToggleGroup={toggleGroup}
                onToggleVehicle={toggleVehicle}
                onOpenCostModal={openCostModal}
                onDeleteVehicle={deleteVehicle}
              />
            </section>
          </>
        )}

        <section>
          <SectionLabel title="Finance Shortcut" />
          <FinanceShortcutCard
            title="Fleet Finance & Payments"
            subtitle="Expenses · Daily runs · Pay now"
            onClick={() => router.push("/finance")}
          />
        </section>
      </PageContainer>

      <AddCostDialog
        vehicleNumber={costTargetVnum}
        costType={costType}
        amount={costAmount}
        note={costNote}
        onTypeChange={setCostType}
        onAmountChange={setCostAmount}
        onNoteChange={setCostNote}
        onCancel={() => setCostTargetVnum(null)}
        onSave={saveCost}
      />

      <AddVehicleDialog
        open={showAddVehicle}
        values={newVehicle}
        onChangePlate={(value) => setNewVehicle((current) => ({ ...current, plate: value }))}
        onChangeType={(value) => setNewVehicle((current) => ({ ...current, type: value }))}
        onChangeStatus={(value) => setNewVehicle((current) => ({ ...current, status: value }))}
        onCancel={() => setShowAddVehicle(false)}
        onSave={saveVehicle}
      />
    </PageShell>
  );
}
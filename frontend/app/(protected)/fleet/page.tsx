"use client";

import { useMemo, useState } from "react";
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
import type {
  FleetAddVehicleValues,
  FleetCostType,
  FleetFilterStatus,
  FleetVehicle,
  FleetVehicleType,
} from "./components/types";

const INITIAL_FLEET: Record<FleetVehicleType, FleetVehicle[]> = {
  Truck: [
    {
      num: "KL-5510",
      status: "Working",
      assignedTo: "Ahmad Raza",
      totalRuns: 16,
      totalEarn: 1440,
      costs: [
        { type: "Fuel", amt: 120, note: "Morning top up" },
        { type: "Maintenance", amt: 85, note: "Hydraulic oil" },
      ],
      trips: [
        { route: "Route A", runs: 6, earn: 540, date: "Apr 2", worker: "Ahmad Raza" },
        { route: "Route B", runs: 4, earn: 360, date: "Apr 3", worker: "Ahmad Raza" },
      ],
    },
    {
      num: "KL-1142",
      status: "Maintenance",
      assignedTo: null,
      totalRuns: 9,
      totalEarn: 765,
      costs: [{ type: "Maintenance", amt: 210, note: "Brake inspection" }],
      trips: [{ route: "Route A", runs: 5, earn: 425, date: "Apr 1", worker: "Ravi Shankar" }],
    },
    {
      num: "KL-8841",
      status: "Working",
      assignedTo: "Siti Nora",
      totalRuns: 12,
      totalEarn: 1020,
      costs: [{ type: "Fuel", amt: 95, note: "Refill" }],
      trips: [{ route: "Route C", runs: 4, earn: 340, date: "Apr 2", worker: "Siti Nora" }],
    },
  ],
  Pickup: [
    {
      num: "KL-2341",
      status: "Working",
      assignedTo: "Lee Chong",
      totalRuns: 14,
      totalEarn: 980,
      costs: [{ type: "Fuel", amt: 80, note: "Fuel refill" }],
      trips: [{ route: "Route D", runs: 4, earn: 300, date: "Apr 2", worker: "Lee Chong" }],
    },
    {
      num: "KL-3301",
      status: "Working",
      assignedTo: "Siti Nora",
      totalRuns: 11,
      totalEarn: 935,
      costs: [{ type: "Parking", amt: 20, note: "Night yard" }],
      trips: [{ route: "Route B", runs: 3, earn: 255, date: "Apr 3", worker: "Siti Nora" }],
    },
    {
      num: "KL-9988",
      status: "Working",
      assignedTo: null,
      totalRuns: 7,
      totalEarn: 525,
      costs: [],
      trips: [],
    },
  ],
  Minivan: [
    {
      num: "KL-1542",
      status: "Maintenance",
      assignedTo: null,
      totalRuns: 6,
      totalEarn: 270,
      costs: [{ type: "Maintenance", amt: 145, note: "Tyre replacement" }],
      trips: [{ route: "Route C", runs: 2, earn: 90, date: "Apr 1", worker: "Muthu Kumar" }],
    },
    {
      num: "KL-7720",
      status: "Working",
      assignedTo: "Ravi Shankar",
      totalRuns: 13,
      totalEarn: 845,
      costs: [{ type: "Fuel", amt: 70, note: "Fuel refill" }],
      trips: [{ route: "Route A", runs: 5, earn: 425, date: "Apr 3", worker: "Ravi Shankar" }],
    },
    {
      num: "KL-5590",
      status: "Working",
      assignedTo: "Muthu Kumar",
      totalRuns: 10,
      totalEarn: 450,
      costs: [],
      trips: [],
    },
  ],
};

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

export default function FleetPage() {
  const router = useRouter();

  const [fleet, setFleet] = useState(INITIAL_FLEET);
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

  const saveCost = () => {
    if (!costTargetVnum) return;
    const amt = Number.parseFloat(costAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    setFleet((current) => ({
      Truck: current.Truck.map((vehicle) =>
        vehicle.num === costTargetVnum ? { ...vehicle, costs: [{ type: costType, amt, note: costNote || "—" }, ...vehicle.costs] } : vehicle
      ),
      Pickup: current.Pickup.map((vehicle) =>
        vehicle.num === costTargetVnum ? { ...vehicle, costs: [{ type: costType, amt, note: costNote || "—" }, ...vehicle.costs] } : vehicle
      ),
      Minivan: current.Minivan.map((vehicle) =>
        vehicle.num === costTargetVnum ? { ...vehicle, costs: [{ type: costType, amt, note: costNote || "—" }, ...vehicle.costs] } : vehicle
      ),
    }));

    setCostTargetVnum(null);
  };

  const deleteVehicle = (type: FleetVehicleType, vehicleNumber: string) => {
    const confirmed = window.confirm(`Delete vehicle ${vehicleNumber}?`);
    if (!confirmed) return;

    setFleet((current) => ({
      ...current,
      [type]: current[type].filter((vehicle) => vehicle.num !== vehicleNumber),
    }));

    if (openVehicleNumber === vehicleNumber) {
      setOpenVehicleNumber(null);
    }
  };

  const saveVehicle = () => {
    const plate = newVehicle.plate.trim().toUpperCase();
    if (!plate) {
      alert("Plate number required.");
      return;
    }

    setFleet((current) => ({
      ...current,
      [newVehicle.type]: [
        ...current[newVehicle.type],
        {
          num: plate,
          status: newVehicle.status,
          assignedTo: null,
          totalRuns: 0,
          totalEarn: 0,
          costs: [],
          trips: [],
        },
      ],
    }));

    setShowAddVehicle(false);
    setNewVehicle(EMPTY_VEHICLE);
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
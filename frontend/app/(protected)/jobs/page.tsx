"use client";

import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import VehicleFilterCard, { VehicleFilterType } from "./components/VehicleFilterCard";
import SubmitLockDialog from "./components/SubmitLockDialog";
import SubmitLockPanel from "./components/SubmitLockPanel";
import WorkerRow from "./components/WorkerRow";
import AssignModal from "./components/AssignModal";
import { Worker, VehicleType, VehicleOption } from "./components/types";

/* ── Seed data (swap with API calls later) ── */
const VEHICLE_OPTIONS: VehicleOption[] = [
  { type: "truck",   plates: ["KL-3901", "KL-3902", "KL-5510"], wagePerRun: 90 },
  { type: "pickup",  plates: ["KL-2341", "KL-2342", "KL-9988"], wagePerRun: 75 },
  { type: "minivan", plates: ["KL-1542", "KL-7720"],             wagePerRun: 85 },
];

const INITIAL_WORKERS: Worker[] = [
  { id: "1", name: "Ahmad Raza",   initials: "AR" },
  { id: "2", name: "Siti Nora",    initials: "SN", vehicleType: "truck",  vehicleNumber: "KL-3901", wage: 90 },
  { id: "3", name: "Muthu Kumar",  initials: "MK" },
  { id: "4", name: "Ravi Shankar", initials: "RS", vehicleType: "truck",  vehicleNumber: "KL-1542", wage: 85 },
  { id: "5", name: "Lee Chong",    initials: "LC" },
];

const DESTINATION = "Crushing Plant A";

export default function JobsPage() {
  const [workers, setWorkers]     = useState<Worker[]>(INITIAL_WORKERS);
  const [filter, setFilter]       = useState<VehicleFilterType>("all");
  const [modalWorker, setModal]   = useState<Worker | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const truckCount  = VEHICLE_OPTIONS.find((o) => o.type === "truck")?.plates.length  ?? 0;
  const pickupCount = VEHICLE_OPTIONS.find((o) => o.type === "pickup")?.plates.length ?? 0;
  const miniCount   = VEHICLE_OPTIONS.find((o) => o.type === "minivan")?.plates.length ?? 0;
  const totalCount  = truckCount + pickupCount + miniCount;

  const visibleWorkers =
    filter === "all" ? workers : workers.filter((w) => w.vehicleType === (filter as VehicleType));

  const handleConfirm = (id: string, vehicleType: VehicleType, vehicleNumber: string, wage: number) => {
    setWorkers((prev) => prev.map((w) => w.id === id ? { ...w, vehicleType, vehicleNumber, wage } : w));
  };

  const handleSubmitRequest = () => {
    if (assignedCount === 0) return;
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = () => {
    setSubmitted(true);
    setShowSubmitDialog(false);
  };

  const assignedCount = workers.filter((w) => w.vehicleType).length;

  return (
    <>
      <PageShell>
        <PageContainer>
          <PageHeader
            label="P1 Jobs"
            title="Job Control"
            subtitle="assign workers · manage routes"
          />

          <section>
            <SectionLabel title="Vehicle Availability - Tap to Filter" />
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <VehicleFilterCard type="all" count={totalCount} active={filter === "all"} onClick={() => setFilter("all")} />
              <VehicleFilterCard type="truck" count={truckCount} active={filter === "truck"} onClick={() => setFilter("truck")} />
              <VehicleFilterCard type="pickup" count={pickupCount} active={filter === "pickup"} onClick={() => setFilter("pickup")} />
              <VehicleFilterCard type="minivan" count={miniCount} active={filter === "minivan"} onClick={() => setFilter("minivan")} />
            </div>
          </section>

          <section>
            <SectionLabel title="Worker Assignment" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {visibleWorkers.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--color-dimmed)", fontSize: "0.8rem", padding: "2rem 0" }}>
                  No workers match this filter.
                </p>
              ) : (
                visibleWorkers.map((worker) => (
                  <WorkerRow key={worker.id} worker={worker} onAssign={(w) => setModal(w)} />
                ))
              )}
            </div>
          </section>

          <SubmitLockPanel
            submitted={submitted}
            assignedCount={assignedCount}
            onRequestSubmit={handleSubmitRequest}
          />
        </PageContainer>
      </PageShell>

      <SubmitLockDialog
        open={showSubmitDialog}
        assignedCount={assignedCount}
        totalWorkers={workers.length}
        onCancel={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmitConfirm}
      />

      {/* ── Assign Worker Modal ── */}
      {modalWorker && (
        <AssignModal
          worker={modalWorker}
          vehicleOptions={VEHICLE_OPTIONS}
          destination={DESTINATION}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
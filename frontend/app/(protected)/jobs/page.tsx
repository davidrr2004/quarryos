"use client";

import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import VehicleFilterCard, { VehicleFilterType } from "./components/VehicleFilterCard";
import SubmitLockDialog from "./components/SubmitLockDialog";
import SubmitLockPanel from "./components/SubmitLockPanel";
import WorkerRow from "./components/WorkerRow";
import AssignModal from "./components/AssignModal";
import { api, ApiResponse } from "../../lib/api";
import { Worker, VehicleType, VehicleOption } from "./components/types";

// Backend types
interface BackendWorker {
  id: string;
  name: string;
  employee_id: string;
  phone: string | null;
  is_active: boolean;
}

interface BackendVehicle {
  id: string;
  plate_number: string;
  vehicle_type: "truck" | "pickup" | "minivan";
  status: "working" | "maintenance" | "not_working";
}

interface BackendWageRate {
  vehicle_type: string;
  rate_per_run: string;
}

// Map of vehicle plate → vehicle id for assignment creation
type VehicleIdMap = Map<string, string>;

export default function JobsPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [vehicleIdMap, setVehicleIdMap] = useState<VehicleIdMap>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<VehicleFilterType>("all");
  const [modalWorker, setModal] = useState<Worker | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  // Track the current open batch id for locking on submit
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch all active workers
      const workersRes = await api.listWorkers({ active_only: true }) as ApiResponse<BackendWorker[]>;
      const backendWorkers = workersRes.data || [];

      // Fetch pending worker IDs (workers already assigned and not returned)
      const pendingRes = await api.getPendingWorkerIds() as ApiResponse<string[]>;
      const pendingWorkerIds = new Set(pendingRes.data || []);

      // Fetch vehicles (active only)
      const vehiclesRes = await api.listVehicles({ active_only: true }) as ApiResponse<BackendVehicle[]>;
      const vehicles = vehiclesRes.data || [];

      // Fetch wage rates
      const wageRes = await api.listWageRates() as ApiResponse<BackendWageRate[]>;
      const wageRates = wageRes.data || [];

      // Build vehicle options — only working vehicles
      const vehicleMap = new Map<VehicleType, string[]>();
      const idMap = new Map<string, string>();
      const wageMap = new Map<string, number>();

      vehicles.forEach((v) => {
        if (v.status === "working") {
          const type = v.vehicle_type as VehicleType;
          const existing = vehicleMap.get(type) || [];
          existing.push(v.plate_number);
          vehicleMap.set(type, existing);
        }
        // Store all vehicles in id map (not just working ones, for lookup)
        idMap.set(v.plate_number, v.id);
      });

      wageRates.forEach((w) => {
        wageMap.set(w.vehicle_type, parseFloat(w.rate_per_run));
      });

      const options: VehicleOption[] = [
        { type: "truck", plates: vehicleMap.get("truck") || [], wagePerRun: wageMap.get("truck") || 0 },
        { type: "pickup", plates: vehicleMap.get("pickup") || [], wagePerRun: wageMap.get("pickup") || 0 },
        { type: "minivan", plates: vehicleMap.get("minivan") || [], wagePerRun: wageMap.get("minivan") || 0 },
      ];
      setVehicleOptions(options);
      setVehicleIdMap(idMap);

      // Map workers — only show FREE workers (not in pending assignments)
      const freeWorkers: Worker[] = backendWorkers
        .filter((w) => !pendingWorkerIds.has(w.id))
        .map((w) => ({
          id: w.id,
          name: w.name,
          initials: w.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        }));

      setWorkers(freeWorkers);
    } catch (err) {
      console.error("Failed to fetch jobs data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const truckCount = vehicleOptions.find((o) => o.type === "truck")?.plates.length ?? 0;
  const pickupCount = vehicleOptions.find((o) => o.type === "pickup")?.plates.length ?? 0;
  const miniCount = vehicleOptions.find((o) => o.type === "minivan")?.plates.length ?? 0;
  const totalCount = truckCount + pickupCount + miniCount;

  const visibleWorkers =
    filter === "all" ? workers : workers.filter((w) => w.vehicleType === (filter as VehicleType));

  const handleConfirm = async (
    workerId: string,
    vehicleType: VehicleType,
    vehicleNumber: string,
    wage: number,
    routeFrom: string,
    routeTo: string,
    distanceKm: number,
  ) => {
    const vehicleId = vehicleIdMap.get(vehicleNumber);
    if (!vehicleId) {
      alert("Vehicle not found. Please refresh and try again.");
      return;
    }

    try {
      const res = await api.createAssignment({
        worker_id: workerId,
        vehicle_id: vehicleId,
        route_from: routeFrom,
        route_to: routeTo,
        distance_km: distanceKm,
      }) as ApiResponse<{ id: string; batch_id: string }>;

      // Track the batch id (for submit/lock later)
      if (res.data?.batch_id) {
        setCurrentBatchId(res.data.batch_id);
      }

      // Remove the assigned worker from the free list immediately
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
      setModal(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Assignment failed";
      alert(`Failed to assign worker: ${message}`);
    }
  };

  const handleSubmitRequest = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = async () => {
    // Lock the current batch if one exists
    if (currentBatchId) {
      try {
        await api.updateBatch(currentBatchId, { status: "locked" });
      } catch (err) {
        console.error("Failed to lock batch:", err);
        alert("Failed to lock batch. Assignments are still saved.");
      }
    }
    setSubmitted(true);
    setShowSubmitDialog(false);
    setCurrentBatchId(null);
  };

  const assignedCount = 0; // On jobs page, all visible workers are free; count comes from work-status

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
            <SectionLabel title="Vehicle Availability — Tap to Filter" />
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <VehicleFilterCard type="all" count={totalCount} active={filter === "all"} onClick={() => setFilter("all")} />
              <VehicleFilterCard type="truck" count={truckCount} active={filter === "truck"} onClick={() => setFilter("truck")} />
              <VehicleFilterCard type="pickup" count={pickupCount} active={filter === "pickup"} onClick={() => setFilter("pickup")} />
              <VehicleFilterCard type="minivan" count={miniCount} active={filter === "minivan"} onClick={() => setFilter("minivan")} />
            </div>
          </section>

          <section>
            <SectionLabel title="Available Workers" />
            {loading ? (
              <div className="py-8 text-center text-slate-500">
                <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
                <p className="text-sm">Loading workers...</p>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <p className="text-sm font-medium">{error}</p>
                <button onClick={fetchData} className="mt-2 text-xs underline">Retry</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {visibleWorkers.length === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--color-dimmed)", fontSize: "0.8rem", padding: "2rem 0" }}>
                    {workers.length === 0
                      ? "All workers are currently assigned. Check Work Status."
                      : "No workers match this filter."}
                  </p>
                ) : (
                  visibleWorkers.map((worker) => (
                    <WorkerRow key={worker.id} worker={worker} onAssign={(w) => setModal(w)} />
                  ))
                )}
              </div>
            )}
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

      {modalWorker && (
        <AssignModal
          worker={modalWorker}
          vehicleOptions={vehicleOptions}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
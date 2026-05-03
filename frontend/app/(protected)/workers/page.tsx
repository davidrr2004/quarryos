"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteWorkerDialog from "./components/DeleteWorkerDialog";
import WorkerCard from "./components/WorkerCard";
import WorkerFormDialog from "./components/WorkerFormDialog";
import FinanceShortcutCard from "../components/FinanceShortcutCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import { StatCard, StatsGrid } from "../components/StatsGrid";
import { api, ApiResponse } from "../../lib/api";
import type { Worker, WorkerFormValues } from "./components/types";

const PALETTES = [
  "linear-gradient(135deg,#334155,#1e293b)",
  "linear-gradient(135deg,#475569,#334155)",
  "linear-gradient(135deg,#1e293b,#0f172a)",
  "linear-gradient(135deg,#64748b,#475569)",
];

// Backend worker type
interface BackendWorker {
  id: string;
  name: string;
  employee_id: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

interface AssignmentInfo {
  vtype: string;
  vnum: string;
}

const EMPTY_FORM: WorkerFormValues = {
  name: "",
  eid: "",
  phone: "",
};

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

// Convert backend worker to frontend Worker type
function mapBackendWorker(bw: BackendWorker, index: number, assignments: Map<string, AssignmentInfo>): Worker {
  const assigned = assignments.get(bw.id) || null;
  return {
    id: bw.id,
    name: bw.name,
    initials: initialsFromName(bw.name),
    avatar: PALETTES[index % PALETTES.length],
    eid: bw.employee_id,
    phone: bw.phone || "-",
    assigned: assigned ? { vtype: assigned.vtype, vnum: assigned.vnum } : null,
  };
}

export default function WorkersPage() {
  const router = useRouter();

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<WorkerFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null);

  // Single reusable fetchData function
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [workersRes, assignmentsRes] = await Promise.all([
        api.listWorkers() as Promise<ApiResponse<BackendWorker[]>>,
        api.listAssignments({ return_status: "pending" }) as Promise<ApiResponse<Array<{
          id: string;
          worker_id: string;
          vehicle: { plate_number: string; vehicle_type: string } | null;
        }>>>,
      ]);

      const backendWorkers = workersRes.data || [];

      // Build assignment lookup map from pending assignments only
      const assignmentMap = new Map<string, AssignmentInfo>();
      (assignmentsRes.data || []).forEach((a) => {
        if (a.worker_id && a.vehicle) {
          assignmentMap.set(a.worker_id, {
            vtype: a.vehicle.vehicle_type.charAt(0).toUpperCase() + a.vehicle.vehicle_type.slice(1),
            vnum: a.vehicle.plate_number,
          });
        }
      });

      setWorkers(backendWorkers.map((bw, idx) => mapBackendWorker(bw, idx, assignmentMap)));
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      setError("Failed to load workers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const totalAssigned = useMemo(
    () => workers.filter((worker) => worker.assigned !== null).length,
    [workers]
  );

  const openAddWorker = () => {
    setFormMode("add");
    setEditingWorkerId(null);
    setFormValues(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditWorker = (worker: Worker) => {
    setFormMode("edit");
    setEditingWorkerId(worker.id as string);
    setFormValues({
      name: worker.name,
      eid: worker.eid,
      phone: worker.phone,
    });
    setFormOpen(true);
  };

  const saveWorker = async () => {
    const name = formValues.name.trim();
    const eid = formValues.eid.trim();
    const phone = formValues.phone.trim();

    if (!name) {
      return;
    }

    try {
      if (formMode === "edit" && editingWorkerId !== null) {
        // Update worker — do NOT send employee_id (not in WorkerUpdate schema)
        await api.updateWorker(editingWorkerId, {
          name,
          phone: phone || null,
        });
      } else {
        // Create new worker
        await api.createWorker({
          name,
          employee_id: eid || `EMP-${Date.now().toString(36).toUpperCase()}`,
          phone: phone || undefined,
        });
      }
      // Refresh list after any mutation
      await fetchData();

      setFormOpen(false);
      setEditingWorkerId(null);
      setFormValues(EMPTY_FORM);
    } catch (err) {
      console.error("Failed to save worker:", err);
      alert("Failed to save worker. Please try again.");
    }
  };

  const deleteWorker = async () => {
    if (!deleteTarget) return;
    
    try {
      await api.deleteWorker(deleteTarget.id as string);
      setWorkers((current) => current.filter((worker) => worker.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete worker:", err);
      alert("Failed to delete worker. Please try again.");
    }
  };

  return (
    <PageShell>
      <PageContainer>
        <PageHeader
          label="P3 Workers"
          title="Workers"
          subtitle="add · edit · delete"
          action={
            <button
              type="button"
              onClick={openAddWorker}
              className="rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-2 text-lg font-bold text-white"
              title="Add worker"
            >
              +
            </button>
          }
        />

        <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-3">
          <StatCard
            value={workers.length}
            label="Total Workers"
            cardClassName="bg-[var(--color-primary-light)]"
            valueClassName="text-[var(--foreground)]"
          />
          <StatCard
            value={totalAssigned}
            label="Assigned"
            cardClassName="bg-[#ecfdf5]"
            valueClassName="text-[var(--color-success)]"
          />
          <StatCard
            value={workers.length - totalAssigned}
            label="Unassigned"
            cardClassName="bg-[#fff7ed]"
            valueClassName="text-[#c2410c]"
          />
        </StatsGrid>

        {loading && (
          <div className="py-8 text-center text-slate-500">
            <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
            <p className="text-sm">Loading workers...</p>
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
          <section className="space-y-3">
            {workers.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 py-8 text-center text-slate-500">
                <p className="text-sm">No workers found. Add your first worker above.</p>
              </div>
            ) : (
              workers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onFinance={(workerId) => router.push(`/finance?worker=${workerId}`)}
                  onEdit={openEditWorker}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </section>
        )}

        <section>
          <SectionLabel title="Finance Shortcut" />
          <FinanceShortcutCard
            title="Worker Finance & Payments"
            subtitle="Expenses · Daily runs · Pay now"
            onClick={() => router.push("/finance")}
          />
        </section>
      </PageContainer>

      <WorkerFormDialog
        open={formOpen}
        mode={formMode}
        values={formValues}
        onChange={(field, value) =>
          setFormValues((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onCancel={() => setFormOpen(false)}
        onSave={saveWorker}
      />

      <DeleteWorkerDialog
        worker={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteWorker}
      />
    </PageShell>
  );
}
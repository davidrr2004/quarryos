"use client";

import { useEffect, useMemo, useState } from "react";
import IssueDialog from "./components/IssueDialog";
import WorkerStatusCard from "./components/WorkerStatusCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import { StatCard, StatsGrid } from "../components/StatsGrid";
import { api, ApiResponse } from "../../lib/api";
import type { WorkerCard } from "./components/types";

// Backend assignment type — nested objects now present
interface BackendAssignment {
  id: string;
  worker_id: string;
  worker: { name: string; employee_id: string } | null;
  vehicle: { plate_number: string; vehicle_type: string } | null;
  batch: { route_from: string; route_to: string } | null;
  runs_completed: number;
  wage_per_run: string;
  return_status: "pending" | "returned" | "issue" | "reassigned";
  issue_reason: string | null;
}

// Deterministic color from a string (no random)
function colorFromString(str: string): string {
  const PALETTES = [
    "linear-gradient(135deg,#334155,#1e293b)",
    "linear-gradient(135deg,#475569,#334155)",
    "linear-gradient(135deg,#1e293b,#0f172a)",
    "linear-gradient(135deg,#64748b,#475569)",
    "linear-gradient(135deg,#0f4c75,#1b262c)",
    "linear-gradient(135deg,#2c3e50,#3498db)",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

// Map vehicle_type from backend (lowercase) to display format
function mapVehicleType(type: string): "Pickup" | "Truck" | "Minivan" {
  const map: Record<string, "Pickup" | "Truck" | "Minivan"> = {
    truck: "Truck",
    pickup: "Pickup",
    minivan: "Minivan",
  };
  return map[type] || "Truck";
}

export default function WorkStatusPage() {
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issueWorker, setIssueWorker] = useState<WorkerCard | null>(null);
  const [issueReason, setIssueReason] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Only fetch pending assignments (active workers out on a job)
      const assignmentsRes = await api.listAssignments({ return_status: "pending" }) as ApiResponse<BackendAssignment[]>;
      const assignments = assignmentsRes.data || [];

      const mappedWorkers: WorkerCard[] = assignments.map((a) => {
        const workerName = a.worker?.name || "Unknown Worker";
        const initials = workerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
        return {
          id: a.id, // assignment id used for status updates
          name: workerName,
          initials,
          avatar: colorFromString(a.worker_id),
          vehicleNumber: a.vehicle?.plate_number || "—",
          vehicleType: mapVehicleType(a.vehicle?.vehicle_type || "truck"),
          route: a.batch ? `${a.batch.route_from} → ${a.batch.route_to}` : "—",
          runs: a.runs_completed,
          wage: parseFloat(a.wage_per_run) || 0,
          status: a.return_status as "pending" | "returned" | "issue",
        };
      });

      setWorkers(mappedWorkers);
    } catch (err) {
      console.error("Failed to fetch work status data:", err);
      setError("Failed to load work status data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const returned = workers.filter((w) => w.status === "returned").length;
    const pending = workers.filter((w) => w.status === "pending").length;
    const issue = workers.filter((w) => w.status === "issue").length;
    return { total: workers.length, returned, pending, issue };
  }, [workers]);

  const markReturned = async (workerId: string | number) => {
    try {
      await api.updateAssignment(workerId as string, { return_status: "returned" });
      // Remove from work status — worker goes back to Jobs page
      setWorkers((current) => current.filter((w) => w.id !== workerId));
    } catch (err) {
      console.error("Failed to mark returned:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const openIssueDialog = (worker: WorkerCard) => {
    setIssueWorker(worker);
    setIssueReason("");
  };

  const confirmIssue = async () => {
    if (!issueWorker) return;
    const reason = issueReason.trim();

    try {
      await api.updateAssignment(issueWorker.id as string, {
        return_status: "issue",
        issue_reason: reason || undefined,
      });

      setWorkers((current) =>
        current.map((worker) =>
          worker.id === issueWorker.id ? { ...worker, status: "issue" } : worker
        )
      );
      setIssueWorker(null);
      setIssueReason("");
    } catch (err) {
      console.error("Failed to record issue:", err);
      alert("Failed to record issue. Please try again.");
    }
  };

  return (
    <PageShell>
      <PageContainer>
        <PageHeader
          label="P2 Work Status"
          title="Work Status"
          subtitle="return check · issue handling"
          action={
            <button
              type="button"
              className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-primary-light)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[#dff2f4]"
              onClick={() => window.history.back()}
            >
              ↩ Jobs
            </button>
          }
        />

        <StatsGrid>
          <StatCard value={stats.total} label="Total" cardClassName="bg-[var(--color-primary-light)]" valueClassName="text-[var(--foreground)]" />
          <StatCard value={stats.returned} label="Returned" cardClassName="bg-[#ecfdf5]" valueClassName="text-[var(--color-success)]" />
          <StatCard value={stats.pending} label="Pending" cardClassName="bg-[#fff7ed]" valueClassName="text-[#c2410c]" />
          <StatCard value={stats.issue} label="Issue" cardClassName="bg-[#fef2f2]" valueClassName="text-[var(--color-error)]" />
        </StatsGrid>

        {loading && (
          <div className="py-8 text-center text-slate-500">
            <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
            <p className="text-sm">Loading work status...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={fetchData} className="mt-2 text-xs underline">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <section>
            <SectionLabel title="Worker Return Cards" />
            <div className="space-y-3">
              {workers.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 py-8 text-center text-slate-500">
                  <p className="text-sm">No active assignments. Go to Jobs to assign workers.</p>
                </div>
              ) : (
                workers.map((worker) => (
                  <WorkerStatusCard
                    key={worker.id}
                    worker={worker}
                    onMarkReturned={markReturned}
                    onOpenIssue={openIssueDialog}
                  />
                ))
              )}
            </div>
          </section>
        )}
      </PageContainer>

      <IssueDialog
        worker={issueWorker}
        issueReason={issueReason}
        onReasonChange={setIssueReason}
        onCancel={() => setIssueWorker(null)}
        onConfirm={confirmIssue}
      />
    </PageShell>
  );
}
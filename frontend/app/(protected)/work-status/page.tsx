"use client";

import { useMemo, useState } from "react";
import IssueDialog from "./components/IssueDialog";
import WorkerStatusCard from "./components/WorkerStatusCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import { StatCard, StatsGrid } from "../components/StatsGrid";
import type { WorkerCard } from "./components/types";

const WORKERS: WorkerCard[] = [
  {
    id: 1,
    name: "Ahmad Raza",
    initials: "AR",
    avatar: "linear-gradient(135deg, #f59e0b, #d97706)",
    vehicleNumber: "KL-2341",
    vehicleType: "Pickup",
    route: "Route A",
    runs: 3,
    wage: 75,
    status: "returned",
  },
  {
    id: 2,
    name: "Siti Nora",
    initials: "SN",
    avatar: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    vehicleNumber: "KL-3301",
    vehicleType: "Truck",
    route: "Route B",
    runs: 2,
    wage: 85,
    status: "pending",
  },
  {
    id: 3,
    name: "Muthu Kumar",
    initials: "MK",
    avatar: "linear-gradient(135deg, #f97316, #ef4444)",
    vehicleNumber: "KL-5590",
    vehicleType: "Minivan",
    route: "Route C",
    runs: 4,
    wage: 45,
    status: "issue",
  },
  {
    id: 4,
    name: "Ravi Shankar",
    initials: "RS",
    avatar: "linear-gradient(135deg, #22c55e, #0ea5e9)",
    vehicleNumber: "KL-1142",
    vehicleType: "Truck",
    route: "Route A",
    runs: 5,
    wage: 85,
    status: "returned",
  },
  {
    id: 5,
    name: "Lee Chong",
    initials: "LC",
    avatar: "linear-gradient(135deg, #f0a500, #22c55e)",
    vehicleNumber: "KL-7730",
    vehicleType: "Pickup",
    route: "Route D",
    runs: 4,
    wage: 75,
    status: "returned",
  },
];

export default function WorkStatusPage() {
  const [workers, setWorkers] = useState<WorkerCard[]>(WORKERS);
  const [issueWorker, setIssueWorker] = useState<WorkerCard | null>(null);
  const [issueReason, setIssueReason] = useState("");

  const stats = useMemo(() => {
    const returned = workers.filter((worker) => worker.status === "returned").length;
    const pending = workers.filter((worker) => worker.status === "pending").length;
    const issue = workers.filter((worker) => worker.status === "issue").length;
    return { total: workers.length, returned, pending, issue };
  }, [workers]);

  const markReturned = (workerId: number) => {
    setWorkers((current) =>
      current.map((worker) => (worker.id === workerId ? { ...worker, status: "returned" } : worker))
    );
  };

  const openIssueDialog = (worker: WorkerCard) => {
    setIssueWorker(worker);
    setIssueReason("");
  };

  const confirmIssue = () => {
    if (!issueWorker) return;
    const reason = issueReason.trim();
    setWorkers((current) =>
      current.map((worker) =>
        worker.id === issueWorker.id ? { ...worker, status: "issue" } : worker
      )
    );
    setIssueWorker(null);
    setIssueReason("");
    console.log(`Issue recorded for ${issueWorker.name}${reason ? `: ${reason}` : ""}`);
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
          <StatCard
            value={stats.total}
            label="Total"
            cardClassName="bg-[var(--color-primary-light)]"
            valueClassName="text-[var(--foreground)]"
          />
          <StatCard
            value={stats.returned}
            label="Returned"
            cardClassName="bg-[#ecfdf5]"
            valueClassName="text-[var(--color-success)]"
          />
          <StatCard
            value={stats.pending}
            label="Pending"
            cardClassName="bg-[#fff7ed]"
            valueClassName="text-[#c2410c]"
          />
          <StatCard
            value={stats.issue}
            label="Issue"
            cardClassName="bg-[#fef2f2]"
            valueClassName="text-[var(--color-error)]"
          />
        </StatsGrid>

        <section>
          <SectionLabel title="Worker Return Cards" />

          <div className="space-y-3">
            {workers.map((worker) => (
              <WorkerStatusCard
                key={worker.id}
                worker={worker}
                onMarkReturned={markReturned}
                onOpenIssue={openIssueDialog}
              />
            ))}
          </div>
        </section>
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
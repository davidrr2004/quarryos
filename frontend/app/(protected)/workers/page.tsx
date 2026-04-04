"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteWorkerDialog from "./components/DeleteWorkerDialog";
import WorkerCard from "./components/WorkerCard";
import WorkerFormDialog from "./components/WorkerFormDialog";
import FinanceShortcutCard from "../components/FinanceShortcutCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";
import SectionLabel from "../components/SectionLabel";
import { StatCard, StatsGrid } from "../components/StatsGrid";
import type { Worker, WorkerFormValues } from "./components/types";

const PALETTES = [
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#ec4899,#f97316)",
  "linear-gradient(135deg,#14b8a6,#22c55e)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
];

const INITIAL_WORKERS: Worker[] = [
  {
    id: 1,
    name: "Ahmad Raza",
    initials: "AR",
    avatar: "linear-gradient(135deg,#f59e0b,#d97706)",
    eid: "EMP-001",
    phone: "+60 12-334 9090",
    assigned: { vtype: "Pickup", vnum: "KL-2341" },
  },
  {
    id: 2,
    name: "Siti Nora",
    initials: "SN",
    avatar: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    eid: "EMP-002",
    phone: "+60 19-774 2291",
    assigned: { vtype: "Truck", vnum: "KL-3301" },
  },
  {
    id: 3,
    name: "Muthu Kumar",
    initials: "MK",
    avatar: "linear-gradient(135deg,#f97316,#ef4444)",
    eid: "EMP-003",
    phone: "+60 16-800 4511",
    assigned: null,
  },
  {
    id: 4,
    name: "Ravi Shankar",
    initials: "RS",
    avatar: "linear-gradient(135deg,#22c55e,#0ea5e9)",
    eid: "EMP-004",
    phone: "+60 11-220 9930",
    assigned: { vtype: "Truck", vnum: "KL-1142" },
  },
];

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

export default function WorkersPage() {
  const router = useRouter();

  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingWorkerId, setEditingWorkerId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<WorkerFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null);

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
    setEditingWorkerId(worker.id);
    setFormValues({
      name: worker.name,
      eid: worker.eid,
      phone: worker.phone,
    });
    setFormOpen(true);
  };

  const saveWorker = () => {
    const name = formValues.name.trim();
    const eid = formValues.eid.trim();
    const phone = formValues.phone.trim();

    if (!name) {
      return;
    }

    if (formMode === "edit" && editingWorkerId !== null) {
      setWorkers((current) =>
        current.map((worker) =>
          worker.id === editingWorkerId
            ? {
                ...worker,
                name,
                eid: eid || worker.eid,
                phone: phone || worker.phone,
                initials: initialsFromName(name),
              }
            : worker
        )
      );
    } else {
      setWorkers((current) => {
        const id = Date.now();
        const nextIndex = current.length;
        return [
          ...current,
          {
            id,
            name,
            initials: initialsFromName(name),
            avatar: PALETTES[nextIndex % PALETTES.length],
            eid: eid || `EMP-${String(nextIndex + 1).padStart(3, "0")}`,
            phone: phone || "-",
            assigned: null,
          },
        ];
      });
    }

    setFormOpen(false);
    setEditingWorkerId(null);
    setFormValues(EMPTY_FORM);
  };

  const deleteWorker = () => {
    if (!deleteTarget) return;
    setWorkers((current) => current.filter((worker) => worker.id !== deleteTarget.id));
    setDeleteTarget(null);
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

        <section className="space-y-3">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onFinance={(workerId) => router.push(`/finance?worker=${workerId}`)}
              onEdit={openEditWorker}
              onDelete={setDeleteTarget}
            />
          ))}
        </section>

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
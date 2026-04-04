import type { Worker } from "./types";

type WorkerCardProps = {
  worker: Worker;
  onFinance: (workerId: number) => void;
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
};

export default function WorkerCard({ worker, onFinance, onEdit, onDelete }: WorkerCardProps) {
  return (
    <article
      className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-4 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-selector)] text-sm font-black text-white"
            style={{ background: worker.avatar }}
          >
            {worker.initials}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">{worker.name}</h2>
            <p className="mt-1 text-[0.72rem] font-medium text-[var(--color-muted)]">
              {worker.eid} · {worker.phone}
            </p>
            <p className="mt-1 text-[0.72rem] font-medium">
              {worker.assigned ? (
                <span className="text-[var(--color-success)]">
                  ● {worker.assigned.vtype} · {worker.assigned.vnum}
                </span>
              ) : (
                <span className="text-[var(--color-dimmed)]">○ Not assigned</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onFinance(worker.id)}
            className="rounded-[var(--radius-selector)] bg-[var(--color-primary-light)] px-3 py-2 text-xs font-bold text-[var(--color-primary)]"
            title="Finance"
          >
            $ 
          </button>
          <button
            type="button"
            onClick={() => onEdit(worker)}
            className="rounded-[var(--radius-selector)] border border-[var(--color-border-soft)] px-3 py-2 text-xs font-bold text-[var(--color-primary)]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(worker)}
            className="rounded-[var(--radius-selector)] bg-[var(--color-error)] px-3 py-2 text-xs font-bold text-white"
          >
            Del
          </button>
        </div>
      </div>
    </article>
  );
}

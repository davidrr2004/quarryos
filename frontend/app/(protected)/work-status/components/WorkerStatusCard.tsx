import StatusBadge from "./StatusBadge";
import type { WorkerCard } from "./types";

type WorkerStatusCardProps = {
  worker: WorkerCard;
  onMarkReturned: (workerId: number) => void;
  onOpenIssue: (worker: WorkerCard) => void;
};

export default function WorkerStatusCard({
  worker,
  onMarkReturned,
  onOpenIssue,
}: WorkerStatusCardProps) {
  return (
    <article className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-selector)] text-sm font-black text-white"
          style={{ background: worker.avatar }}
        >
          {worker.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">{worker.name}</h2>
              <p className="mt-1 text-[0.72rem] font-medium text-[var(--color-muted)]">
                {worker.vehicleNumber} · {worker.vehicleType} · {worker.route}
              </p>
            </div>

            <StatusBadge status={worker.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-dimmed)]">Vehicle</div>
              <div className="mt-1 font-semibold text-slate-900">{worker.vehicleNumber}</div>
            </div>
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-dimmed)]">Route</div>
              <div className="mt-1 font-semibold text-slate-900">{worker.route}</div>
            </div>
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-dimmed)]">Runs</div>
              <div className="mt-1 font-semibold text-slate-900">{worker.status === "pending" ? "—" : worker.runs}</div>
            </div>
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-dimmed)]">Earning</div>
              <div className="mt-1 font-semibold text-slate-900">
                {worker.status === "pending" ? "TBD" : <span className="text-[var(--color-primary)]">RM {worker.runs * worker.wage}</span>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {worker.status === "returned" && (
              <>
                <button
                  type="button"
                  onClick={() => onMarkReturned(worker.id)}
                  className="flex-1 rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  ✓ Done
                </button>
                <button
                  type="button"
                  onClick={() => onOpenIssue(worker)}
                  className="rounded-[var(--radius-field)] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[var(--color-error)] transition-colors hover:bg-[#fee2e2]"
                >
                  ⚠ Issue
                </button>
              </>
            )}

            {worker.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onMarkReturned(worker.id)}
                  className="flex-1 rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  ✅ Mark Returned
                </button>
                <button
                  type="button"
                  onClick={() => onOpenIssue(worker)}
                  className="rounded-[var(--radius-field)] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[var(--color-error)] transition-colors hover:bg-[#fee2e2]"
                >
                  ⚠ Issue
                </button>
              </>
            )}

            {worker.status === "issue" && (
              <>
                <button
                  type="button"
                  onClick={() => onMarkReturned(worker.id)}
                  className="flex-1 rounded-[var(--radius-field)] bg-[var(--color-primary-light)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[#dff2f4]"
                >
                  ↩ Reassign (P1)
                </button>
                <button
                  type="button"
                  onClick={() => onMarkReturned(worker.id)}
                  className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-muted)] transition-colors hover:bg-slate-50"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

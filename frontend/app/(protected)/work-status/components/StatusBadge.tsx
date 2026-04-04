import type { CSSProperties } from "react";
import type { WorkerStatus } from "./types";

export default function StatusBadge({ status }: { status: WorkerStatus }) {
  const labels: Record<WorkerStatus, string> = {
    returned: "✅ Returned",
    pending: "⏳ Pending",
    issue: "⚠ Issue",
  };

  const colors: Record<WorkerStatus, CSSProperties> = {
    returned: { background: "var(--color-primary-light)", color: "var(--color-primary)" },
    pending: { background: "#fff7ed", color: "#c2410c" },
    issue: { background: "#fef2f2", color: "var(--color-error)" },
  };

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em]"
      style={colors[status]}
    >
      {labels[status]}
    </span>
  );
}

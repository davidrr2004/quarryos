import DialogShell from "../../components/DialogShell";

type SubmitLockDialogProps = {
  open: boolean;
  assignedCount: number;
  totalWorkers: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SubmitLockDialog({
  open,
  assignedCount,
  totalWorkers,
  onCancel,
  onConfirm,
}: SubmitLockDialogProps) {
  return (
    <DialogShell
      open={open}
      onClose={onCancel}
      panelClassName="max-w-[420px] rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <h3
        style={{
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: 800,
          color: "var(--foreground)",
        }}
      >
        Confirm assignment lock
      </h3>
      <p
        style={{
          marginTop: "0.6rem",
          marginBottom: "1rem",
          fontSize: "0.86rem",
          color: "var(--color-muted)",
          lineHeight: 1.5,
        }}
      >
        You are about to lock assignments for {assignedCount} worker{assignedCount === 1 ? "" : "s"}. This action marks the current dispatch plan as finalized.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          background: "var(--color-primary-light)",
          borderRadius: "var(--radius-field)",
          padding: "0.75rem 0.9rem",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>Assigned workers</span>
        <strong style={{ fontSize: "0.9rem", color: "var(--foreground)" }}>
          {assignedCount} / {totalWorkers}
        </strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "0.8rem",
            borderRadius: "var(--radius-field)",
            border: "1px solid var(--color-border-soft)",
            background: "#ffffff",
            color: "var(--color-muted)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "0.8rem",
            borderRadius: "var(--radius-field)",
            border: "none",
            background: "var(--color-primary)",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Confirm
        </button>
      </div>
    </DialogShell>
  );
}

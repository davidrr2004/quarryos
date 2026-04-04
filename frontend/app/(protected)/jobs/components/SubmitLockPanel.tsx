type SubmitLockPanelProps = {
  submitted: boolean;
  assignedCount: number;
  onRequestSubmit: () => void;
};

export default function SubmitLockPanel({ submitted, assignedCount, onRequestSubmit }: SubmitLockPanelProps) {
  return (
    <section className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
      {submitted ? (
        <div
          style={{
            width: "100%",
            padding: "1rem",
            background: "var(--color-success)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.875rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: "var(--radius-field)",
            textAlign: "center",
          }}
        >
          ✓ Assignments Locked
        </div>
      ) : (
        <button
          onClick={onRequestSubmit}
          disabled={assignedCount === 0}
          style={{
            width: "100%",
            padding: "1rem",
            background: "linear-gradient(135deg, var(--color-error), var(--color-error-deep))",
            color: "#ffffff",
            fontSize: "0.875rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "var(--radius-field)",
            cursor: assignedCount === 0 ? "not-allowed" : "pointer",
            opacity: assignedCount === 0 ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "var(--shadow-soft)",
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: assignedCount > 0 ? "var(--color-danger-dot)" : "var(--color-disabled)",
              display: "inline-block",
              boxShadow: "none",
            }}
          />
          Submit / Lock Assignments
        </button>
      )}
    </section>
  );
}

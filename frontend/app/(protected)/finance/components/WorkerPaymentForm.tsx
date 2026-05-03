"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../../components/SectionLabel";
import { api, ApiResponse } from "../../../lib/api";

interface BackendWorker {
  id: string;
  name: string;
  employee_id: string;
}

export default function WorkerPaymentForm({ onPaymentCreated }: { onPaymentCreated?: () => void }) {
  const [workers, setWorkers] = useState<BackendWorker[]>([]);
  const [workerId, setWorkerId] = useState("");
  const [amount, setAmount] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const res = await api.listWorkers({ active_only: true }) as ApiResponse<BackendWorker[]>;
        setWorkers(res.data || []);
        if (res.data?.length) setWorkerId(res.data[0].id);
      } catch {
        console.error("Failed to fetch workers for payment form");
      }
    }
    fetchWorkers();
  }, []);

  const totalAmount = parseFloat(amount) || 0;
  const advance = parseFloat(advancePayment) || 0;
  const remaining = totalAmount - advance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!workerId) { setError("Select a worker."); return; }
    if (totalAmount <= 0) { setError("Enter a valid total amount."); return; }
    if (advance < 0) { setError("Advance payment cannot be negative."); return; }
    if (advance > totalAmount) { setError("Advance cannot exceed total amount."); return; }

    try {
      setLoading(true);
      await api.createPayment({
        worker_id: workerId,
        amount: totalAmount,
        advance_payment: advance || 0,
        notes: notes.trim() || undefined,
      });
      setSuccess(true);
      setAmount("");
      setAdvancePayment("");
      setNotes("");
      onPaymentCreated?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  const FIELD_LABEL = "block text-[0.62rem] font-bold uppercase tracking-wider text-[var(--color-dimmed)] mb-1";
  const INPUT = "w-full rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary)] transition-colors";

  return (
    <section className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <SectionLabel title="Record Worker Payment" />

      <form onSubmit={handleSubmit} className="space-y-3 mt-2">
        {/* Worker selector */}
        <div>
          <label className={FIELD_LABEL}>Worker</label>
          <select
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            className={INPUT}
          >
            {workers.length === 0 && <option value="">Loading workers...</option>}
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Total amount */}
          <div>
            <label className={FIELD_LABEL}>Total Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={INPUT}
            />
          </div>

          {/* Advance payment */}
          <div>
            <label className={FIELD_LABEL}>Advance Paid (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1000"
              value={advancePayment}
              onChange={(e) => setAdvancePayment(e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        {/* Remaining amount display */}
        {totalAmount > 0 && (
          <div className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--color-dimmed)]">Remaining Amount</p>
              <p className="text-xs text-[var(--color-muted)]">
                {advance > 0
                  ? `₹${totalAmount.toLocaleString("en-IN")} total − ₹${advance.toLocaleString("en-IN")} advance`
                  : "No advance — full amount pending"}
              </p>
            </div>
            <span
              className="text-xl font-black"
              style={{ color: remaining <= 0 ? "var(--color-success)" : remaining < totalAmount ? "#f97316" : "var(--foreground)" }}
            >
              ₹{Math.max(0, remaining).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Payment type indicator */}
        {totalAmount > 0 && (
          <div className="flex gap-2 text-[0.7rem] font-semibold">
            {advance <= 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">🕐 Pending — no payment made</span>
            )}
            {advance > 0 && remaining > 0 && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">⚡ Advance — ₹{remaining.toLocaleString("en-IN")} remaining</span>
            )}
            {advance > 0 && remaining <= 0 && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">✓ Fully Paid</span>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className={FIELD_LABEL}>Notes (optional)</label>
          <input
            type="text"
            placeholder="e.g. Weekly wage payment"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={INPUT}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm font-semibold text-red-600">⚠ {error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-sm font-semibold text-emerald-600">✓ Payment recorded successfully!</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || workers.length === 0}
          className="w-full rounded-[var(--radius-field)] py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Recording..." : "Record Payment"}
        </button>
      </form>
    </section>
  );
}

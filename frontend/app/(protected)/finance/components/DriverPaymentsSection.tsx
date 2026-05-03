"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../../components/SectionLabel";
import { api, ApiResponse } from "../../../lib/api";

type PaymentStatus = "pending" | "advance" | "paid";

interface DriverPayment {
  id: string;
  workerName: string;
  employeeId: string;
  amount: number;
  advancePayment: number;
  remainingAmount: number;
  status: PaymentStatus;
  notes: string;
  paidAt: string;
}

interface BackendPayment {
  id: string;
  worker: { name: string; employee_id: string } | null;
  amount: string;
  advance_payment: string;
  remaining_amount: string;
  status: PaymentStatus;
  notes: string | null;
  paid_at: string;
}

const STATUS_STYLES: Record<PaymentStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800" },
  advance: { label: "Advance", cls: "bg-orange-100 text-orange-800" },
  paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-800" },
};

function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function DriverPaymentsSection() {
  const [payments, setPayments] = useState<DriverPayment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayments() {
    try {
      setLoading(true);
      const res = await api.listPayments() as ApiResponse<BackendPayment[]>;
      const data = res.data || [];

      const mapped: DriverPayment[] = data.map((p) => ({
        id: p.id,
        workerName: p.worker?.name || "Unknown Worker",
        employeeId: p.worker?.employee_id || "—",
        amount: parseFloat(p.amount || "0"),
        advancePayment: parseFloat(p.advance_payment || "0"),
        remainingAmount: parseFloat(p.remaining_amount || "0"),
        status: p.status || "pending",
        notes: p.notes || "—",
        paidAt: new Date(p.paid_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      }));

      setPayments(mapped);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPayments(); }, []);

  const updateStatus = async (id: string, status: PaymentStatus) => {
    try {
      await api.updatePayment(id, { status });
      setPayments((prev) =>
        prev.map((p) => p.id === id ? { ...p, status } : p)
      );
    } catch (err) {
      console.error("Failed to update payment status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="space-y-3">
        <SectionLabel title="Driver Payments" />
        <div className="py-6 text-center text-slate-500">
          <div className="mb-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
          <p className="text-sm">Loading payments...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionLabel title="Driver Payments" />

      {payments.length === 0 ? (
        <div className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white p-6 text-center text-slate-500">
          <p className="text-sm">No payment records yet. Use the form above to record payments.</p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700 sm:text-sm">
              <thead className="bg-slate-50 text-[0.62rem] font-bold uppercase tracking-widest text-slate-500 border-b border-[var(--color-border-soft)]">
                <tr>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Advance</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const style = STATUS_STYLES[p.status];
                  return (
                    <tr key={p.id} className="border-t border-[var(--color-border-soft)] hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{p.workerName}</p>
                        <p className="text-[0.65rem] text-slate-500">{p.employeeId}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.advancePayment > 0 ? formatCurrency(p.advancePayment) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${p.remainingAmount > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                          {p.remainingAmount > 0 ? formatCurrency(p.remainingAmount) : "Nil"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${style.cls}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.paidAt}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate">{p.notes}</td>
                      <td className="px-4 py-3">
                        <select
                          value={p.status}
                          onChange={(e) => updateStatus(p.id, e.target.value as PaymentStatus)}
                          className="rounded-[var(--radius-field)] border border-[var(--color-border-soft)] bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-[var(--color-primary)]"
                        >
                          <option value="pending">Pending</option>
                          <option value="advance">Advance</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

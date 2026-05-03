"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../../components/SectionLabel";
import { StatCard, StatsGrid } from "../../components/StatsGrid";
import { api, ApiResponse } from "../../../lib/api";

interface BackendCost {
  id: string;
  cost_type: string;
  amount: string;
  note: string | null;
  recorded_at: string;
  vehicle: { plate_number: string } | null;
}

type ExpenseCategory = {
  label: string;
  value: string;
  cardClassName: string;
  valueClassName: string;
};

type ExpenseEntry = {
  date: string;
  type: string;
  amount: string;
  notes: string;
};

function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function ExpenseTrackingSection() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { label: "Fuel Expenses", value: "₹0", cardClassName: "bg-[#ecfeff]", valueClassName: "text-cyan-700" },
    { label: "Driver Payments", value: "₹0", cardClassName: "bg-[#ecfdf5]", valueClassName: "text-emerald-700" },
    { label: "Maintenance", value: "₹0", cardClassName: "bg-[#fff7ed]", valueClassName: "text-orange-700" },
    { label: "Other Expenses", value: "₹0", cardClassName: "bg-[#fef2f2]", valueClassName: "text-rose-700" },
  ]);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch costs
        const costsRes = await api.listCosts() as ApiResponse<BackendCost[]>;
        const costs = costsRes.data || [];

        // Group by cost type
        const fuel = costs.filter(c => c.cost_type === "fuel").reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0);
        const maintenance = costs.filter(c => c.cost_type === "maintenance").reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0);
        const other = costs.filter(c => !["fuel", "maintenance"].includes(c.cost_type)).reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0);

        // Fetch payments for driver payments
        const paymentsRes = await api.listPayments() as ApiResponse<{ amount: string }[]>;
        const payments = paymentsRes.data || [];
        const driverPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);

        setCategories([
          { label: "Fuel Expenses", value: formatCurrency(fuel), cardClassName: "bg-[#ecfeff]", valueClassName: "text-cyan-700" },
          { label: "Driver Payments", value: formatCurrency(driverPayments), cardClassName: "bg-[#ecfdf5]", valueClassName: "text-emerald-700" },
          { label: "Maintenance", value: formatCurrency(maintenance), cardClassName: "bg-[#fff7ed]", valueClassName: "text-orange-700" },
          { label: "Other Expenses", value: formatCurrency(other), cardClassName: "bg-[#fef2f2]", valueClassName: "text-rose-700" },
        ]);

        // Map entries
        const mappedEntries: ExpenseEntry[] = costs.map((c) => ({
          date: formatDate(c.recorded_at),
          type: c.cost_type.charAt(0).toUpperCase() + c.cost_type.slice(1),
          amount: formatCurrency(parseFloat(c.amount || "0")),
          notes: c.note || c.vehicle?.plate_number || "—",
        }));

        setEntries(mappedEntries.slice(0, 10)); // Show last 10 entries
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="space-y-3">
      <SectionLabel title="Expense Tracking" />

      <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-4">
        {categories.map((category) => (
          <StatCard
            key={category.label}
            value={loading ? "—" : category.value}
            label={category.label}
            cardClassName={category.cardClassName}
            valueClassName={category.valueClassName}
          />
        ))}
      </StatsGrid>

      <div className="overflow-hidden rounded-(--radius-box) border border-(--color-border-soft) bg-white shadow-(--shadow-soft)">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-(--color-primary-light) text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={`${entry.date}-${entry.type}-${index}`} className="border-t border-(--color-border-soft)">
                    <td className="px-4 py-3 text-xs font-semibold text-slate-600">{entry.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{entry.type}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{entry.amount}</td>
                    <td className="px-4 py-3 text-sm text-(--color-muted)">{entry.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

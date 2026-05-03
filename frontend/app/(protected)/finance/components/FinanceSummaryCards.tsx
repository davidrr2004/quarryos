"use client";

import { useEffect, useState } from "react";
import { StatCard, StatsGrid } from "../../components/StatsGrid";
import { api, ApiResponse } from "../../../lib/api";

interface BackendAssignment {
  total_earned: string;
}

interface BackendCost {
  amount: string;
}

interface BackendPayment {
  amount: string;
  remaining_amount: string;
  status: "pending" | "advance" | "paid";
}

type FinanceMetric = {
  label: string;
  value: string;
  cardClassName: string;
  valueClassName: string;
};

function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function FinanceSummaryCards() {
  const [metrics, setMetrics] = useState<FinanceMetric[]>([
    { label: "Revenue", value: "₹0", cardClassName: "bg-[#ecfeff]", valueClassName: "text-cyan-700" },
    { label: "Expenses", value: "₹0", cardClassName: "bg-[#fff7ed]", valueClassName: "text-orange-700" },
    { label: "Profit", value: "₹0", cardClassName: "bg-[#ecfdf5]", valueClassName: "text-emerald-700" },
    { label: "Pending", value: "₹0", cardClassName: "bg-[#fef2f2]", valueClassName: "text-rose-700" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch assignments for revenue
        const assignmentsRes = await api.listAssignments() as ApiResponse<BackendAssignment[]>;
        const assignments = assignmentsRes.data || [];
        const revenue = assignments.reduce((sum, a) => sum + parseFloat(a.total_earned || "0"), 0);

        // Fetch costs for expenses
        const costsRes = await api.listCosts() as ApiResponse<BackendCost[]>;
        const costs = costsRes.data || [];
        const expenses = costs.reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0);

        // Fetch payments for pending amount
        const paymentsRes = await api.listPayments() as ApiResponse<BackendPayment[]>;
        const payments = paymentsRes.data || [];
        // Pending = sum of remaining_amount on non-fully-paid records
        const pending = payments
          .filter((p) => p.status === "pending" || p.status === "advance")
          .reduce((sum, p) => sum + parseFloat(p.remaining_amount || "0"), 0);

        const profit = revenue - expenses;

        setMetrics([
          { label: "Revenue", value: formatCurrency(revenue), cardClassName: "bg-[#ecfeff]", valueClassName: "text-cyan-700" },
          { label: "Expenses", value: formatCurrency(expenses), cardClassName: "bg-[#fff7ed]", valueClassName: "text-orange-700" },
          { label: "Profit", value: formatCurrency(profit), cardClassName: "bg-[#ecfdf5]", valueClassName: "text-emerald-700" },
          { label: "Pending", value: formatCurrency(pending), cardClassName: "bg-[#fef2f2]", valueClassName: "text-rose-700" },
        ]);
      } catch (err) {
        console.error("Failed to fetch finance metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            value="—"
            label={metric.label}
            cardClassName={metric.cardClassName}
            valueClassName={metric.valueClassName}
          />
        ))}
      </StatsGrid>
    );
  }

  return (
    <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          value={metric.value}
          label={metric.label}
          cardClassName={metric.cardClassName}
          valueClassName={metric.valueClassName}
        />
      ))}
    </StatsGrid>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionLabel from "../../components/SectionLabel";
import { api, ApiResponse } from "../../../lib/api";

type ChartMode = "trips" | "drivers" | "expenses";

interface BackendAssignment {
  worker: { name: string } | null;
  runs_completed: number;
  total_earned: string;
  assigned_at: string;
}

interface BackendCost {
  cost_type: string;
  amount: string;
}

const PIE_COLORS = ["#0ea5e9", "#f97316", "#10b981", "#6366f1"];

export default function VisualChartsSection() {
  const [mode, setMode] = useState<ChartMode>("trips");
  const [tripsData, setTripsData] = useState<{ day: string; trips: number }[]>([]);
  const [driverData, setDriverData] = useState<{ name: string; trips: number; earnings: number }[]>([]);
  const [expenseData, setExpenseData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch assignments for trips and driver data
        const assignmentsRes = await api.listAssignments() as ApiResponse<BackendAssignment[]>;
        const assignments = assignmentsRes.data || [];

        // Group trips by day of week
        const dayMap = new Map<string, number>();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(d => dayMap.set(d, 0));
        
        assignments.forEach((a) => {
          const date = new Date(a.assigned_at);
          const day = days[date.getDay()];
          dayMap.set(day, (dayMap.get(day) || 0) + a.runs_completed);
        });

        const tripsOverTime = days.map(day => ({ day, trips: dayMap.get(day) || 0 }));
        setTripsData(tripsOverTime);

        // Group by driver
        const driverMap = new Map<string, { trips: number; earnings: number }>();
        assignments.forEach((a) => {
          const name = a.worker?.name || "Unknown";
          const existing = driverMap.get(name) || { trips: 0, earnings: 0 };
          existing.trips += a.runs_completed;
          existing.earnings += parseFloat(a.total_earned || "0");
          driverMap.set(name, existing);
        });

        const driverComparison = Array.from(driverMap.entries())
          .map(([name, data]) => ({ name, trips: data.trips, earnings: data.earnings }))
          .slice(0, 5);
        setDriverData(driverComparison);

        // Fetch costs for expense split
        const costsRes = await api.listCosts() as ApiResponse<BackendCost[]>;
        const costs = costsRes.data || [];

        const expenseMap = new Map<string, number>();
        costs.forEach((c) => {
          const type = c.cost_type.charAt(0).toUpperCase() + c.cost_type.slice(1);
          expenseMap.set(type, (expenseMap.get(type) || 0) + parseFloat(c.amount || "0"));
        });

        const totalExpenses = Array.from(expenseMap.values()).reduce((a, b) => a + b, 0);
        const expenseSplit = totalExpenses > 0 
          ? Array.from(expenseMap.entries()).map(([name, amount]) => ({ 
              name, 
              value: Math.round((amount / totalExpenses) * 100) 
            }))
          : [
              { name: "Fuel", value: 35 },
              { name: "Maintenance", value: 25 },
              { name: "Driver", value: 25 },
              { name: "Other", value: 15 },
            ];
        setExpenseData(expenseSplit);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const subtitle = useMemo(() => {
    if (mode === "trips") return "Line chart: trips completed over time";
    if (mode === "drivers") return "Bar chart: driver performance comparison";
    return "Pie chart: expense distribution";
  }, [mode]);

  return (
    <section className="rounded-(--radius-box) border border-(--color-border-soft) bg-white p-4 shadow-(--shadow-soft)">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel title="Visual Charts" />
          <p className="text-xs text-(--color-muted)">{subtitle}</p>
        </div>

        <label className="space-y-1">
          <span className="text-[0.62rem] font-bold uppercase tracking-widest text-(--color-dimmed)">Chart Type</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as ChartMode)}
            className="w-full rounded-(--radius-field) border border-(--color-border-soft) bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:min-w-55"
          >
            <option value="trips">Line: Trips Over Time</option>
            <option value="drivers">Bar: Driver Comparison</option>
            <option value="expenses">Pie: Expenses Split</option>
          </select>
        </label>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
            <span className="ml-2 text-sm">Loading chart data...</span>
          </div>
        ) : mode === "trips" ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={tripsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trips" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : mode === "drivers" ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={driverData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="trips" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="earnings" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie data={expenseData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                {expenseData.map((entry: { name: string }, index: number) => (
                  <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

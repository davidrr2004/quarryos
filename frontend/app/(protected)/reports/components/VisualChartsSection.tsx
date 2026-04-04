"use client";

import { useMemo, useState } from "react";
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

type ChartMode = "trips" | "drivers" | "expenses";

const TRIPS_OVER_TIME = [
  { day: "Mon", trips: 22 },
  { day: "Tue", trips: 27 },
  { day: "Wed", trips: 25 },
  { day: "Thu", trips: 30 },
  { day: "Fri", trips: 34 },
  { day: "Sat", trips: 29 },
  { day: "Sun", trips: 18 },
];

const DRIVER_COMPARISON = [
  { name: "Ahmad", trips: 18, earnings: 18600 },
  { name: "Siti", trips: 15, earnings: 15200 },
  { name: "Ravi", trips: 12, earnings: 12300 },
  { name: "Muthu", trips: 10, earnings: 9800 },
];

const EXPENSE_SPLIT = [
  { name: "Fuel", value: 48 },
  { name: "Maintenance", value: 22 },
  { name: "Driver", value: 20 },
  { name: "Other", value: 10 },
];

const PIE_COLORS = ["#0ea5e9", "#f97316", "#10b981", "#6366f1"];

export default function VisualChartsSection() {
  const [mode, setMode] = useState<ChartMode>("trips");

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
        {mode === "trips" ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={TRIPS_OVER_TIME} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <BarChart data={DRIVER_COMPARISON} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Pie data={EXPENSE_SPLIT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                {EXPENSE_SPLIT.map((entry, index) => (
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

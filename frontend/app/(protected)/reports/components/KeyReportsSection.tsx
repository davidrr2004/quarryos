"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../../components/SectionLabel";
import { api, ApiResponse } from "../../../lib/api";

type DriverPerformance = {
  name: string;
  trips: number;
  onTime: string;
  distance: string;
  earnings: string;
};

type VehicleUtilization = {
  vehicle: string;
  activePercent: number;
  idlePercent: number;
};

interface BackendAssignment {
  worker: { name: string } | null;
  runs_completed: number;
  total_earned: string;
  return_status: string;
  vehicle: { plate_number: string; status: string } | null;
}

const REPORT_CARD =
  "rounded-(--radius-box) border border-(--color-border-soft) bg-white p-4 shadow-(--shadow-soft)";

function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function KeyReportsSection() {
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [vehicleUtilization, setVehicleUtilization] = useState<VehicleUtilization[]>([]);
  const [deliveryStats, setDeliveryStats] = useState({ completed: 0, pending: 0, issues: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch assignments
        const assignmentsRes = await api.listAssignments() as ApiResponse<BackendAssignment[]>;
        const assignments = assignmentsRes.data || [];

        // Calculate driver performance
        const driverMap = new Map<string, { trips: number; earnings: number; onTimeCount: number }>();
        assignments.forEach((a) => {
          const name = a.worker?.name || "Unknown";
          const existing = driverMap.get(name) || { trips: 0, earnings: 0, onTimeCount: 0 };
          existing.trips += a.runs_completed;
          existing.earnings += parseFloat(a.total_earned || "0");
          if (a.return_status === "returned") existing.onTimeCount += 1;
          driverMap.set(name, existing);
        });

        const performance: DriverPerformance[] = Array.from(driverMap.entries()).map(([name, data]) => ({
          name,
          trips: data.trips,
          onTime: data.trips > 0 ? `${Math.round((data.onTimeCount / assignments.filter(a => a.worker?.name === name).length) * 100)}%` : "—",
          distance: `${Math.round(data.trips * 25)} km`, // Approx 25km per trip
          earnings: formatCurrency(data.earnings),
        }));
        setDriverPerformance(performance.slice(0, 5));

        // Calculate vehicle utilization
        const vehicleMap = new Map<string, { active: number; total: number }>();
        assignments.forEach((a) => {
          const plate = a.vehicle?.plate_number || "Unknown";
          const existing = vehicleMap.get(plate) || { active: 0, total: 0 };
          existing.total += 1;
          if (a.vehicle?.status === "working") existing.active += 1;
          vehicleMap.set(plate, existing);
        });

        const utilization: VehicleUtilization[] = Array.from(vehicleMap.entries()).map(([vehicle, data]) => ({
          vehicle,
          activePercent: data.total > 0 ? Math.round((data.active / data.total) * 100) : 0,
          idlePercent: data.total > 0 ? Math.round(((data.total - data.active) / data.total) * 100) : 100,
        }));
        setVehicleUtilization(utilization.slice(0, 5));

        // Calculate delivery stats
        const completed = assignments.filter(a => a.return_status === "returned").length;
        const pending = assignments.filter(a => a.return_status === "pending").length;
        const issues = assignments.filter(a => a.return_status === "issue").length;
        setDeliveryStats({ completed, pending, issues });
      } catch (err) {
        console.error("Failed to fetch reports data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="space-y-3">
        <SectionLabel title="Key Reports" />
        <div className="py-8 text-center text-slate-500">
          <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--color-primary)]" />
          <p className="text-sm">Loading reports...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionLabel title="Key Reports" />

      <div className="grid gap-3 xl:grid-cols-2">
        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">1. Driver Performance Report</h3>
          <p className="mt-1 text-xs text-(--color-muted)">Trips completed, on-time %, total distance, and earnings.</p>
          <div className="mt-3 overflow-x-auto">
            {driverPerformance.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">No driver data available.</p>
            ) : (
              <table className="min-w-full text-left text-xs text-slate-700 sm:text-sm">
                <thead className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="py-2">Driver</th>
                    <th className="py-2">Trips</th>
                    <th className="py-2">On-Time</th>
                    <th className="py-2">Distance</th>
                    <th className="py-2">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {driverPerformance.map((row) => (
                    <tr key={row.name} className="border-t border-(--color-border-soft)">
                      <td className="py-2 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-2">{row.trips}</td>
                      <td className="py-2">{row.onTime}</td>
                      <td className="py-2">{row.distance}</td>
                      <td className="py-2 font-bold text-indigo-700">{row.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>

        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">2. Vehicle Utilization</h3>
          <p className="mt-1 text-xs text-(--color-muted)">How much each vehicle is active vs idle.</p>
          <div className="mt-4 space-y-3">
            {vehicleUtilization.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">No vehicle data available.</p>
            ) : (
              vehicleUtilization.map((row) => (
                <div key={row.vehicle}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{row.vehicle}</span>
                    <span>{row.activePercent}% active / {row.idlePercent}% idle</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-(--color-primary)" style={{ width: `${row.activePercent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">3. Delivery Performance</h3>
          <p className="mt-1 text-xs text-(--color-muted)">Completed, pending, issues, and average delivery time.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-(--radius-field) bg-[#ecfdf5] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Completed</p>
              <p className="mt-1 text-lg font-black text-emerald-800">{deliveryStats.completed}</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#fff7ed] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Pending</p>
              <p className="mt-1 text-lg font-black text-orange-800">{deliveryStats.pending}</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#fef2f2] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700">Issues</p>
              <p className="mt-1 text-lg font-black text-rose-800">{deliveryStats.issues}</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#eef2ff] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Avg Time</p>
              <p className="mt-1 text-lg font-black text-indigo-800">N/A</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

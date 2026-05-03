"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../../components/SectionLabel";
import { api, ApiResponse } from "../../../lib/api";

interface BackendAssignment {
  id: string;
  batch: { route_from: string; route_to: string } | null;
  total_earned: string;
  vehicle_id: string;
}

interface BackendCost {
  vehicle_id: string;
  cost_type: string;
  amount: string;
}

type TripRevenueRow = {
  tripId: string;
  route: string;
  revenue: number;
  fuelCost: number;
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function TripRevenueSection() {
  const [trips, setTrips] = useState<TripRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch assignments for revenue data
        const assignmentsRes = await api.listAssignments() as ApiResponse<BackendAssignment[]>;
        const assignments = assignmentsRes.data || [];

        // Fetch fuel costs
        const costsRes = await api.listCosts() as ApiResponse<BackendCost[]>;
        const costs = costsRes.data || [];

        // Group fuel costs by vehicle
        const fuelCostsByVehicle = new Map<string, number>();
        costs.filter(c => c.cost_type === "fuel").forEach((c) => {
          fuelCostsByVehicle.set(c.vehicle_id, (fuelCostsByVehicle.get(c.vehicle_id) || 0) + parseFloat(c.amount || "0"));
        });

        // Map assignments to trip revenue rows
        const mappedTrips: TripRevenueRow[] = assignments.map((a, index) => ({
          tripId: `TRIP-${a.id.slice(0, 4).toUpperCase()}`,
          route: a.batch ? `${a.batch.route_from} → ${a.batch.route_to}` : "Unknown",
          revenue: parseFloat(a.total_earned || "0"),
          fuelCost: fuelCostsByVehicle.get(a.vehicle_id) || 0,
        }));

        setTrips(mappedTrips.slice(0, 10)); // Show last 10 trips
      } catch (err) {
        console.error("Failed to fetch trip revenue:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="space-y-3">
      <SectionLabel title="Trip-wise Revenue" />

      <div className="overflow-hidden rounded-(--radius-box) border border-(--color-border-soft) bg-white shadow-(--shadow-soft)">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm text-slate-700">
            <thead className="bg-(--color-primary-light) text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-600">
              <tr>
                <th className="px-2 py-3 sm:px-4">
                  <span className="sm:hidden">Trip</span>
                  <span className="hidden sm:inline">Trip ID</span>
                </th>
                <th className="px-2 py-3 sm:px-4">Route</th>
                <th className="px-2 py-3 sm:px-4">Revenue</th>
                <th className="px-2 py-3 sm:px-4">
                  <span className="sm:hidden">Fuel</span>
                  <span className="hidden sm:inline">Fuel Cost</span>
                </th>
                <th className="px-2 py-3 sm:px-4">Profit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Loading trip data...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No trip data available yet.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => {
                  const profit = trip.revenue - trip.fuelCost;
                  return (
                    <tr key={trip.tripId} className="border-t border-(--color-border-soft) transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-(--color-primary-light)">
                      <td className="px-2 py-3 text-[0.65rem] font-bold tracking-wide text-slate-600 sm:px-4 sm:text-xs sm:tracking-wider">
                        {trip.tripId}
                      </td>
                      <td className="px-2 py-3 sm:px-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-semibold text-slate-700 sm:text-xs">
                          {trip.route}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-xs font-bold text-cyan-700 sm:px-4 sm:text-sm">{formatCurrency(trip.revenue)}</td>
                      <td className="px-2 py-3 text-xs font-bold text-orange-700 sm:px-4 sm:text-sm">{formatCurrency(trip.fuelCost)}</td>
                      <td className="px-2 py-3 sm:px-4">
                        <span className="inline-flex rounded-(--radius-field) bg-[#ecfdf5] px-2 py-1 text-xs font-bold text-emerald-700 sm:text-sm">
                          {formatCurrency(profit)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

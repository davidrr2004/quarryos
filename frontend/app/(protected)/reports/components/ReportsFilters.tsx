"use client";

import { useState } from "react";
import SectionLabel from "../../components/SectionLabel";

type DriverFilter = "all" | "ahmad" | "siti" | "ravi" | "muthu";
type VehicleFilter = "all" | "truck" | "pickup" | "minivan";
type RouteFilter = "all" | "route-a" | "route-b" | "route-c" | "route-d";

export default function ReportsFilters() {
  const [fromDate, setFromDate] = useState("2026-03-01");
  const [toDate, setToDate] = useState("2026-03-31");
  const [driver, setDriver] = useState<DriverFilter>("all");
  const [vehicle, setVehicle] = useState<VehicleFilter>("all");
  const [route, setRoute] = useState<RouteFilter>("all");

  const resetFilters = () => {
    setFromDate("2026-03-01");
    setToDate("2026-03-31");
    setDriver("all");
    setVehicle("all");
    setRoute("all");
  };

  return (
    <section className="rounded-(--radius-box) border border-(--color-border-soft) bg-white px-3 py-3 shadow-(--shadow-soft) sm:px-4 sm:py-4">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
        <SectionLabel title="Reports Filters" />
        <button
          type="button"
          onClick={resetFilters}
          className="shrink-0 rounded-(--radius-field) border border-(--color-border-soft) px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-(--color-primary-light) sm:px-3 sm:py-1.5 sm:text-[0.66rem] sm:tracking-[0.12em]"
        >
          Reset
        </button>
      </div>

   <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 overflow-hidden">
        <label className="min-w-0 space-y-1.5 overflow-hidden">
        <span className="text-[0.56rem] font-bold uppercase tracking-widest text-(--color-dimmed) sm:text-[0.64rem] sm:tracking-[0.14em]">
            Date From
        </span>
        <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="block w-full min-w-0 appearance-none rounded-(--radius-field) border border-(--color-border-soft) bg-white px-2 py-1.5 text-[0.68rem] font-medium text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:px-3 sm:py-2 sm:text-sm"
        />
        </label>

        <label className="min-w-0 space-y-1.5 overflow-hidden">
        <span className="text-[0.56rem] font-bold uppercase tracking-widest text-(--color-dimmed) sm:text-[0.64rem] sm:tracking-[0.14em]">Date To</span>
        <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="block w-full min-w-0 appearance-none rounded-(--radius-field) border border-(--color-border-soft) bg-white px-2 py-1.5 text-[0.68rem] font-medium text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:px-3 sm:py-2 sm:text-sm"
        />
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.56rem] font-bold uppercase tracking-widest text-(--color-dimmed) sm:text-[0.64rem] sm:tracking-[0.14em]">Driver</span>
          <select
            value={driver}
            onChange={(event) => setDriver(event.target.value as DriverFilter)}
            className="w-full rounded-(--radius-field) border border-(--color-border-soft) bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:px-3 sm:py-2 sm:text-sm"
          >
            <option value="all">All Drivers</option>
            <option value="ahmad">Ahmad</option>
            <option value="siti">Siti</option>
            <option value="ravi">Ravi</option>
            <option value="muthu">Muthu</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.56rem] font-bold uppercase tracking-widest text-(--color-dimmed) sm:text-[0.64rem] sm:tracking-[0.14em]">Vehicle</span>
          <select
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value as VehicleFilter)}
            className="w-full rounded-(--radius-field) border border-(--color-border-soft) bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:px-3 sm:py-2 sm:text-sm"
          >
            <option value="all">All Vehicles</option>
            <option value="truck">Truck</option>
            <option value="pickup">Pickup</option>
            <option value="minivan">Minivan</option>
          </select>
        </label>

        <label className="col-span-2 space-y-1.5 lg:col-span-4">
          <span className="text-[0.56rem] font-bold uppercase tracking-widest text-(--color-dimmed) sm:text-[0.64rem] sm:tracking-[0.14em]">Route</span>
          <select
            value={route}
            onChange={(event) => setRoute(event.target.value as RouteFilter)}
            className="w-full rounded-(--radius-field) border border-(--color-border-soft) bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none transition-colors focus:border-(--color-primary) sm:px-3 sm:py-2 sm:text-sm"
          >
            <option value="all">All Routes</option>
            <option value="route-a">Route A</option>
            <option value="route-b">Route B</option>
            <option value="route-c">Route C</option>
            <option value="route-d">Route D</option>
          </select>
        </label>
      </div>
    </section>
  );
}

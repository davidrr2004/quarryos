"use client";

import { useState } from "react";
import Link from "next/link";
import SectionLabel from "../../components/SectionLabel";

type DriverPaymentRow = {
  name: string;
  runs: number;
  earned: string;
  status: "Paid" | "Unpaid";
};

const DRIVER_PAYMENTS: DriverPaymentRow[] = [
  { name: "Ahmad", runs: 12, earned: "\u20b912,000", status: "Paid" },
  { name: "Siti", runs: 8, earned: "\u20b98,000", status: "Unpaid" },
  { name: "Ravi", runs: 10, earned: "\u20b99,500", status: "Paid" },
  { name: "Muthu", runs: 6, earned: "\u20b95,400", status: "Unpaid" },
];

function statusClasses(status: DriverPaymentRow["status"]) {
  return status === "Paid"
    ? "bg-[#ecfdf5] text-emerald-700"
    : "bg-[#fff7ed] text-orange-700";
}

export default function DriverPaymentsSection() {
  const [drivers, setDrivers] = useState<DriverPaymentRow[]>(DRIVER_PAYMENTS);

  const updateStatus = (name: string, status: DriverPaymentRow["status"]) => {
    setDrivers((current) =>
      current.map((driver) => (driver.name === name ? { ...driver, status } : driver))
    );
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel title="Driver Payments" />
        <Link
          href="/workers"
          className="rounded-(--radius-field) border border-(--color-border-soft) bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-(--color-primary-light)"
        >
          Driver Profiles
        </Link>
      </div>

      <div className="overflow-hidden rounded-(--radius-box) border border-(--color-border-soft) bg-white shadow-(--shadow-soft)">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-(--color-primary-light) text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-600">
              <tr>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Runs</th>
                <th className="px-4 py-3">Earned</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.name} className="border-t border-(--color-border-soft)">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{driver.name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700">{driver.runs}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{driver.earned}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Payment status for ${driver.name}`}
                      value={driver.status}
                      onChange={(event) =>
                        updateStatus(driver.name, event.target.value as DriverPaymentRow["status"])
                      }
                      className={`rounded-full border border-transparent px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-widest ${statusClasses(
                        driver.status
                      )}`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

import SectionLabel from "../../components/SectionLabel";

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

const DRIVER_PERFORMANCE: DriverPerformance[] = [
  { name: "Ahmad", trips: 18, onTime: "94%", distance: "1,240 km", earnings: "\u20b918,600" },
  { name: "Siti", trips: 15, onTime: "91%", distance: "1,020 km", earnings: "\u20b915,200" },
  { name: "Ravi", trips: 12, onTime: "88%", distance: "890 km", earnings: "\u20b912,300" },
];

const VEHICLE_UTILIZATION: VehicleUtilization[] = [
  { vehicle: "KL-2341", activePercent: 78, idlePercent: 22 },
  { vehicle: "KL-3301", activePercent: 64, idlePercent: 36 },
  { vehicle: "KL-5510", activePercent: 82, idlePercent: 18 },
];

const REPORT_CARD =
  "rounded-(--radius-box) border border-(--color-border-soft) bg-white p-4 shadow-(--shadow-soft)";

export default function KeyReportsSection() {
  return (
    <section className="space-y-3">
      <SectionLabel title="Key Reports" />

      <div className="grid gap-3 xl:grid-cols-2">
        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">1. Driver Performance Report</h3>
          <p className="mt-1 text-xs text-(--color-muted)">Trips completed, on-time %, total distance, and earnings.</p>
          <div className="mt-3 overflow-x-auto">
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
                {DRIVER_PERFORMANCE.map((row) => (
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
          </div>
        </article>

        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">2. Vehicle Utilization</h3>
          <p className="mt-1 text-xs text-(--color-muted)">How much each vehicle is active vs idle.</p>
          <div className="mt-4 space-y-3">
            {VEHICLE_UTILIZATION.map((row) => (
              <div key={row.vehicle}>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{row.vehicle}</span>
                  <span>{row.activePercent}% active / {row.idlePercent}% idle</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-(--color-primary)" style={{ width: `${row.activePercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={REPORT_CARD}>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">3. Delivery Performance</h3>
          <p className="mt-1 text-xs text-(--color-muted)">Completed, pending, issues, and average delivery time.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-(--radius-field) bg-[#ecfdf5] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Completed</p>
              <p className="mt-1 text-lg font-black text-emerald-800">124</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#fff7ed] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Pending</p>
              <p className="mt-1 text-lg font-black text-orange-800">17</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#fef2f2] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700">Issues</p>
              <p className="mt-1 text-lg font-black text-rose-800">6</p>
            </div>
            <div className="rounded-(--radius-field) bg-[#eef2ff] px-3 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Avg Time</p>
              <p className="mt-1 text-lg font-black text-indigo-800">34 min</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

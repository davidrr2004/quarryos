import SectionLabel from "../../components/SectionLabel";

type TripRevenueRow = {
  tripId: string;
  route: string;
  revenue: number;
  fuelCost: number;
};

const TRIP_REVENUE_ROWS: TripRevenueRow[] = [
  { tripId: "TRIP-1201", route: "Route A", revenue: 18500, fuelCost: 6200 },
  { tripId: "TRIP-1202", route: "Route B", revenue: 14200, fuelCost: 5100 },
  { tripId: "TRIP-1203", route: "Route C", revenue: 16400, fuelCost: 5800 },
  { tripId: "TRIP-1204", route: "Route D", revenue: 12100, fuelCost: 4700 },
];

function formatCurrency(value: number) {
  return `\u20b9${value.toLocaleString("en-IN")}`;
}

export default function TripRevenueSection() {
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
              {TRIP_REVENUE_ROWS.map((trip) => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

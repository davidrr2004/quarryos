import SectionLabel from "../../components/SectionLabel";
import { StatCard, StatsGrid } from "../../components/StatsGrid";

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

const CATEGORY_TOTALS: ExpenseCategory[] = [
  {
    label: "Fuel Expenses",
    value: "\u20b928,500",
    cardClassName: "bg-[#ecfeff]",
    valueClassName: "text-cyan-700",
  },
  {
    label: "Driver Payments",
    value: "\u20b932,000",
    cardClassName: "bg-[#ecfdf5]",
    valueClassName: "text-emerald-700",
  },
  {
    label: "Maintenance",
    value: "\u20b99,500",
    cardClassName: "bg-[#fff7ed]",
    valueClassName: "text-orange-700",
  },
  {
    label: "Other Expenses",
    value: "\u20b94,000",
    cardClassName: "bg-[#fef2f2]",
    valueClassName: "text-rose-700",
  },
];

const EXPENSE_ENTRIES: ExpenseEntry[] = [
  { date: "12 Mar", type: "Fuel", amount: "\u20b95,000", notes: "KL-2341" },
  { date: "13 Mar", type: "Driver", amount: "\u20b93,000", notes: "Ahmad" },
  { date: "14 Mar", type: "Maintenance", amount: "\u20b92,400", notes: "KL-5510 brake service" },
  { date: "15 Mar", type: "Other", amount: "\u20b91,200", notes: "Parking and tolls" },
];

export default function ExpenseTrackingSection() {
  return (
    <section className="space-y-3">
      <SectionLabel title="Expense Tracking" />

      <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-4">
        {CATEGORY_TOTALS.map((category) => (
          <StatCard
            key={category.label}
            value={category.value}
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
              {EXPENSE_ENTRIES.map((entry, index) => (
                <tr key={`${entry.date}-${entry.type}-${index}`} className="border-t border-(--color-border-soft)">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{entry.type}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{entry.amount}</td>
                  <td className="px-4 py-3 text-sm text-(--color-muted)">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

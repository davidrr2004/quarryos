import { StatCard, StatsGrid } from "../../components/StatsGrid";

type FinanceMetric = {
  label: string;
  value: string;
  cardClassName: string;
  valueClassName: string;
};

const METRICS: FinanceMetric[] = [
  {
    label: "Revenue",
    value: "\u20b91,20,000",
    cardClassName: "bg-[#ecfeff]",
    valueClassName: "text-cyan-700",
  },
  {
    label: "Expenses",
    value: "\u20b970,000",
    cardClassName: "bg-[#fff7ed]",
    valueClassName: "text-orange-700",
  },
  {
    label: "Profit",
    value: "\u20b950,000",
    cardClassName: "bg-[#ecfdf5]",
    valueClassName: "text-emerald-700",
  },
  {
    label: "Pending",
    value: "\u20b920,000",
    cardClassName: "bg-[#fef2f2]",
    valueClassName: "text-rose-700",
  },
];

export default function FinanceSummaryCards() {
  return (
    <StatsGrid columnsClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {METRICS.map((metric) => (
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

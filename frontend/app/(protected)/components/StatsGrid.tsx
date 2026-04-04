import type { ReactNode } from "react";

type StatsGridProps = {
  children: ReactNode;
  columnsClassName?: string;
};

type StatCardProps = {
  value: ReactNode;
  label: string;
  cardClassName: string;
  valueClassName: string;
};

export function StatsGrid({ children, columnsClassName = "grid-cols-2 sm:grid-cols-4" }: StatsGridProps) {
  return <section className={`grid gap-3 ${columnsClassName}`}>{children}</section>;
}

export function StatCard({ value, label, cardClassName, valueClassName }: StatCardProps) {
  return (
    <div className={`rounded-[var(--radius-field)] px-4 py-4 text-center ${cardClassName}`}>
      <div className={`text-2xl font-black ${valueClassName}`}>{value}</div>
      <div className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</div>
    </div>
  );
}

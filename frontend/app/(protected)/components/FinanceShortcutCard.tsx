import type { MouseEventHandler } from "react";

type FinanceShortcutCardProps = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function FinanceShortcutCard({
  title,
  subtitle,
  ctaLabel = "Finance ->",
  onClick,
}: FinanceShortcutCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-[0.72rem] text-[var(--color-muted)]">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="rounded-[var(--radius-field)] bg-[var(--color-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

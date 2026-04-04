import type { ReactNode } from "react";

type PageHeaderProps = {
  label: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export default function PageHeader({ label, title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">{label}</p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}

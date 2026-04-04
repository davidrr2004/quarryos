import type { FleetFilterStatus } from "./types";

type TabItem = {
  short: string;
  value: FleetFilterStatus;
};

type FleetFilterTabsProps = {
  tabs: TabItem[];
  filterState: FleetFilterStatus;
  onChange: (value: FleetFilterStatus) => void;
  getCount: (value: FleetFilterStatus) => number;
};

export default function FleetFilterTabs({ tabs, filterState, onChange, getCount }: FleetFilterTabsProps) {
  return (
    <section className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap gap-2" id="fleet-filter-tabs">
        {tabs.map((tab) => {
          const isActive = filterState === tab.value;
          const count = getCount(tab.value);
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors"
              style={{
                background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                color: isActive ? "#ffffff" : "var(--color-muted)",
                border: isActive ? "none" : "1px solid var(--color-border-soft)",
              }}
            >
              {tab.short} ({count})
            </button>
          );
        })}
      </div>
    </section>
  );
}

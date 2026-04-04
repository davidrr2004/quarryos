export default function SectionLabel({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-dimmed)]">
      {title}
      <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
    </div>
  );
}

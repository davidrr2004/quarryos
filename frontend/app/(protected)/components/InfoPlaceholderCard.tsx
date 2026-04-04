export default function InfoPlaceholderCard({ message }: { message: string }) {
  return (
    <section className="rounded-[var(--radius-box)] border border-[var(--color-border-soft)] bg-white px-4 py-5 shadow-[var(--shadow-soft)]">
      <p className="text-sm text-[var(--color-muted)]">{message}</p>
    </section>
  );
}

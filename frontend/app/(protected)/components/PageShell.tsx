import type { ReactNode } from "react";

type MaxWidth = "5xl" | "6xl";

type PageContainerProps = {
  children: ReactNode;
  maxWidth?: MaxWidth;
};

const maxWidthClass: Record<MaxWidth, string> = {
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
};

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[var(--color-surface)] px-4 py-5 pb-28 text-slate-900 font-sans">{children}</main>;
}

export function PageContainer({ children, maxWidth = "5xl" }: PageContainerProps) {
  return <section className={`mx-auto w-full ${maxWidthClass[maxWidth]} space-y-4`}>{children}</section>;
}

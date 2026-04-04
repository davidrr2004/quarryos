"use client";

const REPORT_ROWS = [
  ["Report", "Metric", "Value"],
  ["Driver Performance", "Top Driver", "Ahmad"],
  ["Driver Performance", "Trips Completed", "18"],
  ["Vehicle Utilization", "Top Vehicle", "KL-5510"],
  ["Vehicle Utilization", "Active Time", "82%"],
  ["Delivery Performance", "Completed", "124"],
  ["Delivery Performance", "Pending", "17"],
  ["Delivery Performance", "Issues", "6"],
  ["Delivery Performance", "Average Delivery Time", "34 min"],
];

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildCsv(rows: string[][]): string {
  return rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");
}

export default function ReportsExportSection() {
  const handleExportExcel = () => {
    const csv = buildCsv(REPORT_ROWS);
    downloadFile(csv, "quarryos-reports.csv", "text/csv;charset=utf-8;");
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <section className="flex items-center justify-start gap-2">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-(--color-dimmed)">Export</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExportPdf}
          className="rounded-(--radius-field) border border-(--color-border-soft) bg-white px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-slate-700 transition-colors hover:bg-(--color-primary-light)"
        >
          PDF
        </button>

        <button
          type="button"
          onClick={handleExportExcel}
          className="rounded-(--radius-field) bg-(--color-primary) px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-white shadow-(--shadow-soft) transition-opacity hover:opacity-90"
        >
          Excel
        </button>
      </div>
    </section>
  );
}

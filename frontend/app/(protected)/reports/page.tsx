import ReportsFilters from "./components/ReportsFilters";
import KeyReportsSection from "./components/KeyReportsSection";
import ReportsExportSection from "./components/ReportsExportSection";
import VisualChartsSection from "./components/VisualChartsSection";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";

export default function ReportsPage() {
  return (
    <PageShell>
      <PageContainer>
        <PageHeader
          label="P5 Reports"
          title="Reports"
          subtitle="fleet · workers · operations"
        />

        <ReportsExportSection />
        <ReportsFilters />
        <KeyReportsSection />
        <VisualChartsSection />
      </PageContainer>
    </PageShell>
  );
}
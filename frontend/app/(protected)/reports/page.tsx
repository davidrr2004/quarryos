import InfoPlaceholderCard from "../components/InfoPlaceholderCard";
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

        <InfoPlaceholderCard message="Reports and exports will be listed here." />
      </PageContainer>
    </PageShell>
  );
}
import InfoPlaceholderCard from "../components/InfoPlaceholderCard";
import PageHeader from "../components/PageHeader";
import { PageContainer, PageShell } from "../components/PageShell";

export default function FinancePage() {
  return (
    <PageShell>
      <PageContainer>
        <PageHeader
          label="P4 Finance"
          title="Finance"
          subtitle="payments · expenses · summaries"
        />

        <InfoPlaceholderCard message="Finance dashboard content will appear here." />
      </PageContainer>
    </PageShell>
  );
}
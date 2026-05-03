import FinanceSummaryCards from "./components/FinanceSummaryCards";
import ExpenseTrackingSection from "./components/ExpenseTrackingSection";
import DriverPaymentsSection from "./components/DriverPaymentsSection";
import TripRevenueSection from "./components/TripRevenueSection";
import WorkerPaymentForm from "./components/WorkerPaymentForm";
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

        <FinanceSummaryCards />
        <WorkerPaymentForm />
        <DriverPaymentsSection />
        <TripRevenueSection />
        <ExpenseTrackingSection />
      </PageContainer>
    </PageShell>
  );
}
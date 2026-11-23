import { OperationsDashboard } from "@/components/operations/OperationsDashboard";

/**
 * Operations dashboard page.
 * Remains a Server Component so the route segment stays visible to
 * Cache Components instant-navigation validation.
 */
export default function OperationsDashboardPage() {
  return <OperationsDashboard />;
}

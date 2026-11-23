import { Suspense } from "react";
import { PartnerApplicationDetailPage } from "@/components/operations/partners/PartnerApplicationDetailPage";

type ApplicationDetailPageProps = {
  params: Promise<{ applicationId: string }>;
};

function ApplicationDetailFallback() {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-black/5 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
      </div>
    </main>
  );
}

async function ApplicationDetailContent({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  return <PartnerApplicationDetailPage applicationId={applicationId} />;
}

export default function OperationsPartnerApplicationDetailRoute({
  params,
}: ApplicationDetailPageProps) {
  return (
    <Suspense fallback={<ApplicationDetailFallback />}>
      <ApplicationDetailContent params={params} />
    </Suspense>
  );
}

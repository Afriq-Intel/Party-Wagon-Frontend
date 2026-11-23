import { Suspense } from "react";
import { ProductDetailPage } from "@/components/operations/products/ProductDetailPage";

type ProductViewPageProps = {
  params: Promise<{ productId: string }>;
};

function ProductDetailFallback() {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-black/5 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
      </div>
    </main>
  );
}

async function ProductViewContent({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <ProductDetailPage productId={productId} mode="view" />;
}

export default function OperationsProductViewPage({
  params,
}: ProductViewPageProps) {
  return (
    <Suspense fallback={<ProductDetailFallback />}>
      <ProductViewContent params={params} />
    </Suspense>
  );
}

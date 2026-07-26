import { PageHeader } from "@/components/shared/page-header";
import { CardGridSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Insights" title="Articles and insights" />
      <CardGridSkeleton />
    </>
  );
}

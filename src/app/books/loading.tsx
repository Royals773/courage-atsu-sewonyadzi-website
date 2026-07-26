import { PageHeader } from "@/components/shared/page-header";
import { CardGridSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Books" title="Browse the catalogue" />
      <CardGridSkeleton />
    </>
  );
}

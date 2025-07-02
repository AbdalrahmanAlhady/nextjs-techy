import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-60" />
      <div className="border rounded-lg overflow-hidden divide-y divide-gray-200">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

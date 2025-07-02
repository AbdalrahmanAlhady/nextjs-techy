import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar placeholder */}
      <Skeleton className="hidden md:block w-64 h-screen" />
      <main className="flex-1 p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-80" />
      </main>
    </div>
  );
}

'use client';

export function TripCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-64 space-y-4">
      <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded w-24 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
}

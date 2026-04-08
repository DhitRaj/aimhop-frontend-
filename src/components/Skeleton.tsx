import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
    />
  );
};

export const ServiceSkeleton = () => (
  <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 p-10 space-y-6">
    <Skeleton className="h-56 w-full rounded-2xl" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-3 w-3 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-16 w-full" />
    <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

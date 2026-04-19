import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-muted rounded-2xl ${className}`}
    />
  );
};

export const ServiceSkeleton = () => (
  <div className="bg-card rounded-[3rem] border border-border p-10 space-y-8">
    <Skeleton className="h-72 w-full rounded-[2.5rem]" />
    <Skeleton className="h-10 w-3/4" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-12 w-full mt-4" />
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="p-12 bg-card rounded-[3rem] border border-border space-y-8">
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-4 w-4 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-24 w-full" />
    <div className="flex items-center gap-6 pt-10 border-t border-border">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 opacity-60" />
      </div>
    </div>
  </div>
);

export const BlogSkeleton = () => (
  <div className="bg-card rounded-[3rem] overflow-hidden border border-border flex flex-col h-full">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
      <div className="space-y-6">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="pt-8 border-t border-border">
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  </div>
);

export const ClientSkeleton = () => (
  <div className="bg-card rounded-[3rem] p-10 border border-border flex flex-col items-center justify-center space-y-6">
    <Skeleton className="w-24 h-24 rounded-full" />
    <div className="space-y-3 w-full flex flex-col items-center">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-1/2 opacity-60" />
    </div>
  </div>
);

import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-[#F1F5F9] dark:bg-[#1e293b] rounded-[14px] transition-colors duration-200 ${className}`}
    />
  );
};

export const ServiceSkeleton = () => (
  <div className="bg-white dark:bg-[#111113] rounded-[20px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] overflow-hidden transition-colors duration-200">
    <Skeleton className="h-56 w-full rounded-none rounded-t-[20px]" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-1/2 mt-4" />
    </div>
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="p-6 bg-[#FAFAF8] dark:bg-[#111113] rounded-[20px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] space-y-4 transition-colors duration-200">
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-3 w-3 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E4] dark:border-[#1e1e24]">
      <Skeleton className="w-10 h-10 rounded-[12px]" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const BlogSkeleton = () => (
  <div className="bg-white dark:bg-[#111113] rounded-[20px] overflow-hidden border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] flex flex-col transition-colors duration-200">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="p-6 flex-1 flex flex-col space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-16 w-full" />
      <div className="pt-4 border-t border-[#E8E8E4] dark:border-[#1e1e24] mt-auto">
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

export const ClientSkeleton = () => (
  <div className="bg-white dark:bg-[#111113] rounded-[20px] p-6 border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] flex flex-col items-center justify-center space-y-4 transition-colors duration-200">
    <Skeleton className="w-16 h-16 rounded-[14px]" />
    <div className="space-y-2 w-full flex flex-col items-center">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

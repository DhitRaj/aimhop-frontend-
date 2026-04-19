import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton, ServiceSkeleton, TestimonialSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="font-sans overflow-x-hidden bg-background">
      <Navbar />
      
      <main>
        {/* HERO SKELETON */}
        <section className="relative min-h-[600px] flex items-center pt-40 pb-20 overflow-hidden bg-muted">
          <div className="absolute inset-0 z-0">
            <Skeleton className="w-full h-full rounded-none opacity-50" />
          </div>
          <div className="relative z-10 container-pad w-full">
            <div className="max-w-4xl space-y-8">
              <Skeleton className="h-20 md:h-32 w-5/6" />
              <Skeleton className="h-20 md:h-32 w-4/6" />
              <Skeleton className="h-8 w-2/3" />
              <div className="flex flex-wrap gap-6 pt-6">
                <Skeleton className="h-16 w-48 rounded-[2rem]" />
                <Skeleton className="h-16 w-48 rounded-[2rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* TOP CARDS SKELETON */}
        <section className="relative z-20 -mt-20 mb-32 container-pad">
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-[3.5rem] p-12 shadow-2xl border border-border space-y-8">
                <Skeleton className="w-20 h-20 rounded-[1.5rem]" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* CONTENT SKELETON */}
        <section className="py-32 bg-background">
          <div className="container-pad">
            <div className="mb-20 space-y-4">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <ServiceSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

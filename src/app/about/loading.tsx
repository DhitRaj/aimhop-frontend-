import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/Skeleton";

export default function AboutLoading() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <Navbar />

      <main className="pb-20">
        {/* Page Hero Skeleton */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Skeleton className="w-full h-full rounded-none opacity-20" />
          </div>
          <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl mx-auto">
            <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb Skeleton */}
          <div className="py-6 border-b border-slate-100 dark:border-slate-800/50 mb-10 flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mt-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="space-y-6">
                {[1, 2].map(item => (
                  <div key={item} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <Skeleton className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full" />
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full mt-2" />
                    <Skeleton className="h-3 w-4/5 mt-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <Skeleton className="w-full aspect-square rounded-[3rem]" />
              
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <Skeleton className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 rounded-full" />
                <Skeleton className="h-8 w-2/3 mb-6 bg-slate-800" />
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <Skeleton className="w-6 h-6 rounded-full shrink-0 bg-slate-800" />
                      <Skeleton className="h-4 w-3/4 bg-slate-800" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

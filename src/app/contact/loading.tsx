import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/Skeleton";

export default function ContactLoading() {
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

          <div className="grid lg:grid-cols-2 gap-16 mt-14 items-start">
            {/* Left: Contact Info Skeleton */}
            <div className="space-y-10">
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="flex gap-5 items-start">
                    <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-800 flex items-center gap-5">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>

            {/* Right: Form Skeleton */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 ml-1" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 ml-1" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 ml-1" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32 ml-1" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-32 ml-1" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>

                <Skeleton className="h-16 w-full rounded-3xl mt-4" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { getMediaUrl } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { ServiceSkeleton } from "@/components/Skeleton";

export function ServicesPreviewSection({ services }: { services: any[] }) {
  return (
    <section className="section-spacing bg-muted dark:bg-card/50 relative">
      <div className="container-pad">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            Our Expertise <br />
            <span className="gradient-text">Across Sectors.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">Tailored protection strategies designed to safeguard your most valuable assets with precision.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Suspense fallback={<ServiceSkeleton />}>
            {services.slice(0, 3).map((s: any, i: number) => (
              <div key={s?._id || i} className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden card-hover border border-border">
                <img
                  src={s?.image ? getMediaUrl(s.image) : "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1480&auto=format&fit=crop"}
                  alt={s?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    {s?.category || 'Security'}
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                    {s?.title || 'Guarding Solutions'}
                  </h3>
                  <p className="text-white/60 text-xs font-medium leading-relaxed line-clamp-2">
                    {s?.description || 'World-class security solutions tailored for your complex environment.'}
                  </p>
                  <Link href="/services" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary pt-4 hover:gap-3 transition-all">
                    EXPLORE NOW <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}

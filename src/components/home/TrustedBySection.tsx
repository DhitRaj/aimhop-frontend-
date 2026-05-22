import React from "react";

export function TrustedBySection({ settings }: { settings: any }) {
  return (
    <section className="py-16 bg-muted/50 dark:bg-card/50 border-y border-border">
      <div className="container-pad flex flex-col md:flex-row items-center justify-between gap-10">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 whitespace-nowrap">Trusted By Elite Brands</p>
        <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-40 hover:grayscale-0 transition-all duration-700">
          {settings?.statsClients ? (
            <span className="text-lg font-black tracking-widest uppercase italic">{settings.statsClients} PARTNERS</span>
          ) : (
            ['HDFC BANK', 'FORTIS', 'AMITY UNIVERSITY', 'PVR CINEMAS'].map(c => (
              <span key={c} className="text-sm md:text-xl font-black tracking-tighter uppercase opacity-80">{c}</span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

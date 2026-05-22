import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";
import { Camera, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

export function CctvSurveillanceSection({ settings }: { settings: any }) {
  return (
    <section className="section-spacing relative overflow-hidden bg-muted dark:bg-card/30">
      <div className="container-pad relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group order-2 lg:order-1">
            <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full" />
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl shadow-primary/10">
              <SafeImage
                src={settings?.cctvImage ? getMediaUrl(settings.cctvImage) : "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1470&auto=format&fit=crop"}
                alt="CCTV Control Room"
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent mix-blend-overlay" />
              <div className="absolute top-8 left-8 flex gap-4">
                <div className="px-4 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE MONITORING
                </div>
              </div>
            </div>
            {/* Floating Tech Stats */}
            <div className="absolute -bottom-10 -right-6 md:right-10 bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl max-w-[280px] space-y-4 hidden md:block animate-bounce-subtle">
              <div className="flex items-center gap-4 text-primary">
                <Camera className="w-8 h-8" />
                <span className="font-black text-xs uppercase tracking-widest">Tech Specs</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">AI-Driven Motion Detection, 4K Night Vision, & 24/7 Remote Command Center Integration.</p>
            </div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={16} />
              <span>Electronic Counter-Measures</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              CCTV & <br />
              <span className="gradient-text">Surveillance Hub.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Beyond physical guarding, we deploy state-of-the-art electronic eyes. From commercial installation to 24/7 remote monitoring, our surveillance solutions provide a multi-layered shield for your infrastructure.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { t: "AI Integration", d: "Smart detection algorithms" },
                { t: "Remote Access", d: "Mobile control & monitoring" },
                { t: "Quick Install", d: "Zero-downtime deployment" },
                { t: "24/7 Command", d: "Dedicated monitoring team" },
              ].map(item => (
                <div key={item.t} className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle size={10} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-tight leading-none mb-1">{item.t}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <Link href="/contact?service=cctv" className="btn-primary">
                Request Installation Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

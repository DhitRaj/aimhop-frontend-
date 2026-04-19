"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Camera, Users, Building2, Paintbrush as Broom, Phone, CheckCircle2, Zap, ArrowRight, Server, ShieldCheck, Cpu, Activity, Landmark, Hospital } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { serviceAPI, settingsAPI, bannerAPI } from "@/lib/api";
import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";
import { ServiceSkeleton } from "@/components/Skeleton";
import { useSync } from "@/hooks/useSync";


const IconMap: any = {
  Shield: <Shield className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Broom: <Broom className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [serRes, setRes, banRes] = await Promise.all([
        serviceAPI.getAll(), 
        settingsAPI.get(), 
        bannerAPI.getAll(true, 'Services')
      ]);
      if (serRes.data) setServices(serRes.data as any[]);
      if (setRes.data) setSettings(setRes.data);
      if (banRes.data && (banRes.data as any[]).length > 0) setBanner((banRes.data as any[])[0]);
    } catch (error) {
      console.error("Error fetching services data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useSync(fetchData, 20000);


  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
  const heroTitle = banner?.title || "Security Services";
  const heroSubtitle = banner?.subtitle || "Elite protection tailored for your specific environment and assets.";

  // Removed the full page loading spinner to show skeletons inside the layout instead

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pb-32">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          backgroundImage={heroImg}
        />

        <div className="container-pad">
          <Breadcrumb title="Our Capabilities" />

          {/* Services Grid Section */}
          <div className="space-y-24">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] opacity-60">
                  <Activity size={16} />
                  <span>Elite Portfolio</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                  Discipline <br />
                  <span className="gradient-text">Engineered.</span>
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md text-lg font-medium leading-relaxed border-l-2 border-primary/20 pl-8 italic">
                Military-grade protocols meeting modern innovation. We don't just secure — we protect with foresight.
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ServiceSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((s: any, idx: number) => (
                <div 
                  key={s._id} 
                  className="group bg-card border border-border rounded-[3rem] overflow-hidden card-hover flex flex-col"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    {s.image ? (
                      <SafeImage
                        src={getMediaUrl(s.image)}
                        alt={s.title}
                        fill
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-primary/20">
                        <Shield size={80} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-background/80 backdrop-blur-md border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-foreground">
                        {s.category || 'Security'}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-grow space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3">
                        {s.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {s.features && Array.isArray(s.features) && s.features.slice(0, 3).map((f: string) => (
                        <div key={f} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">
                          <CheckCircle2 size={16} className="text-primary shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-8 border-t border-border">
                      <Link 
                        href="/contact" 
                        className="flex items-center justify-between group/btn"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover/btn:translate-x-2 transition-transform">
                          Engage Protection
                        </span>
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary group-hover/btn:text-white transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

            {/* SECTOR SPECIALIZATION - High Content Section */}
            <div className="pt-24 space-y-20">
               <div className="max-w-3xl space-y-6">
                  <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-primary">Mission Versatility</h3>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                     Sector-Specific <br />
                     <span className="gradient-text">Protection Units.</span>
                  </h2>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { t: "Financial & Banking", d: "High-alert guarding for ATMs, cash-in-transit, and bank branches with 100% protocol adherence.", i: <Landmark className="w-8 h-8" /> },
                    { t: "Healthcare Facilities", d: "Sensitive area management, patient safety protocols, and 24/7 entry point control for hospitals.", i: <Hospital className="w-8 h-8" /> },
                    { t: "Industrial & Manufacturing", d: "Asset protection, perimeter defense, and material movement monitoring for factories and plants.", i: <Building2 className="w-8 h-8" /> },
                    { t: "Retail & Residential", d: "Loss prevention for malls and elite society guarding with focus on courtesy and vigilance.", i: <Users className="w-8 h-8" /> },
                  ].map(sector => (
                    <div key={sector.t} className="p-10 bg-card border border-border rounded-[3.5rem] card-hover flex gap-10 items-center group">
                       <div className="w-20 h-20 shrink-0 rounded-[1.5rem] bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                          {sector.i}
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black uppercase tracking-tight">{sector.t}</h4>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed">{sector.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* CTA Spotlight */}
            <div className="relative p-16 md:p-24 rounded-[4rem] overflow-hidden bg-primary shadow-2xl shadow-primary/20">
              <Shield className="absolute -right-24 -bottom-24 w-[30rem] h-[30rem] text-white/5 rotate-12" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                    <Zap size={16} className="fill-current" />
                    <span>Free Vulnerability Assessment</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                    Secure Your <br />
                    <span className="text-white/40">Domain Today.</span>
                  </h2>
                  <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">
                    Our strategic audit program uncovers hidden risks before they manifest. Deploy elite protection with AimHop.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-primary rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-2xl">
                    Initiate Audit <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 space-y-8">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary shadow-2xl">
                      <Phone size={32} />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">24/7 Strategic Command</p>
                      <p className="text-4xl font-black text-white tracking-tighter uppercase">+91 91513 85320</p>
                   </div>
                   <p className="text-sm font-medium text-white/60 leading-relaxed uppercase tracking-widest pt-6 border-t border-white/10">
                      Rapid Response Team Active. <br /> Standing by for deployment.
                   </p>
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



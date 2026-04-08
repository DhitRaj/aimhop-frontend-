"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Camera, Users, Building2, Paintbrush as Broom, Phone, CheckCircle2, Zap, ArrowRight, Server } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { serviceAPI, settingsAPI } from "@/lib/api";
import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";

const IconMap: any = {
  Shield: <Shield className="w-10 h-10" />,
  Camera: <Camera className="w-10 h-10" />,
  Users: <Users className="w-10 h-10" />,
  Building2: <Building2 className="w-10 h-10" />,
  Broom: <Broom className="w-10 h-10" />,
  Server: <Server className="w-10 h-10" />,
};

// API Base constant removed in favor of getMediaUrl utility

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [serRes, setRes] = await Promise.all([serviceAPI.getAll(), settingsAPI.get()]);
      if (serRes.data) setServices(serRes.data);
      if (setRes.data) setSettings(setRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const heroImg = getMediaUrl(settings?.heroImage);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <section className="relative h-[320px] md:h-[400px] mb-16 bg-slate-950 rounded-b-[3rem] overflow-hidden flex items-center justify-center">
          {heroImg && (
            <SafeImage 
              src={heroImg} 
              alt="Services Background" 
              fill
              className="absolute inset-0 w-full h-full object-cover object-center opacity-70" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-10 text-center space-y-6 px-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase drop-shadow-2xl">Our Services</h1>
              <p className="text-sky-400 font-bold uppercase tracking-widest text-sm italic">Professional Security for Every Need</p>
            </div>
            {settings?.ctaBrochureEnabled !== false && (
              <div className="pt-4">
                <a 
                  href={getMediaUrl(settings?.brochureUrl)} 
                  download 
                  className="inline-flex items-center gap-3 bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-sky-600/20 transition-all hover:scale-105 active:scale-95 group/btn"
                >
                  <Server className="w-5 h-5 group-hover/btn:animate-bounce" />
                  Download Company Portfolio
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb title="Services" />

          <div className="grid lg:grid-cols-2 gap-8 mt-12">
            {services.map((s: any) => (
              <div key={s._id} className="group flex flex-col bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {s.image ? (
                    <SafeImage
                      src={getMediaUrl(s.image)}
                      alt={s.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-sky-600 transition-colors duration-500 group-hover:from-sky-600 group-hover:to-sky-700 group-hover:text-white">
                      {IconMap[s.icon] || <Shield className="w-16 h-16" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    {IconMap[s.icon] || <Shield className="w-6 h-6" />}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                    {s.features && Array.isArray(s.features) && s.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/contact" className="flex items-center justify-between group/link">
                      <span className="text-sm font-black uppercase tracking-widest text-sky-600 group-hover:text-sky-500 transition-colors">
                        Inquiry Now
                      </span>
                      <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 group-hover/link:bg-sky-600 group-hover/link:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          {settings?.ctaSafetyAuditEnabled !== false && (
            <div className="mt-20 p-10 bg-slate-900 rounded-3xl text-white overflow-hidden relative group">
              <Shield className="absolute top-[-40px] right-[-40px] w-48 h-48 text-white/5 group-hover:scale-125 transition-transform duration-[5s]" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <h2 className="text-2xl lg:text-4xl font-black tracking-tight uppercase leading-tight">Need a Security Check for Your Premises?</h2>
                  <p className="text-base text-white/80 font-medium">Our experts will visit your premises for a complete security check — absolutely free.</p>
                  <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-all">Book Free Visit <Zap className="text-sky-600" /></Link>
                </div>
                <div className="hidden lg:block bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <div className="text-center space-y-2">
                    <Phone className="w-10 h-10 mx-auto mb-4 text-sky-600" />
                    <p className="font-black text-2xl uppercase tracking-tight">+91 91513 85320</p>
                    <p className="font-bold text-lg uppercase tracking-tight opacity-70">/ 21 / 22 / 23</p>
                    <p className="text-sm font-medium opacity-60">Call anytime — 24/7 available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

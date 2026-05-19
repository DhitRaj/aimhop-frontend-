"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Camera, Users, Building2, CheckCircle, ArrowRight, Phone, Landmark, Hospital } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { serviceAPI, settingsAPI, bannerAPI } from "@/lib/api";
import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";
import { useSync } from "@/hooks/useSync";

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
  const heroTitle = banner?.title || "Our Security Services";
  const heroSubtitle = banner?.subtitle || "Comprehensive protection solutions tailored for your business needs";

  return (
    <div className="bg-[#FAFAF8] dark:bg-[#0a0a0b] min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="pb-32">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          backgroundImage={heroImg}
        />

        <div className="max-w-[1240px] mx-auto px-8 md:px-12">
          <Breadcrumb title="Our Services" />

          {/* Intro Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e] mb-3">What We Offer</div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-1.5px] leading-[1.12] text-[#1A1A18] dark:text-[#f8fafc] max-w-[560px] transition-colors duration-200">
                Complete security solutions for every need
              </h2>
            </div>
            <p className="text-[16.5px] text-[#6B7068] dark:text-[#94a3b8] max-w-md leading-[1.7] transition-colors duration-200">
              From trained security personnel to advanced surveillance systems — we provide end-to-end protection.
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] p-8 h-[400px] animate-pulse transition-colors duration-200">
                  <div className="w-full h-48 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded-[14px] mb-6"></div>
                  <div className="h-4 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded mb-3"></div>
                  <div className="h-3 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s: any) => (
                <div 
                  key={s._id} 
                  className="bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_48px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    {s.image ? (
                      <SafeImage
                        src={getMediaUrl(s.image)}
                        alt={s.title}
                        fill
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center transition-colors duration-200">
                        <Shield size={64} className="text-[#5CC67A]/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 dark:bg-[#111113]/90 backdrop-blur-sm border border-[#E8E8E4] dark:border-[#1e1e24] rounded-full text-[11px] font-bold tracking-[0.8px] uppercase text-[#3daa5e] transition-colors duration-200">
                        {s.category || 'Security'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] hover:text-[#5CC67A] transition-colors duration-200">
                      {s.title}
                    </h3>
                    <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.65] line-clamp-3 transition-colors duration-200">
                      {s.description}
                    </p>

                    {s.features && Array.isArray(s.features) && s.features.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {s.features.slice(0, 3).map((f: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-[13px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">
                            <CheckCircle size={14} className="text-[#5CC67A] shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
                      <Link 
                        href="/contact" 
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5CC67A] hover:gap-3 transition-all"
                      >
                        Get Quote <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sector Specialization */}
          <div className="mt-32 space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Industry Expertise</div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-1.5px] leading-[1.12] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                Specialized security for every sector
              </h2>
              <p className="text-[16.5px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                We understand that different industries have unique security requirements. Our team is trained to handle sector-specific challenges.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  title: "Financial & Banking", 
                  desc: "ATM security, cash-in-transit protection, and bank branch guarding with strict protocol adherence.", 
                  icon: <Landmark className="w-8 h-8" /> 
                },
                { 
                  title: "Healthcare Facilities", 
                  desc: "Hospital security, patient safety management, and 24/7 entry point monitoring.", 
                  icon: <Hospital className="w-8 h-8" /> 
                },
                { 
                  title: "Industrial & Manufacturing", 
                  desc: "Factory security, asset protection, perimeter defense, and material movement monitoring.", 
                  icon: <Building2 className="w-8 h-8" /> 
                },
                { 
                  title: "Retail & Residential", 
                  desc: "Mall security, loss prevention, residential society guarding with focus on courtesy.", 
                  icon: <Users className="w-8 h-8" /> 
                },
              ].map((sector, idx) => (
                <div 
                  key={idx} 
                  className="p-8 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200 flex gap-6 items-start"
                >
                  <div className="w-16 h-16 shrink-0 rounded-[14px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center text-[#5CC67A] transition-colors duration-200">
                    {sector.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">{sector.title}</h4>
                    <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.65] transition-colors duration-200">{sector.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 relative p-12 md:p-20 rounded-[32px] overflow-hidden bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] transition-colors duration-200">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_500px_400px_at_60%_50%,rgba(92,198,122,.15)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_500px_400px_at_60%_50%,rgba(92,198,122,.08)_0%,transparent_70%)] transition-colors duration-200" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-[#111113]/60 border border-[#5CC67A]/20 dark:border-[#5CC67A]/10 text-[#3daa5e] text-[11px] font-bold tracking-[0.8px] uppercase transition-colors duration-200">
                  <CheckCircle size={14} />
                  Free Security Assessment
                </div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                  Ready to secure your business?
                </h2>
                <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] max-w-xl transition-colors duration-200">
                  Get a customized security plan and quote for your facility. Our team is available 24/7 to assist you.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 bg-[#5CC67A] text-white font-semibold text-base px-8 py-4 rounded-[12px] hover:bg-[#3daa5e] transition-all hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(92,198,122,.35)]"
                >
                  Request Free Assessment <ArrowRight size={18} />
                </Link>
              </div>
              <div className="bg-white/60 dark:bg-[#111113]/60 backdrop-blur-sm p-8 rounded-[24px] border border-white/40 dark:border-[#1e1e24]/40 space-y-6 transition-colors duration-200">
                <div className="w-16 h-16 bg-[#5CC67A] rounded-[16px] flex items-center justify-center text-white shadow-lg">
                  <Phone size={28} />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.3em] transition-colors duration-200">24/7 Support Line</p>
                  <p className="font-['Bricolage_Grotesque',sans-serif] text-[32px] font-extrabold text-[#1A1A18] dark:text-[#f8fafc] tracking-[-1px] transition-colors duration-200">
                    {settings?.contactPhone || '+91 91513 85320'}
                  </p>
                </div>
                <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed pt-4 border-t border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
                  Our security experts are standing by to help you choose the right protection plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

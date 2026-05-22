"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Shield, CheckCircle, Award, Target, Users } from "lucide-react";
import { settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    Promise.all([settingsAPI.get(), bannerAPI.getAll(true, 'About')]).then(([setRes, banRes]) => {
      if (setRes.data) setSettings(setRes.data);
      if (banRes.data && (banRes.data as any[]).length > 0) setBanner((banRes.data as any[])[0]);
    });
  }, []);

  const directorImg = getMediaUrl(settings?.directorImage);
  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
  const heroTitle = banner?.title || "About AimHop";
  const heroSubtitle = banner?.subtitle || "Your trusted security partner since 2020";

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
          <Breadcrumb title="About Us" />

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Who We Are</div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                  Professional security services you can trust
                </h2>
                <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                  AimHop Security Solutions Private Limited is an {settings?.isoCertification || 'ISO 9001:2015'} certified security service provider established in 2020. We specialize in providing comprehensive security solutions across India with trained professionals and modern technology.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-8 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200">
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center text-[#5CC67A] mb-4 transition-colors duration-200">
                    <Target size={24} />
                  </div>
                  <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] mb-2 transition-colors duration-200">Our Mission</h3>
                  <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">
                    To provide efficient, client-specific security solutions at competitive rates while ensuring complete peace of mind.
                  </p>
                </div>
                <div className="p-8 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200">
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center text-[#5CC67A] mb-4 transition-colors duration-200">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] mb-2 transition-colors duration-200">Our Vision</h3>
                  <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">
                    To be India's most reliable and professional security solution provider with pan-India presence.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">Why Choose Us</h3>
                <div className="flex flex-wrap gap-3">
                  {['Professional Staff', 'Quick Response', 'Affordable Rates', 'Reliable Service', 'Daily Reports', 'ISO Certified', 'Experienced Team'].map(feature => (
                    <span key={feature} className="px-4 py-2 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] text-[#1A1A18] dark:text-[#f8fafc] font-semibold text-[12px] rounded-[10px] hover:bg-[#E8F8ED] dark:hover:bg-[#1e3a28] hover:border-[#5CC67A] hover:text-[#3daa5e] dark:hover:text-[#7de09a] transition-all">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] p-10 rounded-[32px] border-[1.5px] border-[#5CC67A]/20 dark:border-[#5CC67A]/10 transition-colors duration-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-[16px] border-2 border-white/60 dark:border-[#1e1e24]/60 overflow-hidden bg-white/40 dark:bg-[#1e1e24]/40 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors duration-200">
                      {directorImg ? (
                        <img src={directorImg} alt="Director" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-['Bricolage_Grotesque',sans-serif] text-[24px] font-extrabold text-[#5CC67A]">OP</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-['Bricolage_Grotesque',sans-serif] text-[20px] font-extrabold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                        {settings?.directorName || 'O.P. Yadav'}
                      </h4>
                      <p className="text-[12px] font-semibold text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">{settings?.directorRole || 'Managing Director'}</p>
                    </div>
                  </div>
                  <blockquote className="text-[18px] font-medium text-[#1A1A18] dark:text-[#f8fafc] leading-relaxed italic transition-colors duration-200">
                    "{settings?.directorMessage || 'Our commitment is to deliver security with discipline and integrity. We aim to keep every client safe with professional service.'}"
                  </blockquote>
                  <div className="pt-6 border-t border-[#5CC67A]/20 dark:border-[#5CC67A]/10">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#5CC67A]" />
                      <span className="text-[11px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.8px] transition-colors duration-200">{settings?.isoCertification || 'ISO 9001:2015'} Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="mt-32 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">How We Work</div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-1.5px] leading-[1.12] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                Our proven process for complete security
              </h2>
              <p className="text-[16.5px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                We follow a systematic approach to ensure your facility gets the best protection.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: "01", title: "Site Assessment", desc: "Our team conducts a thorough security audit of your facility to identify vulnerabilities." },
                { num: "02", title: "Custom Plan", desc: "We design a tailored security strategy that fits your specific requirements and budget." },
                { num: "03", title: "Deployment", desc: "Trained security personnel are deployed with proper equipment and clear instructions." },
                { num: "04", title: "Monitoring", desc: "24/7 supervision and regular reporting ensure consistent quality and quick response." },
              ].map((step) => (
                <div key={step.num} className="p-8 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
                  <span className="absolute -top-6 -right-6 text-[80px] font-['Bricolage_Grotesque',sans-serif] font-extrabold text-[#5CC67A]/5 dark:text-[#5CC67A]/3 transition-colors duration-200">{step.num}</span>
                  <div className="w-10 h-10 rounded-[10px] bg-[#5CC67A] text-white flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold text-[14px] mb-6 shadow-lg relative z-10">
                    {step.num}
                  </div>
                  <h4 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] mb-3 transition-colors duration-200">{step.title}</h4>
                  <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

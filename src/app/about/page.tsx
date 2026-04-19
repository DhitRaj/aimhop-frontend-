"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Shield, CheckCircle2, Award } from "lucide-react";
import { settingsAPI, bannerAPI } from "@/lib/api";
import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";

export function AboutPage() {
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
  const heroSubtitle = banner?.subtitle || "Trusted Security Partner Since 2020";

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
          <Breadcrumb title="Our DNA" />

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                  Decades of <br />
                  <span className="gradient-text">Discipline.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Aimhop Security Solution Private Limited is an ISO 9001:2020 Certified leading Security Service Provider established in 2020. We are defined by a singular focus: Military-grade protection delivered through modern innovation.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-10 bg-card border border-border rounded-[2.5rem] card-hover relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Shield className="w-24 h-24 text-primary group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-primary mb-4">Our Mission</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Efficient client-specific integrated security solutions at the most competitive rates. Peace of mind through total protection of assets.
                  </p>
                </div>
                <div className="p-10 bg-card border border-border rounded-[2.5rem] card-hover relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <CheckCircle2 className="w-24 h-24 text-primary group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-primary mb-4">Our Vision</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    To be the most competent, reliable, and professional pan-India security solution provider in the modern era.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black tracking-[0.3em] uppercase opacity-30">The AimHop Edge</h3>
                <div className="flex flex-wrap gap-4">
                  {['Professional Staff', 'Prompt Response', 'Affordable', 'Reliable', 'Daily Reports', 'ISO Certified', 'Ex-Army Leadership'].map(feature => (
                    <span key={feature} className="px-5 py-3 bg-muted border border-border text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all cursor-default">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-32 space-y-10">
              <div className="bg-primary p-12 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-primary/20">
                <Shield className="absolute -right-12 -bottom-12 w-48 h-48 text-white/10" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] border-4 border-white/20 overflow-hidden bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-white text-3xl shadow-xl">
                      {directorImg ? <img src={directorImg} alt="Director" className="w-full h-full object-cover" /> : 'OP'}
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">
                          {settings?.directorName || 'O.P. YADAV'}
                       </h4>
                       <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{settings?.directorRole || 'Managing Director'}</p>
                    </div>
                  </div>
                  <blockquote className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight uppercase">
                    "{settings?.directorMessage || 'Our goal is to keep every Indian safe. We deliver security with discipline and integrity.'}"
                  </blockquote>
                  <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center gap-4">
                       <Award className="w-6 h-6 text-white/40" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Elite Security Leadership Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STRATEGIC PROCESS SECTION - Increasing Content Depth */}
          <div className="mt-40 space-y-24">
             <div className="text-center max-w-3xl mx-auto space-y-6">
                <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-primary">Operational Protocol</h3>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                   Tactical <br />
                   <span className="gradient-text">Deployment Roadmap.</span>
                </h2>
                <p className="text-muted-foreground font-medium text-lg">Our proven 4-stage methodology ensures zero-gap protection for every client asset.</p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { n: "01", t: "Intelligence Audit", d: "Ex-army specialists conduct a 360-degree vulnerability assessment of your facility." },
                  { n: "02", t: "Custom Strategy", d: "We design a tailored security protocol integrating guarding and electronic surveillance." },
                  { n: "03", t: "Elite Deployment", d: "ISO-certified personnel are deployed with field-ready equipment and tactical briefs." },
                  { n: "04", t: "Command Monitoring", d: "24/7 oversight via our remote hub ensures continuous performance and rapid response." },
                ].map((step, i) => (
                  <div key={step.n} className="p-10 bg-card border border-border rounded-[3rem] card-hover relative overflow-hidden group">
                     <span className="absolute -top-4 -right-4 text-8xl font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">{step.n}</span>
                     <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs mb-8 shadow-xl shadow-primary/20">
                        {step.n}
                     </div>
                     <h4 className="text-xl font-black uppercase tracking-tight mb-4">{step.t}</h4>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.d}</p>
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

export default AboutPage;

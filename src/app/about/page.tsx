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
      if (banRes.data && banRes.data.length > 0) setBanner(banRes.data[0]);
    });
  }, []);

  const directorImg = getMediaUrl(settings?.directorImage);
  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
  const heroTitle = banner?.title || "About AimHop";
  const heroSubtitle = banner?.subtitle || "Trusted Security Partner Since 2020";

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <Navbar />

      <main className="pb-20">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          backgroundImage={heroImg}
        />

        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb title="About Us" />

          <div className="grid lg:grid-cols-2 gap-16 items-start mt-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                  Company Profile
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Aimhop Security Solution Private Limited is an ISO 9001:2020 Certified leading Security Service Provider established in 2020. The company has expanded at a compound annual growth over the last year. We provide manpower services in strict accordance with physical, educational &amp; medical standards. The company is committed to providing customized site-specific training through an experienced training team as per the training syllabus of the Private Securities Regulation Act 2005.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Shield className="w-24 h-24 text-sky-600 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <h3 className="relative z-10 text-xl font-black tracking-tight uppercase text-sky-600 mb-3">Our Mission</h3>
                  <p className="relative z-10 text-sm font-medium text-slate-500 leading-relaxed">
                    It is our mission to provide efficient client-specific and customized integrated security solutions at the most competitive rates. We are committed to ensuring peace of mind to our clients by providing the highest level of protection to their assets while maintaining business ethics. We are maintaining a safe & secure environment by adopting the best practices of the security industry.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <CheckCircle2 className="w-24 h-24 text-sky-600 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <h3 className="relative z-10 text-xl font-black tracking-tight uppercase text-sky-600 mb-3">Our Vision</h3>
                  <p className="relative z-10 text-sm font-medium text-slate-500 leading-relaxed">
                    The vision of AIMHOP SECURITY SOLUTION PVT. LTD. is to be the most competent, reliable and professional pan-India security solution provider.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black tracking-tight uppercase">Key Features</h3>
                <div className="flex flex-wrap gap-3">
                  {['Professional Staff', 'Excellent Customer Service', 'Affordable', 'Reliable', 'Day to day updates & Reports', 'Prompt Response', 'Staff Training & Development', 'Feedback & Suggestions', 'Wide Spread Network', 'Leadership'].map(feature => (
                    <span key={feature} className="px-4 py-2 bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-sky-100 dark:border-slate-700">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8 bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-5 text-center sm:text-left">
                <h3 className="text-2xl font-black tracking-tight uppercase text-center sm:text-left mb-6">Director's Message</h3>
                <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center relative">
                  {directorImg ? (
                    <SafeImage src={directorImg} alt="Director" fill className="w-full h-full object-cover" />
                  ) : (
                    <Award size={80} className="text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <div className="space-y-1 pt-4">
                  <h4 className="text-2xl font-black uppercase text-sky-600 tracking-tighter">
                    {settings?.directorName || 'O.P. YADAV (Ex. Army)'}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chief Managing Director</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic text-lg leading-snug">
                  "{settings?.directorMessage || 'Our goal is to keep every Indian safe.'}"
                </p>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center sm:justify-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-sky-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[9px] text-slate-500">Security Leadership Certified</span>
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

export default AboutPage;

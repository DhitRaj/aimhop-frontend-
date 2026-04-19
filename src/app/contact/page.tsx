import { Suspense } from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: 'Contact AimHop Security | 24/7 Security Support in Gorakhpur & PAN India',
  description: 'Connect with AimHop Security for professional security guard services, bouncers, and facility management. Available 24/7 in Gorakhpur, Lucknow, and all major cities.',
  keywords: 'AimHop Contact, Security Guard Service Gorakhpur, Hire Bouncers Lucknow, Best Security Agency, AimHop Customer Care',
};

async function getContactData() {
  const [settingsRes, bannersRes] = await Promise.all([
    settingsAPI.get(),
    bannerAPI.getAll(true, 'Contact')
  ]);
  const activeBanners = bannersRes.data || [];
  
  return { 
    settings: settingsRes.data || null,
    banner: activeBanners[0] || null
  };
}

export default async function ContactPage() {
  const { settings, banner } = await getContactData();

  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
  const heroTitle = banner?.title || "Contact Us";
  const heroSubtitle = banner?.subtitle || "We are available 24/7 — Call or message anytime";

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
          <Breadcrumb title="Get In Touch" />

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            {/* Left: Contact Info */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                  Talk to Our <br />
                  <span className="gradient-text">Experts.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                  Whether you need strategic guarding, electronic surveillance, or a custom security audit, our specialized team is standing by 24/7.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { t: "Direct Line", v: settings?.contactPhone || '+91 91513 85320', i: <Phone size={24} />, desc: "24/7 Emergency Response" },
                  { t: "Official Email", v: settings?.contactEmail || "info@aimhop.com", i: <Mail size={24} />, desc: "Quotes & Proposals" },
                  { t: "Headquarters", v: settings?.address || "Gorakhpur, UP", i: <MapPin size={24} />, desc: "Main Operations Center" },
                  { t: "Availability", v: "Always Open", i: <Clock size={24} />, desc: "365 Days a Year" }
                ].map(item => (
                  <div key={item.t} className="p-8 bg-card border border-border rounded-[2.5rem] card-hover group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      {item.i}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.t}</p>
                      <p className="text-lg font-black tracking-tight leading-tight break-words">{item.v}</p>

                      <p className="text-xs font-medium text-muted-foreground mt-2 opacity-60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                 <Shield className="absolute -right-8 -bottom-8 w-32 h-32 text-primary/5 group-hover:scale-110 transition-transform" />
                 <div className="bg-primary p-5 rounded-2xl text-white shadow-xl">
                    <Clock size={32} />
                 </div>
                 <div className="relative z-10 text-center md:text-left">
                   <h5 className="font-black text-xl uppercase tracking-tighter">Instant Support Guarantee</h5>
                   <p className="text-sm font-medium text-muted-foreground mt-1 max-w-sm">
                      We respond to all critical security inquiries within 15 minutes.
                   </p>
                 </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:sticky lg:top-32">
               <Suspense fallback={<div className="p-8 h-96 bg-card rounded-[2.5rem] animate-pulse" />}>
                 <ContactForm />
               </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

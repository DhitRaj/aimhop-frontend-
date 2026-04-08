import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Contact AimHop Security | 24/7 Security Support in Gorakhpur & PAN India',
  description: 'Connect with AimHop Security for professional security guard services, bouncers, and facility management. Available 24/7 in Gorakhpur, Lucknow, and all major cities.',
  keywords: 'AimHop Contact, Security Guard Service Gorakhpur, Hire Bouncers Lucknow, Best Security Agency, AimHop Customer Care',
};

async function getSettings() {
  const res = await settingsAPI.get();
  return res.data || null;
}

export default async function ContactPage() {
  const settings = await getSettings();
  // API_BASE removed in favor of getMediaUrl utility

  const heroImg = getMediaUrl(settings?.heroImage);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <section className="relative h-[320px] md:h-[400px] mb-16 bg-slate-950 rounded-b-[3rem] overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          {heroImg && (
            <Image 
              src={heroImg} 
              alt="Security Support Background" 
              fill
              className="object-cover object-center opacity-70" 
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-10 text-center space-y-3 px-6">
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-2xl">
              Contact Us
            </h1>
            <p className="text-sky-400 font-bold uppercase tracking-widest text-sm">We&apos;re available 24/7 — Call or message anytime</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb title="Contact Us" />

          <div className="grid lg:grid-cols-2 gap-16 mt-14 items-stretch">
            {/* Left: Contact Info */}
            <div className="space-y-10">
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight uppercase leading-tight">
                  Talk to Us —<br /><span className="text-sky-600">We are Here.</span>
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">For any security needs — whether you need guards, CCTV installation, or have an inquiry — call or message us for a quick response.</p>
              </div>

              <div className="space-y-6">
                {[
                  { t: "Call Us Anytime", v: `${settings?.contactPhone || '+91 91513 85320'} ${settings?.contactPhone2 ? ' / ' + settings.contactPhone2 : ''}`, i: <Phone />, desc: "Available 24/7 — talk directly to our experts" },
                  { t: "Email Us", v: settings?.contactEmail || "aimhopgroup@gmail.com", i: <Mail />, desc: "Send an email for inquiries or quotes" },
                  { t: "Our Office", v: settings?.address || "Gorakhpur (U.P) 273010", i: <MapPin />, desc: "Visit us — you are always welcome at our office" },
                  { t: "Other Locations", v: "Delhi | Mumbai | Lucknow | Gujarat", i: <MapPin />, desc: "We operate in your city too" }
                ].map(item => (
                  <div key={item.t} className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600/10 border border-sky-400/20 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm shrink-0">
                      {item.i}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{item.t}</p>
                      <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white">{item.v}</p>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-800 flex items-center gap-5">
                <Clock className="w-8 h-8 text-sky-600 shrink-0" />
                <div>
                  <h5 className="font-black text-base uppercase tracking-tight">Response Guarantee</h5>
                  <p className="text-sm font-medium text-slate-500 mt-1">We are available 24/7, 365 days a year — ready whenever you need us.</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

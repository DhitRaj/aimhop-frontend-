import { Suspense } from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: 'Contact AimHop Security | 24/7 Security Support',
  description: 'Connect with AimHop Security for professional security services. Available 24/7 across India.',
  keywords: 'AimHop Contact, Security Services, Hire Security Guards, Best Security Agency',
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
  const heroTitle = banner?.title || "Get In Touch";
  const heroSubtitle = banner?.subtitle || "We're available 24/7 to assist you with your security needs";

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
          <Breadcrumb title="Contact Us" />

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left: Contact Info */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Get In Touch</div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                  Talk to our security experts
                </h2>
                <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                  Whether you need security guards, surveillance systems, or a custom security plan, our team is ready to help 24/7.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { 
                    title: "Phone", 
                    value: settings?.contactPhone || '+91 91513 85320', 
                    icon: <Phone size={20} />, 
                    desc: "24/7 Support" 
                  },
                  { 
                    title: "Email", 
                    value: settings?.contactEmail || "info@aimhop.com", 
                    icon: <Mail size={20} />, 
                    desc: "Quick Response" 
                  },
                  { 
                    title: "Location", 
                    value: settings?.address || "Gorakhpur, UP", 
                    icon: <MapPin size={20} />, 
                    desc: "Head Office" 
                  },
                  { 
                    title: "Hours", 
                    value: "24/7 Available", 
                    icon: <Clock size={20} />, 
                    desc: "Always Open" 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200">
                    <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center text-[#5CC67A] mb-4 transition-colors duration-200">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">{item.title}</p>
                      <p className="text-[15px] font-bold text-[#1A1A18] dark:text-[#f8fafc] leading-tight break-words transition-colors duration-200">{item.value}</p>
                      <p className="text-[12px] text-[#6B7068] dark:text-[#94a3b8] mt-1.5 transition-colors duration-200">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] rounded-[20px] border-[1.5px] border-[#5CC67A]/20 dark:border-[#5CC67A]/10 flex items-center gap-6 transition-colors duration-200">
                <div className="bg-[#5CC67A] p-4 rounded-[14px] text-white shadow-lg">
                  <Clock size={28} />
                </div>
                <div>
                  <h5 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">Quick Response Guarantee</h5>
                  <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] mt-1 transition-colors duration-200">
                    We respond to all inquiries within 15 minutes during business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:sticky lg:top-32">
              <Suspense fallback={
                <div className="bg-white p-8 rounded-[32px] border-[1.5px] border-[#E8E8E4] h-[500px] animate-pulse"></div>
              }>
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

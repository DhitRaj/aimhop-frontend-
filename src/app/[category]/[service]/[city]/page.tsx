import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, CheckCircle2, HelpCircle, ArrowRight, UserCheck, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

const serviceNames: Record<string, string> = {
  "armed-security-guard": "Armed Security Guard",
  "unarmed-security-guard": "Unarmed Security Guard",
  "corporate-security": "Corporate Security",
  "event-security": "Event Security",
  "bouncers-vip-protection": "Bouncer / VIP Protection",
  "cctv-monitoring-qrt": "CCTV Monitoring / QRT",
  "housekeeping-staff": "Housekeeping Staff",
  "office-boy-peon": "Office Boy / Peon",
  "labour-factory-workers": "Labour / Factory Workers",
  "driver-personal-corporate": "Driver (Personal & Corporate)",
  "electrician-plumber": "Electrician / Plumber",
  "warehouse-packing-staff": "Warehouse / Packing Staff"
};

const getServiceName = (slug: string) => {
  return serviceNames[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const getCityName = (slug: string) => {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

interface PageProps {
  params: Promise<{
    category: string;
    service: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getServiceName(serviceSlug);
  const city = getCityName(citySlug);
  return {
    title: `Hire ${service} in ${city} | AimHop`,
    description: `Deploy verified, trained ${service} services in ${city}. 100% police checked, PSARA compliant, and backed by 48hr SLA deployment guarantee.`
  };
}

export default async function ServiceCityLandingPage({ params }: PageProps) {
  const { category, service: serviceSlug, city: citySlug } = await params;
  const service = getServiceName(serviceSlug);
  const city = getCityName(citySlug);
  const isSecurity = category.toLowerCase() === "security";

  const features = isSecurity
    ? [
        "Police-verified and background-checked guards with active Aadhaar validation.",
        "Fully compliant with PSARA regulations and local state laws.",
        "24/7 supervisor check-ins and emergency Quick Response Team (QRT) support."
      ]
    : [
        "Trained, experienced staff matching corporate, warehousing, or event protocols.",
        "100% compliant with minimum wage acts, ESIC, and EPF filings.",
        "Selfie attendance tracking mapped to GPS limits to prevent proxy attendance."
      ];

  const faqs = [
    {
      q: `How long does it take to deploy a ${service} in ${city}?`,
      a: `Typically, we deploy verified workers within 48 hours of service agreement signing. Emergency cases can be processed even faster through our Priority Team.`
    },
    {
      q: `Are the ${service} workers police verified?`,
      a: `Yes, every worker on our platform undergoes strict Aadhaar validation and local police verification before being deployed at your site in ${city}.`
    },
    {
      q: `What happens if a deployed ${service} goes on leave?`,
      a: `AimHop maintains a standby bench. We guarantee a replacement worker within 4 hours if any deployed worker goes on leave.`
    },
    {
      q: `Is there a minimum contract duration for hiring in ${city}?`,
      a: `We support both short-term event-based deployments and long-term contracts. There is no rigid minimum duration, but rates vary based on contract scale.`
    },
    {
      q: "How is attendance and invoicing managed?",
      a: "Workers use our selfie-based GPS app to clock in and out. Invoices are generated monthly based on exact verified attendance hours, making billing 100% transparent."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 md:p-12 mb-10 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#10B981] uppercase tracking-widest font-mono">
              AimHop De-risked Hiring
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4 font-display">
              Premium {service} Services in {city}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              Verified, Trained {service} in {city}. PSARA compliant, 48hr deployment guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/hire?category=${category}&role=${encodeURIComponent(service)}&city=${encodeURIComponent(city)}`}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                Hire Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/jobs/apply"
                className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                Get Job <UserCheck className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 md:p-12 mb-10 shadow-sm">
            <h3 className="text-xl font-bold mb-6 font-display">Compliance & Tracking Included</h3>
            <div className="space-y-4">
              {features.map((feat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 bg-emerald-500/10 dark:bg-emerald-500/5 p-1 rounded-md h-fit text-[#10B981]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 md:p-12 mb-10 shadow-sm">
            <h3 className="text-xl font-bold mb-6 font-display">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="pb-6 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                  <div className="flex gap-3 mb-2">
                    <HelpCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <h4 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100">{faq.q}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Quick-Call Section */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold font-display">Need a custom enterprise quote?</h4>
              <p className="text-slate-400 text-xs md:text-sm mt-1">Our deployment manager will call you back within 15 minutes.</p>
            </div>
            <a href="tel:9151385320" className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-lg text-sm transition-colors">
              <Phone className="w-4 h-4" /> Call 9151385320
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

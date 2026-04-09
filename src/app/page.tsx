import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import {
  Shield,
  Camera,
  Users,
  Clock,
  ArrowRight,
  Globe,
  Award,
  Zap,
  Phone,
  Building2,
  Star,
  CheckCircle,
  MapPin,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import { statsAPI, serviceAPI, settingsAPI, clientAPI, testimonialAPI, bannerAPI } from "@/lib/api";
import { ServiceSkeleton, TestimonialSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const IconMap: any = {
  Shield: <Shield className="w-8 h-8" />,
  Camera: <Camera className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
};

const getRatingColor = (r: number) => {
  if (r <= 2) return "text-orange-500";
  if (r === 3) return "text-amber-500";
  if (r === 4) return "text-lime-500";
  return "text-emerald-500";
};

async function getHomeData() {
  const [statsRes, servicesRes, settingsRes, clientsRes, testimonialsRes, bannersRes] = await Promise.all([
    statsAPI.get(),
    serviceAPI.getAll(),
    settingsAPI.get(),
    clientAPI.getAll(),
    testimonialAPI.getAll(),
    bannerAPI.getAll(true, 'Home')
  ]);
  return {
    stats: statsRes.data || null,
    services: servicesRes.data?.slice(0, 3) || [],
    settings: settingsRes.data || null,
    clients: clientsRes.data || [],
    testimonials: testimonialsRes.data?.slice(0, 2) || [],
    banners: bannersRes.data || []
  };
}

export default async function HomePage() {
  const { services, settings, testimonials, banners } = await getHomeData();

  const directorImg = getMediaUrl(settings?.directorImage);
  const activeBanner = banners.length > 0 ? banners[0] : null;
  const heroImg = getMediaUrl(activeBanner?.image || settings?.heroImage);
  const heroTitle = activeBanner?.title || settings?.heroTitle || "Security You Can Always Trust.";
  const heroSubtitle = activeBanner?.subtitle || settings?.heroSubtitle || "AimHop Security Solutions Pvt. Ltd. — India's trusted security company.";

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: settings?.feature1Title || "Experienced Staff",
      desc: settings?.feature1Desc || "We have experienced professionals who can easily understand our clients' requirements.",
      color: "sky"
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: settings?.feature2Title || "Top-Tier Quality",
      desc: settings?.feature2Desc || "Our no-compromise approach to quality ensures that our solutions are user-friendly forever.",
      color: "sky",
      highlight: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: settings?.feature3Title || "Affordable",
      desc: settings?.feature3Desc || "We provide cost-effective solutions without compromising on the security standards.",
      color: "sky"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      desc: "Round-the-clock emergency response and client support team ready whenever you need.",
      color: "sky"
    },
  ];

  return (
    <div className="font-sans overflow-x-hidden bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[600px] md:min-h-[700px] flex items-center pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImg ? (
              <img src={heroImg} alt="Hero" className="w-full h-full object-cover object-center" />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-900 bg-gradient-to-br from-slate-100 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950 transition-colors duration-500" />
            )}
            {/* Adaptive Overlay — Airy for Light Mode, Cinematic for Dark Mode */}
            <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/70 transition-colors duration-500" />
            
            {/* Subtle bottom fade to transition to white page */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent transition-colors duration-500" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-4">
                <p className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-[0.3em] text-xs">
                  AimHop Security Pvt. Ltd.
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
                  {heroTitle}
                </h1>
                <p className="text-sm md:text-xl text-slate-600 dark:text-slate-100 font-medium opacity-90 leading-relaxed max-w-xl transition-colors">
                  {heroSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <WhatsAppModal>
                  <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-xl shadow-sky-600/20">
                    Get Free Quote
                  </button>
                </WhatsAppModal>
                <a 
                  href={`tel:${settings?.contactPhone || '9151385320'}`} 
                  className="bg-white/90 dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white px-8 py-3 rounded-full font-bold text-sm transition-all"
                >
                  Call Now
                </a>
              </div>

              {/* Trust indicators — Enhanced visibility with glassmorphism containers */}
              <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-10 border-t border-slate-200 dark:border-white/10">
                {[
                  { val: settings?.statsClients || '1200+', label: 'Clients' },
                  { val: settings?.statsGuards || '5000+', label: 'Guards' },
                  { val: settings?.statsExperience || '5+', label: 'Years' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/40 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{s.val}</p>
                    <p className="text-[9px] md:text-[10px] text-sky-600 dark:text-sky-400 font-black uppercase tracking-[0.2em] mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="relative z-10 -mt-1 bg-white dark:bg-slate-950 py-16 border-b border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Why Choose AimHop</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                Built on Trust, Delivered with Excellence
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    f.highlight
                      ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-600/25'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-700'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform group-hover:scale-110 ${
                    f.highlight ? 'bg-white/20 text-white' : 'bg-sky-50 dark:bg-slate-800 text-sky-600'
                  }`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${f.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${f.highlight ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {f.desc}
                  </p>
                  {f.highlight && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">What We Offer</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Our Security <span className="text-sky-600">Services</span>
                </h2>
                <p className="text-sm text-slate-500 max-w-sm">Comprehensive security solutions designed to protect your people, assets, and premises.</p>
              </div>
              <Link href="/services" className="shrink-0 inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<ServiceSkeleton />}>
                {(services || []).map((s: any) => (
                  <div key={s._id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:shadow-xl transition-all flex flex-col">
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {s.image ? (
                        <img src={getMediaUrl(s.image)} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sky-600 bg-gradient-to-br from-sky-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                          {IconMap[s.icon] || <Shield className="w-12 h-12" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="p-5 flex flex-col flex-grow space-y-3">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">{s.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-grow">{s.description}</p>
                      <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                        Learn More <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </Suspense>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-sky-600 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { val: settings?.statsClients || '1200+', label: 'Happy Clients', icon: <Users className="w-5 h-5 mx-auto mb-2 opacity-70" /> },
              { val: settings?.statsGuards || '5000+', label: 'Trained Guards', icon: <Shield className="w-5 h-5 mx-auto mb-2 opacity-70" /> },
              { val: settings?.statsServiceArea || 'Pan-India', label: 'Service Area', icon: <Globe className="w-5 h-5 mx-auto mb-2 opacity-70" /> },
              { val: settings?.statsYears || '5+', label: 'Years Experience', icon: <Award className="w-5 h-5 mx-auto mb-2 opacity-70" /> },
            ].map((s) => (
              <div key={s.label}>
                {s.icon}
                <p className="text-3xl font-black">{s.val}</p>
                <p className="text-sm font-semibold text-white/75 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">About AimHop</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                We Are Present<br />
                <span className="text-sky-600">Across India.</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md pl-4 border-l-2 border-sky-600">
                Started in Gorakhpur, UP — growing fast with presence in New Delhi, Lucknow, and more cities. Trusted by banks, hospitals, factories, and government offices.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <MapPin className="w-4 h-4 text-sky-600" />, val: settings?.statsServiceArea || 'Pan-India', label: 'Coverage' },
                  { icon: <Shield className="w-4 h-4 text-sky-600" />, val: settings?.statsGuards || '5000+', label: 'Trained Guards' },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm">{s.icon}</div>
                    <div>
                      <p className="font-black text-base text-slate-900 dark:text-white">{s.val}</p>
                      <p className="text-xs text-slate-500 font-semibold uppercase">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-sky-600/20">
                Our Story <ArrowRight size={15} />
              </Link>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 rounded-xl bg-sky-600 overflow-hidden relative shadow-md flex items-center justify-center font-black text-white text-xl">
                  {directorImg ? <Image src={directorImg} alt="Director" fill className="object-cover" /> : 'OP'}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase">{settings?.directorName || 'O.P. YADAV'}</h4>
                  <p className="text-xs text-sky-600 font-bold uppercase tracking-wider">Chief Managing Director</p>
                  <p className="text-xs text-slate-400 mt-0.5">Ex-Army Officer</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "{settings?.directorMessage || 'Our goal is to keep every Indian safe. We deliver security with discipline, integrity, and professionalism.'}"
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {['ISO Certified', 'Govt. Registered', 'PAN India'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />{badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-2 mb-12">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Client Reviews</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">What Our Clients Say</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Suspense fallback={<TestimonialSkeleton />}>
                  {testimonials.map((t: any) => (
                    <div key={t._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-7 space-y-4 hover:shadow-md transition-all">
                      <div className={`flex gap-0.5 ${getRatingColor(t.rating || 5)}`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"{t.message}"</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 font-bold text-sm">{(t.name || 'U').charAt(0)}</div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{t.name || 'Client'}</h4>
                          <p className="text-xs text-slate-500">{t.role || 'Verified Client'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          </section>
        )}

        {/* CTA CONTACT */}
        <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Contact Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Need Security?<br />We Are Here 24/7.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                Get in touch for security guards, CCTV installations, bouncers, or any custom security requirement.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-md shadow-sky-600/20">
                  Get a Free Quote
                </Link>
                {settings?.ctaSafetyAuditEnabled !== false && (
                  <WhatsAppModal>
                    <button className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-lg font-semibold text-sm hover:-translate-y-0.5 transition-all flex items-center gap-2">
                       Free Site Audit <Shield size={14} className="text-sky-600" />
                    </button>
                  </WhatsAppModal>
                )}
                <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-lg font-semibold text-sm hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <Phone size={14} className="text-sky-600" /> Call Us
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 dark:border-slate-700 shadow-md">
              {heroImg ? (
                <img src={heroImg} alt="Security Team" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white dark:border-slate-700 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Available 24/7</p>
                    <p className="text-xs text-slate-500">{settings?.contactPhone || '+91 91513 85320'}</p>
                  </div>
                  <Award className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

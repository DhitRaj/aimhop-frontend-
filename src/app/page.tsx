import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import {
  Shield,
  Camera,
  Users,
  Clock,
  ArrowRight,
  ChevronRight,
  Globe,
  Award,
  Zap,
  Phone,
  Building2,
  MessageSquare,
  Star
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
  if (r === 1) return "text-rose-500";
  if (r === 2) return "text-orange-500";
  if (r === 3) return "text-amber-500";
  if (r === 4) return "text-lime-500";
  return "text-emerald-500";
};

// Data Fetching (Replaces useEffect/Client-side fetch)
async function getHomeData() {
  const [statsRes, servicesRes, settingsRes, clientsRes, testimonialsRes, bannersRes] = await Promise.all([
    statsAPI.get(),
    serviceAPI.getAll(),
    settingsAPI.get(),
    clientAPI.getAll(),
    testimonialAPI.getAll(),
    bannerAPI.getAll(true) // Get only active banners
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
  const { stats, services, settings, clients, testimonials, banners } = await getHomeData();

  const directorImg = getMediaUrl(settings?.directorImage);
  
  // Use the first active banner if available, otherwise fallback to settings hero image
  const activeBanner = banners.length > 0 ? banners[0] : null;
  const heroImg = getMediaUrl(activeBanner?.image || settings?.heroImage);
  const heroTitle = activeBanner?.title || settings?.heroTitle || "Security You Can Always Trust.";
  const heroSubtitle = activeBanner?.subtitle || settings?.heroSubtitle || "AimHop Security Solutions Pvt. Ltd. — India's trusted security company.";

  return (
    <div className="selection:bg-sky-600 selection:text-white scroll-smooth cursor-default font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section id="home" className="relative h-[600px] md:h-[680px] bg-slate-100 dark:bg-slate-950 flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {heroImg ? (
              <SafeImage 
                src={heroImg} 
                alt="Background" 
                fill
                priority
                className="w-full h-full object-cover object-center opacity-50 dark:opacity-40" 
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-900" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-950 via-white/70 dark:via-slate-950/70 to-transparent z-[1]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-xl border border-sky-200 dark:border-sky-800 font-bold text-xs uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-1000">
                <Shield className="w-4 h-4" /> Registered Pvt. Ltd · {settings?.address?.split(',')[0] || 'Gorakhpur, UP'}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] md:leading-tight uppercase">
                {heroTitle}
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <WhatsAppModal>
                  <button className="bg-slate-900 dark:bg-sky-600 text-white dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto">
                    Contact Us Now <ArrowRight size={16} />
                  </button>
                </WhatsAppModal>
                {settings?.ctaBrochureEnabled !== false && (
                  <a 
                    href={getMediaUrl(settings?.brochureUrl)} 
                    download 
                    className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Download Brochure <Shield size={16} className="text-sky-600" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-300 dark:bg-slate-700 shadow-lg" />)}
                </div>
                <p className="text-sm font-bold text-slate-500">
                  <span className="text-slate-900 dark:text-white">{settings?.statsClients || '1200+'} clients</span> trust us across India
                </p>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="hidden lg:grid grid-cols-2 gap-5 relative animate-in fade-in slide-in-from-right-4 duration-1000">
              <div className="absolute -inset-10 bg-sky-500/10 blur-[100px] rounded-full z-[-1]" />
              <div className="space-y-5 pt-10">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 group hover:border-sky-500 transition-colors">
                  {settings?.feature1Icon ? (
                    <div className="w-12 h-12 mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">
                      <SafeImage 
                        src={getMediaUrl(settings.feature1Icon)} 
                        alt="Feature 1" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <Users className="w-10 h-10 text-sky-600 mb-4 group-hover:scale-110 transition-transform" />
                  )}
                  <h4 className="font-black text-lg tracking-tight text-slate-900 dark:text-white uppercase mb-1">{settings?.feature1Title || 'Experienced Staff'}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{settings?.feature1Desc || 'We have experienced professionals who can easily understand our clients requirements.'}</p>
                </div>
                <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl shadow-xl text-white outline outline-1 outline-slate-800 hover:outline-sky-500 transition-colors">
                  {settings?.feature2Icon ? (
                    <div className="w-12 h-12 mb-4 rounded-xl overflow-hidden border border-white/10 relative">
                      <SafeImage 
                        src={getMediaUrl(settings.feature2Icon)} 
                        alt="Feature 2" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <Star className="w-10 h-10 text-sky-400 mb-4 animate-pulse" />
                  )}
                  <h4 className="font-black text-lg tracking-tight text-white uppercase mb-1">{settings?.feature2Title || 'Top - Tier Quality'}</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{settings?.feature2Desc || 'Our no compromise approach to quality ensures that our solutions are user friendly forever.'}</p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 h-[calc(100%-1.25rem)] flex flex-col justify-center group hover:border-sky-500 transition-colors">
                  {settings?.feature3Icon ? (
                    <div className="w-14 h-14 mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">
                      <SafeImage 
                        src={getMediaUrl(settings.feature3Icon)} 
                        alt="Feature 3" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <Zap className="w-12 h-12 text-sky-600 mb-4 group-hover:scale-110 transition-transform" />
                  )}
                  <h4 className="font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase mb-2">{settings?.feature3Title || 'Affordable'}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{settings?.feature3Desc || 'We provide cost-effective solutions without compromising on the security standards.'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-4 py-2 rounded-full border border-sky-100 dark:border-sky-800 font-black text-[10px] uppercase tracking-[0.2em]">
                  Elite Services
                </div>
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-[0.9]">
                  Security <span className="text-sky-600">Excellence</span>
                </h2>
                <p className="text-slate-500 font-medium max-w-md">Our premium security solutions tailored for your absolute peace of mind.</p>
              </div>
              <Link href="/services" className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Explore All <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Suspense fallback={<ServiceSkeleton />}>
                {(services.length > 0 ? services : []).map((s: any) => (
                  <div key={s._id} className="group relative bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                    <div className="relative h-56 overflow-hidden">
                      {s.image ? (
                        <SafeImage
                          src={getMediaUrl(s.image)}
                          alt={s.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-sky-600">
                          {IconMap[s.icon] || <Shield className="w-16 h-16" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        {IconMap[s.icon] || <Shield className="w-6 h-6" />}
                      </div>
                    </div>

                    <div className="p-10 space-y-4 flex-grow flex flex-col">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-sky-600 transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm line-clamp-3">
                        {s.description || 'Quality security services tailored to your needs.'}
                      </p>
                      <div className="mt-auto pt-6">
                        <Link href="/services" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 group-hover:translate-x-2 transition-all">
                          Deep Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Suspense>
            </div>
          </div>
        </section>

        {/* National Presence Section DYNAMIC */}
        <section className="py-24 bg-slate-900 text-white rounded-[3rem] mx-4 mb-24 relative overflow-hidden">
          <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-white/5 animate-pulse" />
          <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight">We Are Present<br />Across India.</h2>
              <p className="text-base text-slate-400 font-medium leading-relaxed max-w-md border-l-4 border-sky-600 pl-6">
                Started in Gorakhpur, UP — and growing fast with offices in New Delhi, Lucknow, and more cities.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-black text-xl uppercase tracking-tight mb-1">{settings?.statsServiceArea || 'Pan-India'}</h5>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trusted Everywhere</p>
                </div>
                <div>
                  <h5 className="font-black text-xl uppercase tracking-tight mb-1">{settings?.statsGuards || '5000+'} Guards</h5>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trained Force</p>
                </div>
              </div>
              <Link href="/about" className="inline-flex bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all">Our Story</Link>
            </div>
            <div className="space-y-6 bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-black tracking-tight uppercase">Director's Vision</h3>
              <p className="text-base text-slate-300 font-medium italic leading-loose">
                "{settings?.directorMessage || 'Our goal is to keep every Indian safe.'}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-sky-600 overflow-hidden shadow-lg border-2 border-white/20 flex items-center justify-center text-white font-black relative">
                  {directorImg ? (
                    <Image src={directorImg} alt="Director" fill className="object-cover" />
                  ) : (
                    "OY"
                  )}
                </div>
                <div>
                  <p className="font-black text-base uppercase leading-none">{settings?.directorName || 'O.P. YADAV'}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mt-1">Chief Managing Director</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section (DYNAMIC) */}
        {testimonials.length > 0 && (
          <section className="py-24 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center space-y-3 mb-16">
                <p className="text-xs font-bold text-sky-600 uppercase tracking-widest leading-none">Global Trust</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">What Our Clients<br />Say About Us</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Suspense fallback={<TestimonialSkeleton />}>
                  {testimonials.map((t: any) => (
                    <div key={t._id} className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 relative group overflow-hidden">
                      <div className={`flex items-center gap-1 mb-4 ${getRatingColor(t.rating || 5)}`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed relative z-10">"{t.message}"</p>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-black text-lg uppercase shadow-lg shadow-sky-600/20">{(t.name || 'U').charAt(0)}</div>
                        <div>
                          <h4 className="font-black text-base uppercase leading-none text-slate-900 dark:text-white">{t.name || 'User'}</h4>
                          <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1.5">{t.role || 'Client'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          </section>
        )}

        {/* CTA Contact */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight text-slate-900 dark:text-white">
                Need Security?<br />Call Us Today.
              </h2>
              <p className="text-base text-slate-500 font-medium max-w-sm italic">
                Our team is available 24 hours a day to help you with security guards, CCTV, or any other service.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/contact" className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all">Get a Free Quote</Link>
                {settings?.ctaSafetyAuditEnabled !== false && (
                  <WhatsAppModal>
                    <button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                       Free Audit <Shield size={16} className="text-sky-600" />
                    </button>
                  </WhatsAppModal>
                )}
                <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">Call Us <Phone className="w-4 h-4" /></a>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-4 bg-sky-600/5 blur-[80px] rounded-full group-hover:bg-sky-600/20 transition-all duration-1000" />
              <div className="relative rounded-3xl shadow-2xl overflow-hidden aspect-[4/3]">
                {heroImg ? (
                  <Image src={heroImg} alt="Security Team" fill className="grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800">
                    <Shield className="w-20 h-20 text-slate-300 dark:text-slate-800" />
                  </div>
                )}
              </div>
              <div className="absolute top-6 right-6 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl animate-bounce">
                <Award className="w-8 h-8 text-sky-600 mb-2" />
                <p className="text-lg font-black tracking-tight uppercase">5+ Years</p>
                <p className="text-xs font-bold uppercase text-slate-400">of Trusted Service</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

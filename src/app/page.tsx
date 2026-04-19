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
  ShieldCheck,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import { serviceAPI, settingsAPI, clientAPI, testimonialAPI, bannerAPI, blogAPI } from "@/lib/api";
import { ServiceSkeleton, TestimonialSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";
import { SyncHandler } from "@/components/SyncHandler";



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
  const [servicesRes, settingsRes, clientsRes, testimonialsRes, bannersRes, blogsRes] = await Promise.all([
    serviceAPI.getAll(),
    settingsAPI.get(),
    clientAPI.getAll(),
    testimonialAPI.getAll(),
    bannerAPI.getAll(true, 'Home'),
    blogAPI.getAll()
  ]);
  return {
    services: (servicesRes.data as any[])?.slice(0, 3) || [],
    settings: settingsRes.data || null,
    clients: (clientsRes.data as any[]) || [],
    testimonials: (testimonialsRes.data as any[])?.slice(0, 2) || [],
    banners: (bannersRes.data as any[]) || [],
    blogs: (blogsRes.data as any[])?.slice(0, 3) || []
  };
}

export default async function HomePage() {
  const { services, settings, testimonials, banners, blogs } = await getHomeData();

  const directorImg = getMediaUrl(settings?.directorImage);
  const activeBanner = banners.length > 0 ? banners[0] : null;
  const heroImg = getMediaUrl(activeBanner?.image || settings?.heroImage);
  const contactImg = getMediaUrl(settings?.contactImage);
  const heroTitle = activeBanner?.title || settings?.heroTitle || "Security You Can Always Trust.";
  const heroSubtitle = activeBanner?.subtitle || settings?.heroSubtitle || "AimHop Security Solutions Pvt. Ltd. — India's trusted security company.";

  const features = [
    {
      icon: <Users className="w-full h-full" />,
      title: settings?.feature1Title || "Experienced Staff",
      desc: settings?.feature1Desc || "We have experienced professionals who can easily understand our clients' requirements.",
    },
    {
      icon: <BadgeCheck className="w-full h-full" />,
      title: settings?.feature2Title || "Top-Tier Quality",
      desc: settings?.feature2Desc || "Our no-compromise approach to quality ensures that our solutions are user-friendly forever.",
      highlight: true
    },
    {
      icon: <Zap className="w-full h-full" />,
      title: settings?.feature3Title || "Affordable",
      desc: settings?.feature3Desc || "We provide cost-effective solutions without compromising on the security standards.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SyncHandler interval={15000} />
      <Navbar />

      <main className="flex-grow">

        {/* HERO SECTION - High Impact Floating Design */}
        <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImg ? (
              <SafeImage 
                src={heroImg} 
                alt="Hero" 
                fill
                priority
                className="w-full h-full object-cover object-center opacity-40 dark:opacity-20 transition-opacity duration-1000" 
              />

            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-background" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background to-background" />
          </div>

          <div className="container-pad relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-primary/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission: Your Total Safety</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
                  Protecting <br />
                  <span className="gradient-text">The Future</span><br />
                  Of India.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                  {heroSubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <WhatsAppModal whatsappNumber={settings?.whatsappNumber}>
                    <button className="btn-primary group">
                      Get Premium Guarding
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </button>
                  </WhatsAppModal>
                  <Link href="/services" className="btn-secondary">
                    View Solutions
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-10 border-t border-border/50">
                   {[
                     { val: settings?.statsClients || '1200+', label: 'Clients' },
                     { val: settings?.statsGuards || '5000+', label: 'Guards' },
                     { val: settings?.statsExperience || '5+', label: 'Years' },
                   ].map((s) => (
                     <div key={s.label} className="flex flex-col">
                       <span className="text-3xl font-black tracking-tighter">{s.val}</span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 opacity-60">{s.label}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="hidden lg:block relative group animate-fade-up stagger-1">
                 <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors" />
                 <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                    <img 
                      src={heroImg || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1470&auto=format&fit=crop"} 
                      alt="Security" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 p-8 glass-panel rounded-3xl">
                       <p className="text-white text-lg font-bold italic leading-tight">
                         "Our commitment is to deliver security with discipline and integrity."
                       </p>
                       <div className="mt-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-white text-xs">OP</div>
                          <div>
                             <p className="text-white text-xs font-black uppercase tracking-widest">O.P. YADAV</p>
                             <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">Managing Director</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY SECTION */}
        <section className="py-16 bg-muted/50 dark:bg-card/50 border-y border-border">
           <div className="container-pad flex flex-col md:flex-row items-center justify-between gap-10">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 whitespace-nowrap">Trusted By Elite Brands</p>
              <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-40 hover:grayscale-0 transition-all duration-700">
                 {/* Map through clients if available, else placeholders */}
                 {settings?.statsClients ? (
                    <span className="text-lg font-black tracking-widest uppercase italic">{settings.statsClients} PARTNERS</span>
                 ) : (
                    ['HDFC BANK', 'FORTIS', 'AMITY UNIVERSITY', 'PVR CINEMAS'].map(c => (
                      <span key={c} className="text-sm md:text-xl font-black tracking-tighter uppercase opacity-80">{c}</span>
                    ))
                 )}
              </div>
           </div>
        </section>

        {/* CCTV & ELECTRONIC SURVEILLANCE - High Tech Section */}
        <section className="section-spacing relative overflow-hidden bg-muted dark:bg-card/30">
           <div className="container-pad relative z-10">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="relative group order-2 lg:order-1">
                    <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full" />
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl shadow-primary/10">
                       <SafeImage 
                          src={settings?.cctvImage ? getMediaUrl(settings.cctvImage) : "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1470&auto=format&fit=crop"} 
                          alt="CCTV Control Room" 
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                       />
                       <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent mix-blend-overlay" />
                       <div className="absolute top-8 left-8 flex gap-4">
                          <div className="px-4 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE MONITORING
                          </div>
                       </div>
                    </div>
                    {/* Floating Tech Stats */}
                    <div className="absolute -bottom-10 -right-6 md:right-10 bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl max-w-[280px] space-y-4 hidden md:block animate-bounce-subtle">
                       <div className="flex items-center gap-4 text-primary">
                          <Camera className="w-8 h-8" />
                          <span className="font-black text-xs uppercase tracking-widest">Tech Specs</span>
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">AI-Driven Motion Detection, 4K Night Vision, & 24/7 Remote Command Center Integration.</p>
                    </div>
                 </div>

                 <div className="space-y-10 order-1 lg:order-2">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                       <ShieldCheck size={16} />
                       <span>Electronic Counter-Measures</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                       CCTV & <br />
                       <span className="gradient-text">Surveillance Hub.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                       Beyond physical guarding, we deploy state-of-the-art electronic eyes. From commercial installation to 24/7 remote monitoring, our surveillance solutions provide a multi-layered shield for your infrastructure.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                       {[
                         { t: "AI Integration", d: "Smart detection algorithms" },
                         { t: "Remote Access", d: "Mobile control & monitoring" },
                         { t: "Quick Install", d: "Zero-downtime deployment" },
                         { t: "24/7 Command", d: "Dedicated monitoring team" },
                       ].map(item => (
                         <div key={item.t} className="flex items-start gap-4">
                            <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                               <CheckCircle size={10} fill="currentColor" />
                            </div>
                            <div>
                               <p className="font-black text-xs uppercase tracking-tight leading-none mb-1">{item.t}</p>
                               <p className="text-[10px] font-medium text-muted-foreground">{item.d}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="pt-6">
                       <Link href="/contact?service=cctv" className="btn-primary">
                          Request Installation Quote
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* WHY AIMHOP - Grid Section */}
        <section className="section-spacing relative overflow-hidden">
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
           <div className="container-pad relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                 <div className="space-y-4 max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                       Elite Guarding <br />
                       <span className="gradient-text">Without Compromise.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg font-medium">Why the biggest brands in India trust Aimhop for their infrastructure.</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {features.map((f, i) => (
                   <div 
                     key={i} 
                     className="group p-10 bg-card border border-border rounded-[2.5rem] card-hover"
                   >
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                         {f.icon}
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                         {f.desc}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SERVICES PREVIEW - Visual Cards */}
        <section className="section-spacing bg-muted dark:bg-card/50 relative">
           <div className="container-pad">
              <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                    Our Expertise <br />
                    <span className="gradient-text">Across Sectors.</span>
                 </h2>
                 <p className="text-muted-foreground text-lg font-medium">Tailored protection strategies designed to safeguard your most valuable assets with precision.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <Suspense fallback={<ServiceSkeleton />}>
                   {services.slice(0, 3).map((s: any, i: number) => (
                     <div key={s?._id || i} className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden card-hover border border-border">
                        <img 
                          src={s?.image ? getMediaUrl(s.image) : "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1480&auto=format&fit=crop"} 
                          alt={s?.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                              {s?.category || 'Security'}
                           </span>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                              {s?.title || 'Guarding Solutions'}
                           </h3>
                           <p className="text-white/60 text-xs font-medium leading-relaxed line-clamp-2">
                              {s?.description || 'World-class security solutions tailored for your complex environment.'}
                           </p>
                           <Link href="/services" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary pt-4 hover:gap-3 transition-all">
                              EXPLORE NOW <ArrowRight size={14} className="ml-2" />
                           </Link>
                        </div>
                     </div>
                   ))}
                 </Suspense>
              </div>
           </div>
        </section>
        
        {/* BLOGS PREVIEW - Latest News */}
        {blogs.length > 0 && (
          <section className="section-spacing relative overflow-hidden">
             <div className="container-pad relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                   <div className="space-y-4 max-w-2xl">
                      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                         Latest News & <br />
                         <span className="gradient-text">Insights.</span>
                      </h2>
                      <p className="text-muted-foreground text-lg font-medium">Expert security advice, industry updates, and safety guides from the AimHop team.</p>
                   </div>
                   <Link href="/blogs" className="btn-secondary group">
                      Browse All Articles <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {blogs.map((post: any) => (
                      <Link 
                        key={post._id} 
                        href={`/blogs/${post._id}`}
                        className="group flex flex-col space-y-6"
                      >
                         <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border relative">
                            <SafeImage 
                              src={getMediaUrl(post.image)} 
                              alt={post.title} 
                              fill
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute top-6 left-6">
                               <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest border border-border shadow-lg">
                                  {post.category || 'Security'}
                               </span>
                            </div>
                         </div>
                         <div className="space-y-4 px-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
                               {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm font-medium line-clamp-2 italic">
                               {post.excerpt || post.description}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                               READ STORY <ChevronRight size={14} />
                            </div>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* CTA SECTION - High Impact */}
        <section className="section-spacing bg-background relative overflow-hidden">
           <div className="container-pad relative z-10">
              <div className="bg-primary p-12 md:p-24 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-primary/20">
                 {/* Background Image from Admin Settings */}
                 {settings?.contactImage && (
                    <SafeImage 
                       src={getMediaUrl(settings.contactImage)} 
                       alt="Contact Banner" 
                       fill
                       className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                 )}
                 <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                 <div className="relative z-10 text-center space-y-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                       Ready to hard-lock <br />
                       your facility?
                    </h2>
                    <p className="text-white/80 text-lg md:text-2xl font-medium">
                       Talk to our ex-army security consultants today for a free site audit.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                       <WhatsAppModal whatsappNumber={settings?.whatsappNumber}>
                          <button className="px-10 py-5 bg-white text-primary font-black rounded-3xl text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
                             BOOK FREE AUDIT
                          </button>
                       </WhatsAppModal>
                       <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="px-10 py-5 bg-black text-white font-black rounded-3xl text-lg hover:bg-slate-900 transition-all active:scale-95 border border-white/20 shadow-xl">
                          CALL NOW
                       </a>
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

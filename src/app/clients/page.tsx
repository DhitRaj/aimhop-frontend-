"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Star, Building2, Truck, Server, Landmark, Hospital, Briefcase, Zap, CheckCircle2, Send, MessageSquare, User } from "lucide-react";
import { LucideIcon, Shield as ShieldIcon, Building2 as Building2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { clientAPI, testimonialAPI, settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { ClientSkeleton, TestimonialSkeleton } from "@/components/Skeleton";

export default function ClientsPage() {
   const [clients, setClients] = useState<any[]>([]);
   const [testimonials, setTestimonials] = useState<any[]>([]);
   const [settings, setSettings] = useState<any>(null);
   const [banner, setBanner] = useState<any>(null);
   // API_BASE removed in favor of getMediaUrl utility

   // Form State
   const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 5 });
   const [loading, setLoading] = useState(false);
   const [pageLoading, setPageLoading] = useState(true);
   const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

   useEffect(() => {
      Promise.all([
         clientAPI.getAll(),
         testimonialAPI.getAll(),
         settingsAPI.get(),
         bannerAPI.getAll(true, 'Clients')
      ]).then(([cl, ts, st, bn]) => {
         if (cl.data) setClients(cl.data as any[]);
         if (ts.data) setTestimonials(ts.data as any[]);
         if (st.data) setSettings(st.data);
         if (bn.data && (bn.data as any[]).length > 0) setBanner((bn.data as any[])[0]);
         setPageLoading(false);
      });
   }, []);

   const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
   const heroTitle = banner?.title || "Our Clients";
   const heroSubtitle = banner?.subtitle || "1200+ Happy Clients Across India";

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);
      const res = await testimonialAPI.submit(formData);
      if (!res.error) {
         setStatus({ type: 'success', msg: 'Thank you! Your feedback has been received.' });
         setFormData({ name: '', role: '', message: '', rating: 5 });
      } else {
         setStatus({ type: 'error', msg: 'System error. Please try again.' });
      }
      setLoading(false);
   };

   const getRatingColor = (r: number) => {
      if (r === 1) return "text-rose-500";
      if (r === 2) return "text-orange-500";
      if (r === 3) return "text-amber-500";
      if (r === 4) return "text-lime-500";
      return "text-emerald-500";
   };

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
          <Breadcrumb title="Our Clients" />

          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
            <div className="space-y-12">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Strategic <br />
                Partnerships & <br />
                <span className="gradient-text">Deployments.</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed border-l-8 border-primary pl-8">
                Power plants, banking institutions, high-occupancy medical facilities, and government departments — they have all integrated AimHop for tactical reliability and cost-efficiency.
              </p>
              <div className="flex items-center gap-12 pt-4">
                <div className="text-left">
                  <p className="text-5xl font-black text-primary tracking-tighter">1200+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Active Protocols</p>
                </div>
                <div className="h-20 w-px bg-border" />
                <div className="text-left">
                  <p className="text-5xl font-black text-foreground tracking-tighter">99.8%</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Retention Rate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {pageLoading ? (
                [1, 2, 3, 4].map(i => <ClientSkeleton key={i} />)
              ) : clients.length > 0 ? (
                clients.map(c => (
                  <div key={c._id} className="p-8 bg-card rounded-[3rem] border border-border flex flex-col items-center justify-center text-center gap-6 group card-hover relative overflow-hidden">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 overflow-hidden relative z-10">
                      {c.logo ? (
                        <img src={getMediaUrl(c.logo)} alt={c.name} className="w-full h-full object-contain p-4 group-hover:brightness-0 group-hover:invert transition-all" />
                      ) : (
                        <Building2Icon size={40} />
                      )}
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-black text-sm uppercase tracking-tighter mb-1">{c.name}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{c.industry}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] border-2 border-dashed border-border rounded-[3rem]">Awaiting Intel</div>
              )}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-32 bg-card p-12 md:p-20 rounded-[4rem] border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <ShieldIcon size={300} className="text-primary" />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-20 relative z-10">
              <div className="lg:col-span-1 space-y-8">
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Command <br />Feedback.</h3>
                <div className="flex items-center gap-2 text-primary">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">Verifiable reports from field deployments across diverse industrial sectors.</p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                {pageLoading ? (
                  [1, 2].map(i => <TestimonialSkeleton key={i} />)
                ) : testimonials.length > 0 ? (
                  testimonials.map(t => (
                    <div key={t._id} className="p-10 bg-muted/30 rounded-[3rem] border border-border space-y-6 group hover:bg-card hover:shadow-2xl transition-all duration-500">
                      <div className={`flex items-center gap-1 ${getRatingColor(t.rating || 5).split(' ')[0]}`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-foreground font-medium italic text-lg leading-relaxed">"{t.message}"</p>
                      <div className="flex items-center gap-4 pt-6 border-t border-border">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase">{(t.name || 'U').charAt(0)}</div>
                        <div>
                          <h5 className="text-sm font-black uppercase tracking-tighter leading-none">{t.name || 'Anonymous'}</h5>
                          <p className="text-[10px] font-black text-muted-foreground uppercase mt-2 tracking-widest">{t.role || 'Sector Head'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] p-20 border border-dashed border-border rounded-[3rem] text-center md:col-span-2">Transmission Pending</p>
                )}
              </div>
            </div>
          </div>

          {/* New Feedback Form */}
          <section className="mt-32">
            <div className="max-w-4xl mx-auto bg-card p-10 md:p-20 rounded-[4rem] border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                <MessageSquare size={120} className="text-primary" />
              </div>

              <div className="relative z-10 text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Submit <span className="gradient-text">Intel.</span></h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Critical field reports and operational feedback.</p>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Officer Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                      <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-muted/50 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Full Name" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Rank</label>
                    <div className="relative">
                      <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                      <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-muted/50 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Role / Position" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Rating</label>
                  <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-[2rem] border border-border">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: r })}
                        className={`flex-1 py-6 rounded-2xl transition-all duration-500 flex flex-col items-center gap-2 border ${formData.rating >= r ? 'bg-card text-primary shadow-xl border-border scale-[1.05]' : 'bg-transparent border-transparent text-muted-foreground/30 hover:text-muted-foreground hover:bg-muted/50'}`}
                      >
                        <Star size={24} fill={formData.rating >= r ? "currentColor" : "none"} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{r} {r === 1 ? 'Point' : 'Points'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detailed Intelligence Report</label>
                  <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-muted/50 border border-border rounded-[2rem] px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="Share your detailed experience..." />
                </div>

                {status && (
                  <div className={`p-6 rounded-[2rem] flex items-center gap-4 font-black text-xs uppercase tracking-widest border ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <Zap size={20} />}
                    {status.msg}
                  </div>
                )}

                <button disabled={loading} type="submit" className="btn-primary w-full py-8 rounded-[2.5rem] flex items-center justify-center gap-4 group">
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    {loading ? 'Transmitting...' : 'Submit Intelligence'}
                  </span>
                  <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

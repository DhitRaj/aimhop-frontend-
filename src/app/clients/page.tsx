"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Star, Building2, Truck, Server, Landmark, Hospital, Briefcase, Zap, CheckCircle2, Send, MessageSquare, User } from "lucide-react";
import { LucideIcon, Shield as ShieldIcon, Building2 as Building2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { clientAPI, testimonialAPI, settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export default function ClientsPage() {
   const [clients, setClients] = useState<any[]>([]);
   const [testimonials, setTestimonials] = useState<any[]>([]);
   const [settings, setSettings] = useState<any>(null);
   // API_BASE removed in favor of getMediaUrl utility

   // Form State
   const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 5 });
   const [loading, setLoading] = useState(false);
   const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

   useEffect(() => {
      Promise.all([
         clientAPI.getAll(),
         testimonialAPI.getAll(),
         settingsAPI.get()
      ]).then(([cl, ts, st]) => {
         if (cl.data) setClients(cl.data);
         if (ts.data) setTestimonials(ts.data);
         if (st.data) setSettings(st.data);
      });
   }, []);

   const heroImg = getMediaUrl(settings?.heroImage);

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
      <div className="bg-white dark:bg-slate-950 min-h-screen">
         <Navbar />

         <main className="pt-32 pb-20">
            <section className="relative h-[320px] md:h-[400px] mb-16 bg-slate-950 rounded-b-[3rem] overflow-hidden flex items-center justify-center">
               {heroImg && (
                  <img src={heroImg} alt="Background" className="absolute inset-0 w-full h-full object-cover object-center opacity-70" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
               <div className="relative z-10 text-center space-y-3 px-6">
                  <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-2xl">
                     Companies Who<br /><span className="text-sky-500">Trust Us</span>
                  </h1>
                  <p className="text-sky-400 font-bold uppercase tracking-widest text-sm">1200+ Happy Clients Across India</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-6">
               <Breadcrumb title="Our Clients" />

               <div className="grid lg:grid-cols-2 gap-16 items-center mt-14">
                  <div className="space-y-8">
                     <h2 className="text-3xl lg:text-4xl font-black tracking-tight uppercase leading-tight">
                        Big Companies and<br />Government Offices<br />Choose AimHop
                     </h2>
                     <p className="text-base text-slate-500 font-medium leading-relaxed border-l-4 border-sky-600 pl-5">
                        Power plants, banks, hospitals, and government departments — they have all chosen our security services because we are reliable and affordable.
                     </p>
                     <div className="flex items-center gap-8 pt-4">
                        <div className="text-center">
                           <p className="text-4xl font-black text-sky-600">1200+</p>
                           <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Total Clients</p>
                        </div>
                        <div className="h-16 w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="text-center">
                           <p className="text-4xl font-black text-slate-900 dark:text-white">99.8%</p>
                           <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Clients Stay With Us</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     {clients.map(c => (
                        <div key={c._id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-4 group hover:bg-slate-900 dark:hover:bg-white hover:-translate-y-1 transition-all duration-500 shadow-md">
                           <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-500 overflow-hidden">
                              {c.logo ? (
                                 <img src={getMediaUrl(c.logo)} alt={c.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                 <Building2Icon className="w-10 h-10" />
                              )}
                           </div>
                           <div>
                              <h4 className="font-black text-xs md:text-sm uppercase tracking-tight group-hover:text-white dark:group-hover:text-slate-900 transition-colors">{c.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 dark:group-hover:text-slate-500 transition-colors mt-0.5">{c.industry}</p>
                           </div>
                        </div>
                     ))}
                     {clients.length === 0 && (
                        <div className="col-span-2 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-100 rounded-3xl">Updating Client List...</div>
                     )}
                  </div>
               </div>

               {/* Testimonials */}
               <div className="mt-24 bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <div className="grid lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-2xl font-black tracking-tight uppercase">What Our Clients Say</h3>
                        <div className="flex items-center gap-1 text-sky-600">
                           {[1, 2, 3, 4, 5].map(i => <Star key={i} className="fill-current w-5 h-5" />)}
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Real feedback from our clients across different industries.</p>
                     </div>
                     <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
                        {testimonials.map(t => (
                           <div key={t._id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm group">
                              <div className={`flex items-center gap-1 mb-2 ${getRatingColor(t.rating || 5).split(' ')[0]}`}>
                                 {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={10} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                                 ))}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 font-medium italic text-sm leading-relaxed">"{t.message}"</p>
                              <div className="flex items-center gap-3 pt-2 border-t border-slate-50 dark:border-slate-700">
                                 <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 font-black text-[10px] uppercase">{(t.name || 'U').charAt(0)}</div>
                                 <div>
                                    <h5 className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{t.name || 'User'}</h5>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{t.role || 'Client'}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                        {testimonials.length === 0 && (
                           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] p-10 border border-dashed rounded-2xl text-center md:col-span-2">New testimonials arriving soon.</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* New Feedback Form Section DYNAMIC */}
               <section className="mt-24 mb-10">
                  <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <MessageSquare className="w-32 h-32 text-sky-600" />
                     </div>

                     <div className="relative z-10 text-center space-y-3 mb-10">
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Share Your <span className="text-sky-600">Feedback</span></h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Your feedback is extremely valuable to us.</p>
                     </div>

                     <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Full Name</label>
                              <div className="relative">
                                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                 <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 outline-none transition-all transition-all" placeholder="e.g. Ramesh Yadav" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Role / Job Title</label>
                              <div className="relative">
                                 <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                 <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 outline-none transition-all transition-all" placeholder="e.g. Manager @ Company" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Overall Experience</label>
                           <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                              {[1, 2, 3, 4, 5].map(r => (
                                 <button
                                    key={r}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: r })}
                                    className={`flex-1 py-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 border ${formData.rating >= r ? getRatingColor(formData.rating) + ' bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-700 scale-[1.02]' : 'bg-transparent border-transparent text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500'}`}
                                 >
                                    <Star size={20} fill={formData.rating >= r ? "currentColor" : "none"} className={`transition-all ${formData.rating >= r ? 'opacity-100' : 'opacity-50'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest mt-1">{r} {r === 1 ? 'Star' : 'Stars'}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Feedback Message</label>
                           <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 outline-none transition-all resize-none" placeholder="How did you like our services? Please share your experience with us..." />
                        </div>

                        {status && (
                           <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {status.type === 'success' ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                              {status.msg}
                           </div>
                        )}

                        <button disabled={loading} type="submit" className="w-full bg-slate-900 dark:bg-sky-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group">
                           {loading ? 'Submitting...' : 'Submit Your Rating'}
                           <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

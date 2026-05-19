"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Star, Building2, CheckCircle, Send, MessageSquare, User, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { clientAPI, testimonialAPI, settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null);
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
  const heroSubtitle = banner?.subtitle || "Trusted by leading businesses across India";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await testimonialAPI.submit(formData);
    if (!res.error) {
      setStatus({ type: 'success', msg: 'Thank you! Your feedback has been received.' });
      setFormData({ name: '', role: '', message: '', rating: 5 });
    } else {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
    }
    setLoading(false);
  };

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
          <Breadcrumb title="Our Clients" />

          <div className="grid lg:grid-cols-2 gap-20 items-center mt-16">
            <div className="space-y-8">
              <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e] mb-3">Trusted Partners</div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                Protecting businesses across India
              </h2>
              <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                From banks and hospitals to manufacturing plants and residential complexes — we provide reliable security solutions to diverse industries.
              </p>
              <div className="flex items-center gap-12 pt-6">
                <div>
                  <p className="font-['Bricolage_Grotesque',sans-serif] text-[44px] font-extrabold text-[#5CC67A] tracking-[-2px]">
                    {settings?.statsClients || '1200+'}
                  </p>
                  <p className="text-[13px] text-[#6B7068] dark:text-[#94a3b8] mt-1 transition-colors duration-200">Active Clients</p>
                </div>
                <div className="h-16 w-px bg-[#E8E8E4] dark:bg-[#1e1e24] transition-colors duration-200" />
                <div>
                  <p className="font-['Bricolage_Grotesque',sans-serif] text-[44px] font-extrabold text-[#1A1A18] dark:text-[#f8fafc] tracking-[-2px] transition-colors duration-200">99.8%</p>
                  <p className="text-[13px] text-[#6B7068] dark:text-[#94a3b8] mt-1 transition-colors duration-200">Retention Rate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pageLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] p-8 h-40 animate-pulse transition-colors duration-200"></div>
                ))
              ) : clients.length > 0 ? (
                clients.slice(0, 8).map(c => (
                  <div key={c._id} className="p-6 bg-white dark:bg-[#111113] rounded-[20px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] flex flex-col items-center justify-center text-center gap-4 group hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200">
                    <div className="w-16 h-16 rounded-[14px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center overflow-hidden transition-colors duration-200">
                      {c.logo ? (
                        <img src={getMediaUrl(c.logo)} alt={c.name} className="w-full h-full object-contain p-3" />
                      ) : (
                        <Building2 size={32} className="text-[#5CC67A]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-['Bricolage_Grotesque',sans-serif] text-[14px] font-bold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">{c.name}</h4>
                      <p className="text-[11px] text-[#6B7068] dark:text-[#94a3b8] mt-1 transition-colors duration-200">{c.industry}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-16 text-center text-[#6B7068] dark:text-[#94a3b8] border-[1.5px] border-dashed border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] transition-colors duration-200">
                  <Building2 size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-[13px] font-semibold">No clients to display</p>
                </div>
              )}
            </div>
          </div>

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="mt-32 bg-white dark:bg-[#111113] p-12 md:p-16 rounded-[32px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
              <div className="grid lg:grid-cols-3 gap-16">
                <div className="space-y-6">
                  <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Testimonials</div>
                  <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[28px] font-extrabold tracking-[-1px] leading-tight text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                    What our clients say
                  </h3>
                  <div className="flex items-center gap-1 text-[#FF8C47]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-[15px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">
                    Real feedback from businesses we protect every day.
                  </p>
                </div>
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                  {testimonials.slice(0, 4).map(t => (
                    <div key={t._id} className="p-6 bg-[#FAFAF8] dark:bg-[#1e1e24] rounded-[20px] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] space-y-4 hover:shadow-[0_4px_28px_rgba(255,140,71,.10)] dark:hover:shadow-[0_4px_28px_rgba(255,140,71,.05)] hover:-translate-y-1 transition-all duration-200">
                      <div className="flex items-center gap-1 text-[#FF8C47]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-[14px] text-[#1A1A18] dark:text-[#f8fafc] leading-relaxed italic transition-colors duration-200">"{t.message}"</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E4] dark:border-[#2a2a32]">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#5CC67A] to-[#7de09a] text-white flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold text-[13px]">
                          {(t.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">{t.name || 'Anonymous'}</h5>
                          <p className="text-[11px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">{t.role || 'Client'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Form */}
          <section className="mt-32">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#111113] p-10 md:p-16 rounded-[32px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.3)] transition-colors duration-200">
              <div className="text-center space-y-3 mb-12">
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-1.5px] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                  Share your feedback
                </h2>
                <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">Help us improve our services with your valuable input</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <input 
                        required 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all" 
                        placeholder="Full Name" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Your Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <input 
                        required 
                        type="text" 
                        value={formData.role} 
                        onChange={e => setFormData({ ...formData, role: e.target.value })} 
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all" 
                        placeholder="Position / Company" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Rating</label>
                  <div className="flex items-center gap-3 bg-[#FAFAF8] dark:bg-[#1e1e24] p-2 rounded-[14px] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] transition-colors duration-200">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: r })}
                        className={`flex-1 py-4 rounded-[10px] transition-all duration-300 flex flex-col items-center gap-1.5 ${formData.rating >= r ? 'bg-white dark:bg-[#2a2a32] text-[#FF8C47] shadow-md scale-105' : 'text-[#6B7068] dark:text-[#94a3b8]/30 hover:text-[#6B7068] dark:hover:text-[#94a3b8] hover:bg-white dark:hover:bg-[#2a2a32]/50'}`}
                      >
                        <Star size={20} fill={formData.rating >= r ? "currentColor" : "none"} />
                        <span className="text-[10px] font-bold">{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Your Message</label>
                  <textarea 
                    required 
                    rows={5} 
                    value={formData.message} 
                    onChange={e => setFormData({ ...formData, message: e.target.value })} 
                    className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] px-4 py-4 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all resize-none" 
                    placeholder="Share your experience with our services..." 
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-[14px] flex items-center gap-3 text-[13px] font-semibold transition-colors duration-200 ${status.type === 'success' ? 'bg-[#E8F8ED] dark:bg-[#1e3a28] text-[#3daa5e] dark:text-[#7de09a]' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <MessageSquare size={18} />}
                    {status.msg}
                  </div>
                )}

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#5CC67A] text-white font-semibold text-base px-8 py-4 rounded-[12px] hover:bg-[#3daa5e] transition-all hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(92,198,122,.35)] disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                  <Send size={18} />
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

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { careerAPI, settingsAPI, bannerAPI } from "@/lib/api";
import { Briefcase, Upload, Send, CheckCircle2, AlertCircle, FileText, Zap } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Security Guard",
    experience: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    Promise.all([settingsAPI.get(), bannerAPI.getAll(true, 'Careers')]).then(([setRes, banRes]) => {
      if (setRes.data) setSettings(setRes.data);
      if (banRes.data && banRes.data.length > 0) setBanner(banRes.data[0]);
      setLoadingSettings(false);
    }).catch(() => setLoadingSettings(false));
  }, []);

  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);
  const heroTitle = banner?.title || "Join Our Force";
  const heroSubtitle = banner?.subtitle || "Build a rewarding career with AimHop Security Solutions";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('position', formData.position);
      data.append('experience', formData.experience);
      if (file) data.append('resume', file);

      const res = await careerAPI.submit(data);
      if (res.error) {
        setStatus({ type: 'error', msg: res.error });
      } else {
        setStatus({ type: 'success', msg: 'Your resume has been submitted successfully. Our team will contact you soon!' });
        setFormData({ name: "", email: "", phone: "", position: "Security Guard", experience: "" });
        setFile(null);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'System error. Please try again later.' });
    }
    setLoading(false);
  };

  if (!loadingSettings && settings?.ctaJobEnabled === false) {
    return (
      <div className="bg-white dark:bg-slate-950 min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow pt-48 pb-32 flex flex-col items-center justify-center text-center px-6">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <Briefcase size={80} className="relative text-slate-200 dark:text-slate-800" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Recruitment <span className="text-sky-600">Paused</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
            We are not currently accepting new applications at this time. <br className="hidden md:block" />
            Please follow our social media handles for future openings.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a href="/" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Return Home</a>
            <a href="/contact" className="bg-sky-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-sky-600/20">Contact Us Directly</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-sans">
      <Navbar />

      <main className="pb-20">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          backgroundImage={heroImg}
        />

        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb title="Careers" />

          <div className="grid lg:grid-cols-2 gap-16 mt-16 items-start">
            {/* Info Section */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
                  Start Your Professional <br /><span className="text-sky-600">Security Career</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                  We are always looking for trained and disciplined professionals. If you believe in hard work and honesty, apply today.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { title: "Great Salary", desc: "Competitive industry-standard salary with on-time payments." },
                  { title: "Free Training", desc: "Free expert training on security protocols and soft skills." },
                  { title: "Insurance Cover", desc: "Comprehensive medical and health insurance for all employees." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600/10 flex items-center justify-center text-sky-600 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Briefcase className="w-32 h-32" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                      placeholder="e.g. Arun Singh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                      placeholder="arun@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone (WhatsApp)</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                      placeholder="+91 99999 00000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Position Applying For</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                    >
                      <option>Security Guard</option>
                      <option>Security Supervisor</option>
                      <option>Female Escort Guard</option>
                      <option>Bouncer</option>
                      <option>Personal Bodyguard</option>
                      <option>Housekeeping Staff</option>
                      <option>Driver</option>
                      <option>Office Staff</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                    placeholder="e.g. 2 Years in Security"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Upload Resume (PDF/Word)</label>
                  <div className="relative group/file">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center justify-center w-full min-h-[120px] bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] cursor-pointer hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                    >
                      {file ? (
                        <div className="flex items-center gap-3 text-sky-600 font-bold">
                          <FileText className="w-8 h-8" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover/file:text-sky-600" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Click to choose file</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {status && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {status.msg}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
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
      if (banRes.data) {
        const bannersData = Array.isArray(banRes.data) ? banRes.data : (banRes.data as any).data;
        if (Array.isArray(bannersData) && bannersData.length > 0) setBanner(bannersData[0]);
      }
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
      <div className="bg-background min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-40">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150 animate-pulse" />
            <Briefcase size={120} className="relative text-muted-foreground/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
            Tactical <br />
            <span className="gradient-text">Pause.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed mb-16">
            Our deployment for new personnel is currently on standby. We are not accepting new mission applications at this time.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/" className="btn-secondary px-12 py-6 rounded-[2rem]">Base Command</Link>
            <Link href="/contact" className="btn-primary px-12 py-6 rounded-[2rem]">Contact Intelligence</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-sans">
      <Navbar />

      <main className="pb-32">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          backgroundImage={heroImg}
        />

        <div className="container-pad">
          <Breadcrumb title="Recruitment" />

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            {/* Info Section */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                  Join the <br />
                  <span className="gradient-text">Elite.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                  We are always looking for disciplined, battle-tested professionals. If you embody integrity and tactical excellence, your mission starts here.
                </p>
              </div>

              <div className="grid gap-8">
                {[
                  { title: "Standard Salary", desc: "Top-tier industry compensation with rigid payment schedules." },
                  { title: "Tactical Training", desc: "Advanced specialized training in security protocols and combat defense." },
                  { title: "Full Coverage", desc: "Comprehensive health, life, and accident coverage for all personnel." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 p-10 bg-card border border-border rounded-[3rem] card-hover group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl uppercase tracking-tighter text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground font-medium text-lg leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-card p-10 md:p-16 rounded-[4rem] shadow-2xl border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Briefcase className="w-48 h-48 text-primary" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Legal Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all outline-none"
                      placeholder="Enter Full Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Vector</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all outline-none"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Comms Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Desired Rank</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all outline-none appearance-none"
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

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all outline-none"
                    placeholder="e.g. 5 Years in Protection Services"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Dossier (Resume)</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center justify-center w-full min-h-[160px] bg-muted/30 border-2 border-dashed border-border rounded-[2.5rem] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      {file ? (
                        <div className="flex flex-col items-center gap-4 text-primary font-black">
                          <FileText size={48} />
                          <span className="text-xs uppercase tracking-widest">{file.name}</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <Upload size={32} className="mx-auto text-muted-foreground opacity-30" />
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Drop Dossier or Click to Upload</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {status && (
                  <div className={`p-6 rounded-[2rem] flex items-center gap-4 font-black text-xs uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {status.msg}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="btn-primary w-full py-8 rounded-[2.5rem] flex items-center justify-center gap-4 group"
                >
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    {loading ? "Transmitting..." : "Submit Mission Application"}
                  </span>
                  <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
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

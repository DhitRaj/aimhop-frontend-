"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { careerAPI, settingsAPI, bannerAPI } from "@/lib/api";
import { Briefcase, Upload, Send, CheckCircle, AlertCircle, FileText, User, Mail, Phone as PhoneIcon } from "lucide-react";
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
  const heroTitle = banner?.title || "Join Our Team";
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
        setStatus({ type: 'success', msg: 'Your application has been submitted successfully. Our team will contact you soon!' });
        setFormData({ name: "", email: "", phone: "", position: "Security Guard", experience: "" });
        setFile(null);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again later.' });
    }
    setLoading(false);
  };

  if (!loadingSettings && settings?.ctaJobEnabled === false) {
    return (
      <div className="bg-[#FAFAF8] dark:bg-[#0a0a0b] min-h-screen flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-32">
          <Briefcase size={80} className="text-[#6B7068] dark:text-[#94a3b8]/20 mb-8 transition-colors duration-200" />
          <h1 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(38px,5vw,58px)] font-extrabold tracking-[-2px] leading-[1.08] text-[#1A1A18] dark:text-[#f8fafc] mb-6 transition-colors duration-200">
            Hiring Paused
          </h1>
          <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] max-w-2xl leading-relaxed mb-12 transition-colors duration-200">
            We are not accepting new applications at this time. Please check back later for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-transparent text-[#1A1A18] dark:text-[#f8fafc] font-semibold text-[14.5px] px-6 py-3 rounded-[10px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] hover:bg-[#F1F5F9] dark:hover:bg-[#1e1e24] transition-all">
              Go Home
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#5CC67A] text-white font-semibold text-[14.5px] px-6 py-3 rounded-[10px] hover:bg-[#3daa5e] transition-all">
              Contact Us
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <Breadcrumb title="Careers" />

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Info Section */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Join Us</div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                  Build your career with us
                </h2>
                <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
                  We're always looking for dedicated professionals who value integrity and excellence. Join our team and grow with India's leading security company.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { title: "Competitive Salary", desc: "Industry-leading compensation with timely payments and performance bonuses." },
                  { title: "Professional Training", desc: "Comprehensive training programs in security protocols and safety procedures." },
                  { title: "Health Benefits", desc: "Medical insurance coverage for you and your family members." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-6 bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] hover:shadow-[0_4px_28px_rgba(92,198,122,.12)] dark:hover:shadow-[0_4px_28px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200">
                    <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] to-[#FFF0E6] dark:to-[#3a2618] flex items-center justify-center text-[#5CC67A] shrink-0 transition-colors duration-200">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] mb-1 transition-colors duration-200">{item.title}</h4>
                      <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-[#111113] p-8 md:p-12 rounded-[32px] shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.3)] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Phone Number</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Position</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40" />
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full bg-[#FAFAF8] border-[1.5px] border-[#E8E8E4] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all appearance-none"
                      >
                        <option>Security Guard</option>
                        <option>Security Supervisor</option>
                        <option>Female Security Guard</option>
                        <option>Bouncer</option>
                        <option>Personal Bodyguard</option>
                        <option>Housekeeping Staff</option>
                        <option>Driver</option>
                        <option>Office Staff</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Experience (Optional)</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] px-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all"
                    placeholder="e.g. 5 years in security services"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-[#6B7068] uppercase tracking-[0.8px]">Resume (PDF ONLY)</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile && selectedFile.type !== 'application/pdf') {
                          setStatus({ type: 'error', msg: 'Only PDF files are allowed.' });
                          e.target.value = '';
                          return;
                        }
                        setFile(selectedFile || null);
                      }}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center justify-center w-full min-h-[140px] bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-dashed border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] cursor-pointer hover:border-[#5CC67A] hover:bg-[#E8F8ED]/30 dark:hover:bg-[#1e3a28]/30 transition-all"
                    >
                      {file ? (
                        <div className="flex flex-col items-center gap-3 text-[#5CC67A]">
                          <FileText size={40} />
                          <span className="text-[13px] font-semibold">{file.name}</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <Upload size={28} className="mx-auto text-[#6B7068] dark:text-[#94a3b8]/30 transition-colors duration-200" />
                          <p className="text-[13px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">Click to upload or drag and drop</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {status && (
                  <div className={`p-4 rounded-[14px] flex items-center gap-3 text-[13px] font-semibold transition-colors duration-200 ${status.type === 'success' ? 'bg-[#E8F8ED] dark:bg-[#1e3a28] text-[#3daa5e] dark:text-[#7de09a]' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {status.msg}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#5CC67A] text-white font-semibold text-base px-8 py-4 rounded-[12px] hover:bg-[#3daa5e] transition-all hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(92,198,122,.35)] disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <Send size={18} />
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

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { User, Phone as PhoneIcon, MessageSquare, CheckCircle, AlertCircle, Send } from "lucide-react";
import { contactAPI } from "@/lib/api";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "Security Guard (Armed / Unarmed)",
    message: ""
  });

  useEffect(() => {
    if (preselectedService) {
      let matchedSubject = "Security Guard (Armed / Unarmed)";
      if (preselectedService.toLowerCase() === 'cctv') matchedSubject = "CCTV & Electronic Surveillance";
      if (preselectedService.toLowerCase() === 'bouncer') matchedSubject = "Bouncer / Event Security";
      
      setFormData(prev => ({ ...prev, subject: matchedSubject }));
    }
  }, [preselectedService]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { data, error } = await contactAPI.submit({
      name: formData.name,
      email: "not-required@aimhop.com",
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
    });

    setLoading(false);
    if (error) {
      setStatus({ type: 'error', msg: error });
    } else {
      setStatus({ type: 'success', msg: data?.message || "Message sent successfully!" });
      setFormData({ name: "", phone: "", subject: "Security Guard (Armed / Unarmed)", message: "" });
    }
  };

  return (
    <div className="bg-white dark:bg-[#111113] p-8 md:p-12 rounded-[32px] shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.3)] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
      <div className="mb-8">
        <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[24px] font-extrabold text-[#1A1A18] dark:text-[#f8fafc] mb-2 transition-colors duration-200">Send us a message</h3>
        <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">Fill in your details and we'll get back to you shortly</p>
      </div>

      {status && (
        <div className={`p-4 rounded-[14px] mb-6 flex items-center gap-3 text-[13px] font-semibold transition-colors duration-200 ${status.type === 'success' ? 'bg-[#E8F8ED] dark:bg-[#1e3a28] text-[#3daa5e] dark:text-[#7de09a]' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.8px] transition-colors duration-200">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40 dark:text-[#94a3b8]/40 transition-colors duration-200" />
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.8px] transition-colors duration-200">Phone Number</label>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40 dark:text-[#94a3b8]/40 transition-colors duration-200" />
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
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.8px] transition-colors duration-200">Service Required</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7068]/40 dark:text-[#94a3b8]/40 transition-colors duration-200" />
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] pl-12 pr-4 py-3.5 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all appearance-none"
            >
              <option>Security Guard (Armed / Unarmed)</option>
              <option>Bouncer / Event Security</option>
              <option>Bodyguard / Escort Guard</option>
              <option>CCTV & Electronic Surveillance</option>
              <option>Manpower Supply (Skilled)</option>
              <option>Manpower Supply (Non-Skilled)</option>
              <option>Facility Management & Housekeeping</option>
              <option>Other / Not Sure</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-[0.8px] transition-colors duration-200">Your Message</label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[14px] px-4 py-4 text-[14px] font-medium text-[#1A1A18] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#5CC67A]/20 focus:border-[#5CC67A] outline-none transition-all resize-none"
            placeholder="Tell us about your security requirements..."
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#5CC67A] text-white font-semibold text-base px-8 py-4 rounded-[12px] hover:bg-[#3daa5e] transition-all hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(92,198,122,.35)] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
          <Send size={18} />
        </button>
      </form>

      <div className="pt-6 flex items-center justify-center gap-2 opacity-60">
        <CheckCircle size={14} className="text-[#5CC67A]" />
        <span className="text-[11px] font-semibold text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">Your information is secure with us</span>
      </div>
    </div>
  );
}

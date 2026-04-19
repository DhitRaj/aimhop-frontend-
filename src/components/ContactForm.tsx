"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Shield, Clock, CheckCircle2, Zap } from "lucide-react";
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
      // Map URL params to actual select options
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
      email: "not-required@aimhop.com", // Backend expects email
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
    <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-black tracking-tight uppercase mb-1">Send Us a Message</h3>
        <p className="text-sm font-medium text-slate-400 mb-8">Please fill in your details — we will contact you shortly.</p>

        {status && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold uppercase tracking-wider ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            <Zap className="inline-block mr-2 w-4 h-4 mb-0.5" />
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Your Name *</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium text-sm placeholder:text-slate-300"
                placeholder="e.g. Ramesh Kumar"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number *</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium text-sm placeholder:text-slate-300"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Which Service Do You Need?</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium text-sm appearance-none"
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Tell Us Your Requirement</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium text-sm placeholder:text-slate-300 resize-none"
              placeholder="e.g. 2 guards for my factory in Gorakhpur, day shift only..."
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-sky-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"} <Shield className="w-4 h-4" />
          </button>
        </form>

      </div>
      <div className="pt-6 flex items-center justify-center gap-3 opacity-40">
        <CheckCircle2 className="w-4 h-4 text-sky-600" />
        <span className="text-xs font-bold uppercase tracking-wider">Your details are safe with us</span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { careerAPI } from "@/lib/api";
import { Upload, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function CareerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await careerAPI.submit(formData);

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-slate-800">
      {success ? (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-4">Application Sent!</h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Thank you for applying to AimHop. Our HR team will review your application and contact you if your profile matches our requirements.
          </p>
          <button 
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-8 text-sky-600 font-bold uppercase text-sm tracking-wider hover:underline"
          >
            Submit another application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name *</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address *</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Phone Number *</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                placeholder="+91 9876543210" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Role Applied For *</label>
              <select 
                name="role" 
                required 
                defaultValue="" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="" disabled>Select a position</option>
                <option value="Security Guard">Security Guard</option>
                <option value="Gunman">Gunman</option>
                <option value="Bouncer">Bouncer</option>
                <option value="Supervisor">Facility Supervisor</option>
                <option value="CCTV Operator">CCTV Operator</option>
                <option value="Other">Other Office Role</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Cover Letter / Experience</label>
            <textarea 
              name="message" 
              rows={4} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
              placeholder="Tell us about your previous security experience..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Resume/CV (PDF/DOC) *</label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              <input 
                type="file" 
                name="resume" 
                accept=".pdf,.doc,.docx" 
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <Upload className="w-8 h-8 text-sky-500 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click or drag file to upload</p>
                <p className="text-xs text-slate-500 mt-1">Accepts PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white rounded-xl px-6 py-4 font-black uppercase text-sm tracking-widest hover:bg-sky-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-sky-600/20"
          >
            {isSubmitting ? 'Sending Application...' : 'Submit Application'} {!isSubmitting && <Send className="w-4 h-4" />}
          </button>
        </form>
      )}
    </div>
  );
}

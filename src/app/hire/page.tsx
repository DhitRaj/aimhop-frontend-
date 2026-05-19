"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, ArrowLeft, Shield, Users, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";

export default function HireStaffPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    role: "",
    count: "1",
    city: "",
    timing: "",
    name: "",
    company: "",
    phone: "",
    email: ""
  });

  const updateForm = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const submitForm = async () => {
    // In MVP, this can connect to the existing /api/v1/contact or a new /api/v1/inquiries route
    console.log("Submitting:", formData);
    alert("Request submitted successfully! Our enterprise team will call you within 30 minutes.");
    setStep(5); // Success step
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Progress Indicator */}
          {step < 5 && (
            <div className="mb-12">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 px-1">
                <span className={step >= 1 ? "text-emerald-500" : ""}>Category</span>
                <span className={step >= 2 ? "text-emerald-500" : ""}>Details</span>
                <span className={step >= 3 ? "text-emerald-500" : ""}>Logistics</span>
                <span className={step >= 4 ? "text-emerald-500" : ""}>Contact</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 md:p-12">
            
            {/* STEP 1: CATEGORY */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">What do you need to hire?</h2>
                <p className="text-slate-500 mb-8">Select the primary category of workforce you require.</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { updateForm("category", "SECURITY"); nextStep(); }}
                    className={`flex flex-col items-center p-8 rounded-xl border-2 transition-all ${formData.category === 'SECURITY' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                  >
                    <Shield className={`w-12 h-12 mb-4 ${formData.category === 'SECURITY' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-lg">Security Personnel</span>
                    <span className="text-sm text-slate-500 mt-1">Guards, Bouncers, QRT</span>
                  </button>

                  <button 
                    onClick={() => { updateForm("category", "MANPOWER"); nextStep(); }}
                    className={`flex flex-col items-center p-8 rounded-xl border-2 transition-all ${formData.category === 'MANPOWER' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                  >
                    <Users className={`w-12 h-12 mb-4 ${formData.category === 'MANPOWER' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-lg">Facility Manpower</span>
                    <span className="text-sm text-slate-500 mt-1">Housekeeping, Staff, Labour</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ROLE & SCALE */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Specify your requirements</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Specific Role Needed</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => updateForm("role", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      <option value="">Select a role...</option>
                      {formData.category === "SECURITY" ? (
                        <>
                          <option value="Armed Guard">Armed Security Guard</option>
                          <option value="Unarmed Guard">Unarmed Security Guard</option>
                          <option value="Corporate Guard">Corporate / IT Security</option>
                          <option value="Bouncer">Bouncer / VIP Protection</option>
                          <option value="Event Security">Event Security Team</option>
                        </>
                      ) : (
                        <>
                          <option value="Housekeeping">Housekeeping Staff</option>
                          <option value="Office Boy">Office Boy / Peon</option>
                          <option value="Loader">Warehouse Loader</option>
                          <option value="Electrician">Electrician / Plumber</option>
                          <option value="General Labour">General Labour</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">How many personnel do you need?</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" max="50" 
                        value={formData.count}
                        onChange={(e) => updateForm("count", e.target.value)}
                        className="w-full accent-emerald-500"
                      />
                      <div className="w-16 text-center font-bold text-lg bg-slate-100 dark:bg-slate-800 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        {formData.count}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.role}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOGISTICS */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Deployment Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City of Deployment</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai, Delhi NCR"
                      value={formData.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Shift Timing</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Day Shift', 'Night Shift', '24 Hours'].map(timing => (
                        <button
                          key={timing}
                          onClick={() => updateForm("timing", timing)}
                          className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${formData.timing === timing ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400'}`}
                        >
                          {timing}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.city || !formData.timing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Where should we send the proposal?</h2>
                <p className="text-slate-500 mb-8">Our enterprise team will contact you with a custom quote within 30 minutes.</p>
                
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Your Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={(e) => updateForm("company", e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Phone Number (WhatsApp preferred)</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Back</button>
                  <button 
                    onClick={submitForm} 
                    disabled={!formData.name || !formData.phone}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/30"
                  >
                    Submit Request
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Data Privacy Guaranteed
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-10">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-3xl font-extrabold mb-4">Request Received!</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  Thank you, {formData.name}. Our enterprise deployment team is reviewing your requirement for {formData.count} {formData.role}(s) in {formData.city}. We will call you shortly on {formData.phone}.
                </p>
                <Link href="/">
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
                    Return to Homepage
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

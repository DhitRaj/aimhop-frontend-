"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, ArrowLeft, Shield, Users, CheckCircle2, Building2, Camera } from "lucide-react";
import Link from "next/link";
import { hireCategoryAPI } from "@/lib/api";

const IconMap: Record<string, any> = {
  Shield,
  Users,
  Camera,
  Building2,
};

export default function HireStaffPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    requirements: [] as { name: string, count: number }[],
    city: "",
    timing: "",
    name: "",
    company: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await hireCategoryAPI.getActive();
        if (res.data) setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Always use functional setState to avoid stale-closure overwrites
  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Batch category + requirements reset in one setState call
  const selectCategory = (cat: string) => {
    setFormData(prev => ({ ...prev, category: cat, requirements: [] }));
    setStep(s => Math.min(s + 1, 4));
  };

  const toggleRole = (roleName: string) => {
    setFormData(prev => {
      const exists = prev.requirements.find(r => r.name === roleName);
      return {
        ...prev,
        requirements: exists
          ? prev.requirements.filter(r => r.name !== roleName)
          : [...prev.requirements, { name: roleName, count: 1 }]
      };
    });
  };

  const updateRoleCount = (roleName: string, count: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map(r => r.name === roleName ? { ...r, count: Math.max(1, count) } : r)
    }));
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
                
                <div className="grid sm:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-3 text-center py-10">Loading categories...</div>
                  ) : categories.map((cat: any) => {
                    const IconComponent = IconMap[cat.icon] || Shield;
                    const isSelected = formData.category === cat.value;
                    const borderClass = isSelected ? cat.colorClass : 'border-slate-200 dark:border-slate-700 ' + cat.hoverClass;
                    const iconColor = isSelected ? cat.iconColorClass : 'text-slate-400';

                    return (
                      <button 
                        key={cat._id}
                        onClick={() => selectCategory(cat.value)}
                        className={`flex flex-col items-center p-8 rounded-xl border-2 transition-all ${borderClass}`}
                      >
                        <IconComponent className={`w-12 h-12 mb-4 ${iconColor}`} />
                        <span className="font-bold text-lg">{cat.name}</span>
                        <span className="text-sm text-slate-500 mt-1">{cat.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: ROLE & SCALE */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Specify your requirements</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Select Roles Needed (Multiple possible)</label>
                    <div className="grid sm:grid-cols-1 gap-3">
                      {(categories.find(c => c.value === formData.category)?.roles || []).map((roleOption: string) => {
                        const isSelected = formData.requirements.some((r: any) => r.name === roleOption);
                        return (
                          <div key={roleOption} className={`border rounded-xl p-4 transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}>
                            <label className="flex items-center gap-3 cursor-pointer w-full">
                              <input 
                                type="checkbox"
                                className="w-5 h-5 accent-emerald-500"
                                checked={isSelected}
                                onChange={() => toggleRole(roleOption)}
                              />
                              <span className="font-semibold text-lg">{roleOption}</span>
                            </label>
                            {isSelected && (
                              <div className="mt-4 flex items-center gap-4 pl-8 border-t border-emerald-200 dark:border-emerald-900/30 pt-4">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Personnel count:</span>
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => updateRoleCount(roleOption, Math.max(1, (formData.requirements.find(r => r.name === roleOption)?.count || 1) - 1))}
                                    className="w-8 h-8 rounded-l-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number" 
                                    min="1" 
                                    max="500" 
                                    value={formData.requirements.find(r => r.name === roleOption)?.count || 1}
                                    onChange={(e) => updateRoleCount(roleOption, parseInt(e.target.value) || 1)}
                                    className="w-16 h-8 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 text-center font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                  <button 
                                    onClick={() => updateRoleCount(roleOption, (formData.requirements.find(r => r.name === roleOption)?.count || 1) + 1)}
                                    className="w-8 h-8 rounded-r-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={formData.requirements.length === 0}
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
                    <label className="block text-sm font-semibold mb-2">
                      {formData.category === 'CCTV' ? 'Service Required' : 'Shift Timing'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(formData.category === 'CCTV' 
                        ? ['New Installation', 'Maintenance', 'IT Support']
                        : ['Day Shift', 'Night Shift', '24 Hours']
                      ).map(timing => (
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
                  <div>
                    <label className="block text-sm font-semibold mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
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
                  Thank you, {formData.name}. Our enterprise deployment team is reviewing your requirement for {formData.requirements.reduce((sum, r) => sum + r.count, 0)} personnel in {formData.city}. We will call you shortly on {formData.phone}.
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

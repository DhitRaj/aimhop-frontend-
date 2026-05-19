"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, CheckCircle2, Shield, Users, Camera, Upload, Languages } from "lucide-react";
import Link from "next/link";

export default function GetJobPage() {
  const [step, setStep] = useState(1);
  const [isHindi, setIsHindi] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    role: "",
    city: "",
    salary: "",
    aadhaar: "",
  });

  const updateForm = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const submitForm = async () => {
    console.log("Submitting Job Application:", formData);
    setStep(5);
  };

  const t = (en: string, hi: string) => isHindi ? hi : en;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow pt-20 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
            >
              <Languages className="w-4 h-4 text-blue-500" />
              {isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-10">
            
            {/* STEP 1: CATEGORY */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold mb-2 text-center">
                  {t("What job are you looking for?", "आप कौन सी नौकरी खोज रहे हैं?")}
                </h2>
                <p className="text-slate-500 mb-8 text-center text-sm">
                  {t("Select the type of work you do.", "आप जो काम करते हैं उसे चुनें।")}
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => { updateForm("category", "SECURITY"); nextStep(); }}
                    className="w-full flex items-center p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                  >
                    <Shield className="w-10 h-10 text-emerald-500 mr-4" />
                    <div>
                      <span className="block font-bold text-lg">{t("Security Guard", "सुरक्षा गार्ड (Security)")}</span>
                      <span className="block text-sm text-slate-500">{t("Armed, Unarmed, Bouncer", "हथियारबंद, बिना हथियार, बाउंसर")}</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { updateForm("category", "MANPOWER"); nextStep(); }}
                    className="w-full flex items-center p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                  >
                    <Users className="w-10 h-10 text-blue-500 mr-4" />
                    <div>
                      <span className="block font-bold text-lg">{t("Facility Staff", "फैसिलिटी स्टाफ")}</span>
                      <span className="block text-sm text-slate-500">{t("Housekeeping, Labour, Peon", "सफाईकर्मी, लेबर, चपरासी")}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold mb-6">
                  {t("Enter your details", "अपना विवरण दर्ज करें")}
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-1">{t("Full Name", "पूरा नाम")}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder={t("As per Aadhaar", "आधार कार्ड के अनुसार")}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">{t("Phone Number", "फ़ोन नंबर")}</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="10 digit number"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">{t("City", "शहर")}</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      placeholder={t("Where do you live?", "आप कहाँ रहते हैं?")}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-lg"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg">{t("Back", "पीछे")}</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.name || !formData.phone || !formData.city}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {t("Next", "आगे बढ़ें")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENTS */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold mb-2">
                  {t("Upload Aadhaar", "आधार कार्ड अपलोड करें")}
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  {t("Required for police verification.", "पुलिस वेरिफिकेशन के लिए आवश्यक है।")}
                </p>
                
                <div className="space-y-5">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <Camera className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="font-bold text-blue-600 dark:text-blue-400">{t("Take a Photo", "फोटो खींचें")}</span>
                    <span className="text-xs text-slate-500 mt-1">{t("Or upload from gallery", "या गैलरी से अपलोड करें")}</span>
                    {/* MVP Dummy Input */}
                    <input type="file" className="hidden" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">{t("Aadhaar Number (Optional)", "आधार नंबर (वैकल्पिक)")}</label>
                    <input 
                      type="text" 
                      value={formData.aadhaar}
                      onChange={(e) => updateForm("aadhaar", e.target.value)}
                      placeholder="12 digit number"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-lg tracking-widest"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={prevStep} className="px-6 py-3 font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg">{t("Back", "पीछे")}</button>
                  <button 
                    onClick={submitForm} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center shadow-lg shadow-blue-500/30"
                  >
                    {t("Submit Application", "आवेदन जमा करें")}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 5 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold mb-3">
                  {t("Application Sent!", "आवेदन भेजा गया!")}
                </h2>
                <p className="text-slate-500 mb-8 text-sm">
                  {t(
                    `Thank you, ${formData.name}. Our HR team will call you at ${formData.phone} within 24 hours.`,
                    `धन्यवाद, ${formData.name}। हमारी HR टीम आपको 24 घंटे के अंदर ${formData.phone} पर कॉल करेगी।`
                  )}
                </p>
                <Link href="/">
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3 rounded-lg hover:opacity-90 w-full">
                    {t("Go to Homepage", "होमपेज पर जाएं")}
                  </button>
                </Link>
              </div>
            )}

          </div>

          {/* WhatsApp Fallback */}
          {step < 5 && (
            <div className="mt-8 text-center">
              <a href="https://wa.me/9151385320" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/30 px-6 py-3 rounded-full hover:bg-emerald-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                {t("Apply via WhatsApp instead", "व्हाट्सएप के जरिए अप्लाई करें")}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Shield, 
  Users, 
  Camera, 
  Upload, 
  Languages, 
  FileText, 
  Sparkles,
  MapPin,
  Ruler,
  Scale,
  Award,
  Wallet,
  Phone,
  User,
  Cctv,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { workerAPI, hireCategoryAPI, settingsAPI } from "@/lib/api";

export default function GetJobPage() {
  const [step, setStep] = useState(1);
  const [isHindi, setIsHindi] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("9151385320");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    role: "",
    city: "",
    salary: "",
    aadhaar: "",
    height: "",
    weight: "",
    experience: "",
  });

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch settings on mount to retrieve dynamic WhatsApp number
    settingsAPI.get().then(res => {
      if (res?.data?.whatsappNumber) {
        setWhatsappNumber(res.data.whatsappNumber);
      }
    }).catch(err => console.error("Failed to load settings:", err));
    // Fetch categories on mount
    hireCategoryAPI.getActive().then(res => {
      const data = res.data || res;
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((c: any) => ({
          ...c,
          code: c.code || c.value || ""
        }));
        setCategories(normalized);
      } else {
        // Fallback standard categories if empty
        setCategories([
          { code: "SECURITY", value: "SECURITY", name: "Security Services", roles: ["Security Guard", "Supervisor", "Bouncer", "Gunman"] },
          { code: "MANPOWER", value: "MANPOWER", name: "Facility Manpower", roles: ["Housekeeper", "Pantry Boy", "Office Peon", "Loader"] },
          { code: "CCTV", value: "CCTV", name: "CCTV & IT Support", roles: ["CCTV Technician", "IT Helpdesk", "System Admin"] },
        ]);
      }
    }).catch(err => {
      console.error("Failed to load categories:", err);
      setCategories([
        { code: "SECURITY", value: "SECURITY", name: "Security Services", roles: ["Security Guard", "Supervisor", "Bouncer", "Gunman"] },
        { code: "MANPOWER", value: "MANPOWER", name: "Facility Manpower", roles: ["Housekeeper", "Pantry Boy", "Office Peon", "Loader"] },
        { code: "CCTV", value: "CCTV", name: "CCTV & IT Support", roles: ["CCTV Technician", "IT Helpdesk", "System Admin"] },
      ]);
    });
  }, []);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCategorySelect = (catCode: string) => {
    const cat = categories.find(c => (c.code || c.value) === catCode);
    setFormData(prev => ({
      ...prev,
      category: catCode,
      role: cat?.roles?.[0] || ""
    }));
    setStep(2);
  };

  const getNextStep = (current: number) => {
    if (current === 2) {
      if ((formData.category || "").toUpperCase() === "SECURITY") return 3;
      return 4; // Skip physical stats for non-security categories
    }
    return current + 1;
  };

  const getPrevStep = (current: number) => {
    if (current === 4) {
      if ((formData.category || "").toUpperCase() === "SECURITY") return 3;
      return 2;
    }
    return current - 1;
  };

  const handleNext = () => setStep(getNextStep(step));
  const handlePrev = () => setStep(getPrevStep(step));

  const submitForm = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = new FormData();
      data.append("fullName", formData.name);
      data.append("phone", formData.phone);
      data.append("category", formData.category);
      data.append("role", formData.role);
      data.append("city", formData.city);
      data.append("expectedSalary", formData.salary || "0");
      data.append("aadhaarNumber", formData.aadhaar);
      data.append("height", formData.height || "");
      data.append("weight", formData.weight || "");
      data.append("experience", formData.experience || "0");

      if (aadhaarFile) data.append("aadhaarDoc", aadhaarFile);
      if (photoFile) data.append("photo", photoFile);
      if (resumeFile) data.append("resume", resumeFile);

      const res = await workerAPI.submit(data);
      if (res.error) {
        setErrorMessage(res.error || "Failed to submit application");
      } else {
        setStep(5);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyViaWhatsApp = async () => {
    if (!formData.name || !formData.phone || !formData.city || !formData.aadhaar) {
      setErrorMessage(t("Please fill all required details (Name, Phone, City, Aadhaar) before applying.", "कृपया आवेदन करने से पहले सभी आवश्यक विवरण (नाम, फ़ोन, शहर, आधार) भरें।"));
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    
    try {
      // 1. Submit to database first to ensure candidate profile is logged
      const data = new FormData();
      data.append("fullName", formData.name);
      data.append("phone", formData.phone);
      data.append("category", formData.category);
      data.append("role", formData.role);
      data.append("city", formData.city);
      data.append("expectedSalary", formData.salary || "0");
      data.append("aadhaarNumber", formData.aadhaar);
      data.append("height", formData.height || "");
      data.append("weight", formData.weight || "");
      data.append("experience", formData.experience || "0");
      
      if (aadhaarFile) data.append("aadhaarDoc", aadhaarFile);
      if (photoFile) data.append("photo", photoFile);
      if (resumeFile) data.append("resume", resumeFile);
      
      await workerAPI.submit(data).catch(err => console.error("DB application save failed, proceeding with WhatsApp", err));
      
      // 2. Format detailed, professional bilingual WhatsApp message
      const isSecurityRole = (formData.category || "").toUpperCase() === "SECURITY";
      const catObj = categories.find(c => (c.code || c.value) === formData.category);
      const catName = catObj ? catObj.name : formData.category;
      
      let message = `*AIMHOP SECURITY SOLUTIONS - JOB APPLICATION*\n`;
      message += `-------------------------------------------\n`;
      message += `*Name (नाम):* ${formData.name}\n`;
      message += `*WhatsApp No (फ़ोन):* ${formData.phone}\n`;
      message += `*Aadhaar No (आधार):* ${formData.aadhaar}\n`;
      message += `*Category (श्रेणी):* ${catName}\n`;
      message += `*Role (पद):* ${formData.role}\n`;
      message += `*City (शहर):* ${formData.city}\n`;
      message += `*Expected Salary (वेतन):* ₹${formData.salary || "0"}/month\n`;
      message += `*Experience (अनुभव):* ${formData.experience || "0"} Years\n`;
      
      if (isSecurityRole) {
        if (formData.height) message += `*Height (ऊंचाई):* ${formData.height}\n`;
        if (formData.weight) message += `*Weight (वजन):* ${formData.weight}\n`;
      }
      message += `-------------------------------------------\n`;
      message += `Please review my application. Thank you!`;
      
      const encoded = encodeURIComponent(message);
      
      // 3. Open WhatsApp link
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
      
      setStep(5);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to redirect. Opening WhatsApp directly...");
      
      // Fallback direct opening
      const isSecurityRole = (formData.category || "").toUpperCase() === "SECURITY";
      const catObj = categories.find(c => (c.code || c.value) === formData.category);
      const catName = catObj ? catObj.name : formData.category;
      let message = `*AIMHOP SECURITY SOLUTIONS - JOB APPLICATION*\n`;
      message += `-------------------------------------------\n`;
      message += `*Name (नाम):* ${formData.name}\n`;
      message += `*WhatsApp No (फ़ोन):* ${formData.phone}\n`;
      message += `*Aadhaar No (आधार):* ${formData.aadhaar}\n`;
      message += `*Category (श्रेणी):* ${catName}\n`;
      message += `*Role (पद):* ${formData.role}\n`;
      message += `*City (शहर):* ${formData.city}\n`;
      message += `*Expected Salary (वेतन):* ₹${formData.salary || "0"}/month\n`;
      message += `*Experience (अनुभव):* ${formData.experience || "0"} Years\n`;
      if (isSecurityRole) {
        if (formData.height) message += `*Height (ऊंचाई):* ${formData.height}\n`;
        if (formData.weight) message += `*Weight (वजन):* ${formData.weight}\n`;
      }
      message += `-------------------------------------------\n`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const t = (en: string, hi: string) => isHindi ? hi : en;

  // Find selected category object
  const selectedCat = categories.find(c => (c.code || c.value) === formData.category);

  // Helper icon for category selection
  const getCategoryIcon = (code?: string) => {
    const upper = (code || "").toUpperCase();
    if (upper === "SECURITY") return <Shield className="w-10 h-10 text-emerald-500 mr-4 shrink-0" />;
    if (upper === "MANPOWER") return <Users className="w-10 h-10 text-blue-500 mr-4 shrink-0" />;
    return <Cctv className="w-10 h-10 text-[#FF8C47] mr-4 shrink-0" />;
  };

  const totalFormSteps = (formData.category || "").toUpperCase() === "SECURITY" ? 4 : 3;
  const currentProgress = step === 5 ? 100 : Math.round(((step - 1) / totalFormSteps) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-[1240px] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left branding banner */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 bg-[#E8F8ED] dark:bg-[#1e3a28] border border-[#5CC67A]/20 px-4 py-2 rounded-full text-xs font-semibold text-[#3daa5e] dark:text-[#7de09a] transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              {t("Direct Recruitment Portal", "सीधी भर्ती पोर्टल")}
            </div>
            
            <h1 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(36px,4.5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] text-slate-900 dark:text-white">
              {t("Get a stable job in Gorakhpur & UP", "गोरखपुर और यूपी में पक्की नौकरी पाएं")}
            </h1>
            <p className="text-[17px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed">
              {t(
                "AimHop offers timely salaries, legal benefits (PF, ESIC), free training and secure career growth. Apply in 4 simple steps.",
                "AimHop आपको देता है समय पर सैलरी, PF और ESIC फंड सुविधाएं, मुफ्त ट्रेनिंग और बेहतरीन भविष्य। सिर्फ 4 आसान कदमों में अप्लाई करें।"
              )}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              {[
                { title: t("Free Uniform & Training", "फ्री वर्दी और ट्रेनिंग"), desc: t("No registration or training fees charged.", "कोई भी भर्ती या ट्रेनिंग फीस नहीं ली जाती।") },
                { title: t("Timely Salary (7th of Month)", "हर महीने 7 तारीख को सैलरी"), desc: t("Direct bank transfer with PF slip.", "सीधे बैंक खाते में PF स्लिप के साथ सैलरी।") },
                { title: t("Physical Fitness Priority", "शारीरिक तंदुरुस्ती को प्राथमिकता"), desc: t("Special benefits for fit security guards.", "फिट सुरक्षा गार्डों के लिए विशेष भत्ते और सुविधाएं।") }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#5CC67A]/20 flex items-center justify-center text-[#3daa5e] mt-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px]">{item.title}</h4>
                    <p className="text-xs text-[#6B7068] dark:text-[#94a3b8]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Language & Step Indicator */}
            <div className="flex items-center justify-between">
              {step < 5 ? (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#5CC67A] transition-all duration-300"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">
                    {t("Step", "कदम")} {step === 4 && formData.category.toUpperCase() !== "SECURITY" ? 3 : step} {t("of", "का")} {totalFormSteps}
                  </span>
                </div>
              ) : (
                <div />
              )}
              
              <button 
                onClick={() => setIsHindi(!isHindi)}
                className="flex items-center gap-2 bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm text-slate-700 dark:text-slate-300 hover:border-[#5CC67A]/50 transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-[#5CC67A]" />
                {isHindi ? 'English' : 'हिंदी'}
              </button>
            </div>

            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.2)] p-8 sm:p-10 transition-colors duration-200 min-h-[400px] flex flex-col justify-between">
              
              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                  <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold mb-2">
                    {t("Choose Job Category", "नौकरी की श्रेणी चुनें")}
                  </h2>
                  <p className="text-[#6B7068] dark:text-[#94a3b8] mb-8 text-sm">
                    {t("Select the field you want to apply for.", "उस क्षेत्र का चयन करें जिसमें आप काम करना चाहते हैं।")}
                  </p>
                  
                  <div className="grid gap-4">
                    {categories.map((cat) => (
                      <button 
                        key={cat.code || cat.value}
                        onClick={() => handleCategorySelect(cat.code || cat.value)}
                        className="w-full flex items-center p-5 sm:p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#5CC67A] hover:bg-[#E8F8ED]/20 dark:hover:bg-[#1e3a28]/10 transition-all text-left group"
                      >
                        {getCategoryIcon(cat.code || cat.value)}
                        <div className="flex-grow">
                          <span className="block font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-[#3daa5e] transition-colors">{t(cat.name, cat.name === 'Security Services' ? 'सुरक्षा सेवाएं (Security)' : cat.name === 'Facility Manpower' ? 'सुविधा जनशक्ति (Manpower)' : 'सीसीटीवी और आईटी सपोर्ट')}</span>
                          <span className="block text-xs text-[#6B7068] dark:text-[#94a3b8] mt-1">
                            {cat.roles ? cat.roles.join(" • ") : t("Various positions available", "कई पद उपलब्ध हैं")}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#3daa5e] group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL DETAILS */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                  <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold mb-2">
                    {t("Basic Information", "बुनियादी जानकारी")}
                  </h2>
                  <p className="text-[#6B7068] dark:text-[#94a3b8] mb-6 text-sm">
                    {t("Fill in your contact and employment preferences.", "अपने संपर्क और नौकरी से जुड़ी प्राथमिकताएं भरें।")}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Selected Role Dynamic Dropdown */}
                    {selectedCat?.roles && selectedCat.roles.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Select Role", "पद चुनें")}</label>
                        <select 
                          value={formData.role}
                          onChange={(e) => updateForm("role", e.target.value)}
                          className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                        >
                          {selectedCat.roles.map((r: string) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Full Name", "पूरा नाम")}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                            placeholder={t("As per Aadhaar", "आधार के अनुसार")}
                            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Phone Number", "मोबाइल नंबर")}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            required
                            value={formData.phone}
                            onChange={(e) => updateForm("phone", e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="10 digit number"
                            maxLength={10}
                            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Current City", "वर्तमान शहर")}</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            required
                            value={formData.city}
                            onChange={(e) => updateForm("city", e.target.value)}
                            placeholder="e.g. Gorakhpur"
                            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Expected Salary (Monthly)", "अपेक्षित सैलरी (मासिक)")}</label>
                        <div className="relative">
                          <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.salary}
                            onChange={(e) => updateForm("salary", e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="e.g. 15000"
                            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Experience (Years)", "कुल अनुभव (वर्षों में)")}</label>
                        <div className="relative">
                          <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.experience}
                            onChange={(e) => updateForm("experience", e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="e.g. 2"
                            className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <button 
                      onClick={handlePrev} 
                      className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t("Back", "पीछे")}
                    </button>
                    <button 
                      onClick={handleNext} 
                      disabled={!formData.name || !formData.phone || formData.phone.length < 10 || !formData.city}
                      className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:hover:bg-[#2563EB] transition-all flex justify-center items-center gap-2 text-sm shadow-md"
                    >
                      {t("Next Step", "आगे बढ़ें")} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PHYSICAL STATS (Only for Security guards) */}
              {step === 3 && formData.category.toUpperCase() === "SECURITY" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                  <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold mb-2">
                    {t("Physical Standards Check", "शारीरिक मापदंड जांच")}
                  </h2>
                  <p className="text-[#6B7068] dark:text-[#94a3b8] mb-6 text-sm">
                    {t("Required for security roles verification.", "सुरक्षा गार्ड भर्ती के लिए शारीरिक मापदंड आवश्यक हैं।")}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">
                        {t("Height (e.g. 5'8\" or 172 cm)", "ऊंचाई (उदा. 5'8\" या 172 सेमी)")}
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={formData.height}
                          onChange={(e) => updateForm("height", e.target.value)}
                          placeholder={"e.g. 5'9\""}
                          className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">
                        {t("Weight (in kg)", "वजन (किलोग्राम में)")}
                      </label>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={formData.weight}
                          onChange={(e) => updateForm("weight", e.target.value)}
                          placeholder="e.g. 70 kg"
                          className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <button 
                      onClick={handlePrev} 
                      className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t("Back", "पीछे")}
                    </button>
                    <button 
                      onClick={handleNext} 
                      disabled={!formData.height || !formData.weight}
                      className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:hover:bg-[#2563EB] transition-all flex justify-center items-center gap-2 text-sm shadow-md"
                    >
                      {t("Next Step", "आगे बढ़ें")} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS UPLOAD */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                  <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold mb-2">
                    {t("Verification Documents", "सत्यापन दस्तावेज़")}
                  </h2>
                  <p className="text-[#6B7068] dark:text-[#94a3b8] mb-6 text-sm">
                    {t("Please provide Aadhaar and/or Resume to complete validation.", "कृपया सत्यापन पूरा करने के लिए आधार और/या बायोडाटा अपलोड करें।")}
                  </p>
                  
                  <div className="space-y-4">
                    
                    {/* Aadhaar Number Input */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Aadhaar Number (12 Digits)", "आधार नंबर (12 अंक)")}</label>
                      <input 
                        type="text" 
                        value={formData.aadhaar}
                        onChange={(e) => updateForm("aadhaar", e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={12}
                        placeholder="0000 0000 0000"
                        className="w-full bg-[#FAFAF8] dark:bg-[#1e1e24] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold tracking-[2px] focus:border-[#5CC67A] focus:ring-2 focus:ring-[#5CC67A]/10 outline-none transition-all text-center"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      
                      {/* Aadhaar Front Card Image Upload */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Aadhaar Front Photo", "आधार कार्ड की फोटो")}</label>
                        <input 
                          type="file" 
                          id="aadhaar-file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                        />
                        <label 
                          htmlFor="aadhaar-file"
                          className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors min-h-[90px]"
                        >
                          <Camera className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            {aadhaarFile ? aadhaarFile.name.substring(0, 16) + '...' : t("Upload Front Photo", "फोटो चुनें")}
                          </span>
                        </label>
                      </div>

                      {/* Profile Photo Image Upload */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">{t("Profile Photo (for ID Card)", "अपनी फोटो (ID कार्ड के लिए)")}</label>
                        <input 
                          type="file" 
                          id="photo-file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        />
                        <label 
                          htmlFor="photo-file"
                          className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors min-h-[90px]"
                        >
                          <User className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            {photoFile ? photoFile.name.substring(0, 16) + '...' : t("Upload Profile Photo", "अपनी फोटो चुनें")}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Resume PDF upload */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#6B7068] uppercase tracking-[0.5px]">
                        {t("Resume / Bio-Data (Optional for Guards, PDF)", "बायोडाटा / रिज्यूमे (वैकल्पिक, PDF)")}
                      </label>
                      <input 
                        type="file" 
                        id="worker-resume"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const selected = e.target.files?.[0] || null;
                          if (selected && selected.type !== "application/pdf") {
                            setErrorMessage(t("Only PDF file allowed for resume", "रिज्यूमे केवल PDF फाइल होना चाहिए"));
                            return;
                          }
                          setResumeFile(selected);
                        }}
                      />
                      <label 
                        htmlFor="worker-resume"
                        className="flex items-center gap-3 p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        {resumeFile ? (
                          <div className="flex items-center gap-2 text-emerald-500">
                            <FileText className="w-5 h-5 shrink-0" />
                            <span className="text-xs font-bold">{resumeFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                            <span className="text-xs text-slate-500 font-bold">{t("Click to upload PDF resume", "बायोडाटा PDF अपलोड करने के लिए क्लिक करें")}</span>
                          </>
                        )}
                      </label>
                    </div>

                    {errorMessage && (
                      <p className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-900">
                        {errorMessage}
                      </p>
                    )}

                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <button 
                      onClick={handlePrev} 
                      className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t("Back", "पीछे")}
                    </button>
                    
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <button 
                        onClick={submitForm} 
                        disabled={loading}
                        className="w-full bg-[#5CC67A] hover:bg-[#3daa5e] text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all flex justify-center items-center gap-2 text-sm shadow-md"
                      >
                        {loading ? t("Submitting...", "जमा किया जा रहा है...") : t("Submit Application", "आवेदन जमा करें")}
                      </button>

                      <button 
                        onClick={applyViaWhatsApp} 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all flex justify-center items-center gap-2 text-sm shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        {loading ? t("Connecting...", "कनेक्ट हो रहा है...") : t("Quick Apply via WhatsApp", "व्हाट्सएप से आवेदन")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: SUCCESS STATE */}
              {step === 5 && (
                <div className="text-center animate-in zoom-in-95 duration-400 py-6">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 border border-[#5CC67A]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#3daa5e]" />
                  </div>
                  <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                    {t("Application Sent!", "आवेदन सफलतापूर्वक भेजा गया!")}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                    {t(
                      `Thank you, ${formData.name}. Our HR verification team will contact you on ${formData.phone} within 24 hours.`,
                      `धन्यवाद, ${formData.name}। हमारी भर्ती टीम आपसे 24 घंटे के अंदर मोबाइल नंबर ${formData.phone} पर संपर्क करेगी।`
                    )}
                  </p>
                  <Link href="/">
                    <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-white font-bold px-8 py-3.5 rounded-xl text-sm w-full transition-all shadow-md">
                      {t("Go to Homepage", "होमपेज पर वापस जाएं")}
                    </button>
                  </Link>
                </div>
              )}

            </div>

            {/* WhatsApp Fallback */}
            {step < 5 && (
              <div className="text-center">
                <a 
                  href="https://wa.me/9151385320" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 px-8 py-3.5 rounded-full hover:bg-[#E8F8ED] dark:hover:bg-[#1e3a28]/20 transition-all w-full md:w-auto"
                >
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  {t("Quick Apply via WhatsApp", "व्हाट्सएप द्वारा त्वरित आवेदन")}
                </a>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

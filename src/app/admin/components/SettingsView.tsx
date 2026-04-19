"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  Globe, 
  Layout, 
  User, 
  Share2, 
  BarChart3,
  Save,
  Upload,
  Check,
  Shield,
  FileText,
  ChevronRight,
  Database,
  Loader2,
  Plus,
  ArrowRight,
  Monitor,
  Activity,
  Briefcase
} from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
import { Settings } from "../types";

export function SettingsView({ settings: initialSettings, refresh }: { settings: Settings, refresh: () => void }) {
  const getDefaultFeature = (idx: number) => ({
    title: idx === 1 ? 'Experienced Staff' : idx === 2 ? 'Top-Tier Quality' : 'Affordable',
    desc: idx === 1 ? 'We have experienced professionals who can easily understand our clients requirements.' :
          idx === 2 ? 'Our no compromise approach to quality ensures that our solutions are user friendly forever.' :
          'We provide cost-effective solutions without compromising on the security standards.'
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const s = initialSettings || {} as Settings;
    return {
      ...s,
      feature1Title: s.feature1Title || getDefaultFeature(1).title,
      feature1Desc: s.feature1Desc || getDefaultFeature(1).desc,
      feature2Title: s.feature2Title || getDefaultFeature(2).title,
      feature2Desc: s.feature2Desc || getDefaultFeature(2).desc,
      feature3Title: s.feature3Title || getDefaultFeature(3).title,
      feature3Desc: s.feature3Desc || getDefaultFeature(3).desc,
      socials: s.socials || {}
    };
  });

  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("general");
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [contactImageFile, setContactImageFile] = useState<File | null>(null);
  const [directorImageFile, setDirectorImageFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [cctvImageFile, setCctvImageFile] = useState<File | null>(null);

  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewFavicon, setPreviewFavicon] = useState<string | null>(null);
  const [previewContact, setPreviewContact] = useState<string | null>(null);
  const [previewDirector, setPreviewDirector] = useState<string | null>(null);
  const [previewHero, setPreviewHero] = useState<string | null>(null);
  const [previewCctv, setPreviewCctv] = useState<string | null>(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings((prev: any) => ({
        ...prev,
        ...initialSettings,
        feature1Title: initialSettings.feature1Title || getDefaultFeature(1).title,
        feature1Desc: initialSettings.feature1Desc || getDefaultFeature(1).desc,
        feature2Title: initialSettings.feature2Title || getDefaultFeature(2).title,
        feature2Desc: initialSettings.feature2Desc || getDefaultFeature(2).desc,
        feature3Title: initialSettings.feature3Title || getDefaultFeature(3).title,
        feature3Desc: initialSettings.feature3Desc || getDefaultFeature(3).desc,
        socials: initialSettings.socials || prev.socials
      }));
      
      const t = `?t=${Date.now()}`;
      setPreviewLogo(initialSettings.logo ? getMediaUrl(initialSettings.logo) + t : null);
      setPreviewFavicon(initialSettings.favicon ? getMediaUrl(initialSettings.favicon) + t : null);
      setPreviewContact(initialSettings.contactImage ? getMediaUrl(initialSettings.contactImage) + t : null);
      setPreviewDirector(initialSettings.directorImage ? getMediaUrl(initialSettings.directorImage) + t : null);
      setPreviewHero(initialSettings.heroImage ? getMediaUrl(initialSettings.heroImage) + t : null);
      setPreviewCctv(initialSettings.cctvImage ? getMediaUrl(initialSettings.cctvImage) + t : null);
    }
  }, [initialSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      Object.keys(settings).forEach(key => {
        if (key === 'socials') {
          formData.append('socials', JSON.stringify(settings.socials || {}));
        } else if (!['_id', '__v', 'createdAt', 'updatedAt', 'logo', 'favicon', 'heroImage', 'contactImage', 'directorImage', 'cctvImage'].includes(key)) {
          const val = settings[key];
          formData.append(key, val === undefined || val === null ? '' : String(val));
        }
      });

      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      if (contactImageFile) formData.append('contactImage', contactImageFile);
      if (directorImageFile) formData.append('directorImage', directorImageFile);
      if (heroImageFile) formData.append('heroImage', heroImageFile);
      if (cctvImageFile) formData.append('cctvImage', cctvImageFile);

      const { error } = await settingsAPI.save(formData);

      if (!error) {
        setLogoFile(null);
        setFaviconFile(null);
        setContactImageFile(null);
        setDirectorImageFile(null);
        setHeroImageFile(null);
        setCctvImageFile(null);

        refresh();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: "general", label: "General Info", icon: Database, desc: "Basic website info" },
    { id: "branding", label: "Logo & Branding", icon: Shield, desc: "Logos & website icons" },
    { id: "homepage", label: "Home Content", icon: Monitor, desc: "Sections on the homepage" },
    { id: "director", label: "Director Info", icon: User, desc: "Message & profile" },
    { id: "stats", label: "Stats Counters", icon: Activity, desc: "Numbers & achievements" },
    { id: "social", label: "Social Media", icon: Share2, desc: "Links to social platforms" },
    { id: "ctas", label: "Recruitment Toggle", icon: SettingsIcon, desc: "Turn careers on/off" }, 
  ];

  const inputClass = "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400";
  const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1 mb-2 block";

  return (
    <div className="space-y-8 h-full text-left">
      <div className="grid lg:grid-cols-[300px_1fr] gap-0 h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
             <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Settings Panel</h2>
             <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">Configure your site</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex flex-col p-4 rounded-xl text-left transition-all relative group ${
                  activeSubTab === item.id
                    ? "bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
                    : "hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <item.icon size={18} className={activeSubTab === item.id ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"} />
                  <span className={`text-xs font-semibold tracking-wide ${activeSubTab === item.id ? "text-slate-900 dark:text-white" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200"}`}>{item.label}</span>
                  {activeSubTab === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
             <button 
               type="submit"
               form="settings-form"
               disabled={saving}
               className="w-full bg-amber-600 text-white h-12 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
             >
               {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
               {saving ? 'Saving...' : 'Save Settings'}
             </button>
          </div>
        </aside>

        {/* Configuration Interface */}
        <form id="settings-form" onSubmit={handleSave} className="h-full overflow-y-auto bg-white dark:bg-slate-900">
          <div className="p-10 lg:p-14 max-w-4xl mx-auto space-y-14">
            {activeSubTab === "general" && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">General Information</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage basic website details</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                   >
                     {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                     Save
                   </button>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label className={labelClass}>Website Name</label>
                    <input type="text" value={settings?.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} className={inputClass} placeholder="Enter website name..." />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={settings?.contactEmail || ''} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className={inputClass} placeholder="contact@example.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Office Address</label>
                  <textarea rows={3} value={settings?.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className={inputClass + " resize-none font-medium italic"} placeholder="Enter office address..." />
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="space-y-1">
                    <label className={labelClass}>Primary Phone</label>
                    <input type="text" value={settings?.contactPhone || ''} onChange={e => setSettings({...settings, contactPhone: e.target.value})} className={inputClass} placeholder="+91.000.000.0000" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Secondary Phone</label>
                    <input type="text" value={settings?.contactPhone2 || ''} onChange={e => setSettings({...settings, contactPhone2: e.target.value})} className={inputClass} placeholder="+91.000.000.0000" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>WhatsApp Number</label>
                    <input type="text" value={settings?.whatsappNumber || ''} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className={inputClass} placeholder="919151385320" />
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "branding" && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Logo & Branding</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Logos and website icons</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                   >
                     {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                     Save
                   </button>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className={labelClass}>Main Website Logo</label>
                    <div className="aspect-[2/1] bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200/50 dark:border-slate-800 flex flex-col items-center justify-center p-8 relative group hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors">
                      {logoFile ? <img src={URL.createObjectURL(logoFile)} className="max-h-full object-contain" /> :
                       settings?.logo ? <img src={getMediaUrl(settings.logo)} className="max-h-full object-contain" /> : 
                       <ImageIcon size={32} className="text-slate-300 dark:text-slate-700" />}
                      <input type="file" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="absolute bottom-4 right-4 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Edit Logo</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic mt-2">* Recommended size: 512x512px (Square) or 1024x256px (Horizontal). Use a transparent PNG for the best visual integration.</p>
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Favicon (Browser Icon)</label>
                    <div className="aspect-[2/1] bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200/50 dark:border-slate-800 flex flex-col items-center justify-center p-8 relative group hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors">
                      {faviconFile ? <Check size={32} className="text-emerald-500" /> : 
                       settings?.favicon ? <img src={getMediaUrl(settings.favicon)} className="w-12 h-12 object-contain" /> : 
                       <ImageIcon size={32} className="text-slate-300 dark:text-slate-700" />}
                      <input type="file" onChange={e => setFaviconFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="absolute bottom-4 right-4 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Edit Icon</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic mt-2">* Recommended size: 64x64px or 512x512px (Square PNG). This icon appears in browser tabs.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "homepage" && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Homepage Features</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage the top 3 highlights on home page</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20"
                   >
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save
                   </button>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800 pb-10">
                  <div className="space-y-4">
                    <label className={labelClass}>Hero Background Image (Fallback)</label>
                    <div className="aspect-[21/9] bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all group">
                      {previewHero ? (
                        <div className="relative w-full h-full">
                          <img src={previewHero} className="w-full h-full object-cover" alt="Hero Section" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                            <Upload size={24} className="mb-2" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Change Hero Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-sky-500 transition-colors">
                          <Upload size={32} />
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Hero Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setHeroImageFile(file);
                          setPreviewHero(URL.createObjectURL(file));
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Hero Title Fallback</label>
                    <input type="text" value={settings?.heroTitle || ''} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className={inputClass} placeholder="Security You Can Always Trust." />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Hero Subtitle Fallback</label>
                    <textarea rows={2} value={settings?.heroSubtitle || ''} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className={inputClass + " resize-none font-medium"} placeholder="AimHop Security Solutions Pvt. Ltd..." />
                  </div>
                  <p className="text-[9px] text-slate-400 italic mt-2">
                    * This serves as the Global Fallback Banner. It will appear on any page that doesn't have a specific banner assigned in the "Banner Management" section. Recommended size: 1920x500px.
                  </p>
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800 pb-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className={labelClass}>CTA Section Image (Need Security?)</label>
                      <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all group">
                        {previewContact ? (
                          <div className="relative w-full h-full">
                            <img src={previewContact} className="w-full h-full object-cover" alt="Contact Section" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                              <Upload size={24} className="mb-2" />
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-sky-500 transition-colors">
                            <Upload size={32} />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setContactImageFile(file);
                            setPreviewContact(URL.createObjectURL(file));
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className={labelClass}>CCTV Section Image</label>
                      <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all group">
                        {previewCctv ? (
                          <div className="relative w-full h-full">
                            <SafeImage src={previewCctv} fill className="w-full h-full object-cover" alt="CCTV Section" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                              <Upload size={24} className="mb-2" />
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-sky-500 transition-colors">
                            <Upload size={32} />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload CCTV Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCctvImageFile(file);
                            setPreviewCctv(URL.createObjectURL(file));
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-6 font-medium">
                    * Recommended size: 1200x900px (4:3 Aspect Ratio). This high-quality image appears in the "Need Security?" and "CCTV" sections on the homepage.
                  </p>
                </div>
                <div className="space-y-8">
                  {['feature1', 'feature2', 'feature3'].map((f, i) => (
                    <div key={f} className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <div className="grid gap-6">
                        <div className="space-y-1">
                          <label className={labelClass}>Feature {i+1} Title</label>
                          <input placeholder={getDefaultFeature(i+1).title} value={settings?.[`${f}Title`] || ''} onChange={e => setSettings({...settings, [`${f}Title`]: e.target.value})} className={inputClass} />
                        </div>
                        <div className="space-y-1">
                          <label className={labelClass}>Feature {i+1} Description</label>
                          <input placeholder={getDefaultFeature(i+1).desc} value={settings?.[`${f}Desc`] || ''} onChange={e => setSettings({...settings, [`${f}Desc`]: e.target.value})} className={inputClass + " font-medium italic"} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "director" && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Director's Profile</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Manage leadership message and photo</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20"
                   >
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save
                   </button>
                </div>
                <div className="grid md:grid-cols-[1fr_260px] gap-12">
                  <div className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className={labelClass}>Director Name</label>
                        <input type="text" value={settings?.directorName || ''} onChange={e => setSettings({...settings, directorName: e.target.value})} className={inputClass} placeholder="Enter name..." />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Director Position</label>
                        <input type="text" value={settings?.directorRole || ''} onChange={e => setSettings({...settings, directorRole: e.target.value})} className={inputClass} placeholder="e.g. Managing Director" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Director's Message</label>
                      <textarea rows={8} value={settings?.directorMessage || ''} onChange={e => setSettings({...settings, directorMessage: e.target.value})} className={inputClass + " leading-relaxed resize-none font-medium text-sm"} placeholder="Enter official director statement..." />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Director's Photo</label>
                    <div className="aspect-[4/5] bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200/50 dark:border-slate-800 overflow-hidden relative group hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors flex items-center justify-center">
                      {previewDirector ? (
                        <div className="relative w-full h-full">
                          <img src={previewDirector} className="w-full h-full object-cover" alt="Director" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                            <Upload size={24} className="mb-2" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Update Photo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <Upload size={32} />
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Photo</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDirectorImageFile(file);
                          setPreviewDirector(URL.createObjectURL(file));
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic mt-2">* Recommended size: 800x1000px (4:5 Aspect Ratio). This professional portrait appears on both the Home and About pages.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "stats" && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Counters & Stats</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Display success numbers on the website</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20"
                   >
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save
                   </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {key: 'statsClients', label: 'Happy Clients', icon: User}, 
                    {key: 'statsProjects', label: 'Finished Projects', icon: Globe}, 
                    {key: 'statsAwards', label: 'Won Awards', icon: Shield}, 
                    {key: 'statsExperience', label: 'Years of Exp.', icon: BarChart3}
                  ].map(s => (
                    <div key={s.key} className="p-8 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-6 text-center hover:border-indigo-500/50 transition-colors group">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mx-auto border border-slate-200/50 dark:border-slate-800 shadow-sm transition-colors">
                        <s.icon size={20} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 block">{s.label}</label>
                        <input value={settings?.[s.key] || ''} onChange={e => setSettings({...settings, [s.key]: e.target.value})} className="w-full bg-transparent text-3xl font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 text-center uppercase tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" placeholder="0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "social" && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Social Media Links</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Links to your official social pages</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20"
                   >
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save
                   </button>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map(s => (
                    <div key={s} className="space-y-2">
                      <label className={labelClass}>{s} profile Link</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <ArrowRight size={16} />
                        </div>
                        <input value={settings?.socials?.[s] || ''} onChange={e => setSettings({...settings, socials: {...(settings.socials || {}), [s]: e.target.value}})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder={`https://${s}.com/yourpage`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "ctas" && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="pb-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Feature Toggles</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Turn on or off specific website features</p>
                   </div>
                   <button 
                     type="submit"
                     disabled={saving}
                     className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20"
                   >
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save
                   </button>
                </div>
                <div className="grid gap-6">
                  {[
                    { key: 'ctaJobEnabled', label: 'Enable Jobs / Careers', desc: 'Show the "Apply Now" buttons on the website.' },
                  ].map(cta => (
                    <div key={cta.key} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 gap-6">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em] mb-2">{cta.label}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{cta.desc}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSettings({...settings, [cta.key]: settings[cta.key] === false})}
                        className={`w-14 h-8 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 focus:ring-indigo-500 ${settings[cta.key] !== false ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full transition-all bg-white shadow-sm ${settings[cta.key] !== false ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

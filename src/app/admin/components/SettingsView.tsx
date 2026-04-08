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
  AlertCircle,
  Info
} from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function SettingsView({ settings: initialSettings, refresh }: { settings: any, refresh: () => void }) {
  // Safe initialization with default text fallback
  const getDefaultFeature = (idx: number) => ({
    title: idx === 1 ? 'Experienced Staff' : idx === 2 ? 'Top - Tier Quality' : 'Affordable',
    desc: idx === 1 ? 'We have experienced professionals who can easily understand our clients requirements.' :
          idx === 2 ? 'Our no compromise approach to quality ensures that our solutions are user friendly forever.' :
          'We provide cost-effective solutions without compromising on the security standards.'
  });

  const [settings, setSettings] = useState(() => {
    const s = initialSettings || {};
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
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [directorImageFile, setDirectorImageFile] = useState<File | null>(null);
  const [directorImagePreview, setDirectorImagePreview] = useState<string | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [featureFiles, setFeatureFiles] = useState<{ [key: string]: File | null }>({
    feature1: null,
    feature2: null,
    feature3: null,
  });


  // Keep state in sync with parent updates (from DB)
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
        } else if (!['_id', '__v', 'createdAt', 'updatedAt', 'logo', 'favicon', 'feature1Icon', 'feature2Icon', 'feature3Icon'].includes(key)) {
          const val = settings[key];
          formData.append(key, val === undefined || val === null ? '' : String(val));
        }
      });

      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      if (heroImageFile) formData.append('heroImage', heroImageFile);
      if (directorImageFile) formData.append('directorImage', directorImageFile);
      if (brochureFile) formData.append('brochure', brochureFile);
      if (featureFiles.feature1) formData.append('feature1Icon', featureFiles.feature1);
      if (featureFiles.feature2) formData.append('feature2Icon', featureFiles.feature2);
      if (featureFiles.feature3) formData.append('feature3Icon', featureFiles.feature3);

      const { error } = await settingsAPI.save(formData);

      if (!error) {
        setLogoFile(null);
        setFaviconFile(null);
        setHeroImageFile(null);
        setHeroImagePreview(null);
        setDirectorImageFile(null);
        setDirectorImagePreview(null);
        setFeatureFiles({ feature1: null, feature2: null, feature3: null });
        refresh(); // Refresh parent data
        alert("Success! Site configuration updated.");
      } else {
        alert("Backend Error: " + error);
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600/30 transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1";

  const navItems = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "branding", label: "Branding", icon: Layout },
    { id: "homepage", label: "Homepage Features", icon: Globe },
    { id: "director", label: "Director Details", icon: User },
    { id: "stats", label: "Company Stats", icon: BarChart3 },
    { id: "social", label: "Social Linkage", icon: Share2 },
    { id: "ctas", label: "CTAs & Buttons", icon: SettingsIcon }, 
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 pl-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Settings</h1>
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide italic">Securely manage your global platform assets and core content</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28 z-20">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-bold transition-all ${
                    activeSubTab === item.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                     <item.icon size={16} />
                     <span className="uppercase tracking-widest">{item.label}</span>
                  </div>
                </button>
              ))}
           </div>
        </aside>

        <form onSubmit={handleSave} className="flex-1 overflow-hidden">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[75vh]">
              <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar scroll-smooth">
                {/* --- GENERAL --- */}
                {activeSubTab === "general" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">General Identity</h3></div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Site Name</label><input type="text" value={settings?.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} className={inputClass} /></div>
                      <div><label className={labelClass}>Admin Email</label><input type="email" value={settings?.contactEmail || ''} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className={inputClass} /></div>
                    </div>
                    <div><label className={labelClass}>Official Address</label><textarea rows={3} value={settings?.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className={inputClass + " resize-none"} /></div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Primary Phone</label><input type="text" value={settings?.contactPhone || ''} onChange={e => setSettings({...settings, contactPhone: e.target.value})} className={inputClass} /></div>
                      <div><label className={labelClass}>Secondary Phone</label><input type="text" value={settings?.contactPhone2 || ''} onChange={e => setSettings({...settings, contactPhone2: e.target.value})} className={inputClass} /></div>
                    </div>
                  </div>
                )}

                {/* --- BRANDING --- */}
                {activeSubTab === "branding" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Global Branding</h3></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6 shadow-sm">
                            <div className="h-24 flex items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-32">
                               {settings?.logo ? <img src={getMediaUrl(settings.logo)} className="max-h-full object-contain" /> : <ImageIcon size={30} className="text-slate-300" />}
                            </div>
                            <label className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg hover:scale-105 transition-all">
                               <Upload size={14} /> Update Logo
                               <input type="file" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="hidden" />
                            </label>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6 shadow-sm">
                            <div className="h-24 flex items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-32">
                              {faviconFile ? <p className="text-[10px] font-black text-sky-600 uppercase text-center anim-pulse">Ready</p> : 
                               settings?.favicon ? <img src={getMediaUrl(settings.favicon)} className="max-h-full object-contain" /> : <ImageIcon size={30} className="text-slate-300" />}
                            </div>
                            <label className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg hover:scale-105 transition-all">
                               <Upload size={14} /> Update Favicon
                               <input type="file" onChange={e => setFaviconFile(e.target.files?.[0] || null)} className="hidden" />
                            </label>
                        </div>
                    </div>
                    {/* Brochure Upload */}
                    <div className="pt-6">
                        <label className={labelClass}>Company Portfolio (PDF)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/60">
                           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                              <Info size={30} className={brochureFile ? "text-sky-600" : "text-slate-300"} />
                           </div>
                           <div className="flex-1 space-y-2">
                              <p className="text-xs text-slate-400 font-medium">Upload company brochure / profile in PDF format. Current: <span className="text-slate-900 dark:text-white font-bold">{settings?.brochureUrl || 'Default'}</span></p>
                              <label className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg hover:scale-105 transition-all w-fit">
                                 <Upload size={16} /> {brochureFile ? "Change PDF" : "Upload Brochure PDF"}
                                 <input type="file" accept="application/pdf" onChange={e => setBrochureFile(e.target.files?.[0] || null)} className="hidden" />
                              </label>
                              {brochureFile && <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-1"><Check size={12}/> {brochureFile.name} — Ready to Sync</p>}
                           </div>
                        </div>
                    </div>
                  </div>
                )}


                {/* --- FEATURES (ROBUST DATA) --- */}
                {activeSubTab === "homepage" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                           <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Homepage Features</h3>
                           <div className="group relative cursor-help"><Info size={14} className="text-slate-300" /><div className="absolute left-6 top-0 w-48 p-2 bg-slate-900 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">Empty fields will show default website text.</div></div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {['feature1', 'feature2', 'feature3'].map((f, i) => (
                          <div key={f} className="p-8 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                             <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 overflow-hidden">
                                {featureFiles[f] ? <img src={URL.createObjectURL(featureFiles[f]!)} className="max-h-full object-contain" /> :
                                 settings?.[`${f}Icon`] ? <img src={getMediaUrl(settings[`${f}Icon`])} className="max-h-full object-contain" /> :
                                 <ImageIcon className="text-slate-200" size={30} />}
                             </div>
                             <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 dark:bg-sky-900/40 px-3 py-1 rounded-md">Feature {i+1}</span>
                                   <label className="cursor-pointer bg-sky-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-700 shadow-lg active:scale-95 transition-all">
                                      <Upload size={12} /> Custom Icon
                                      <input type="file" onChange={e => setFeatureFiles({...featureFiles, [f]: e.target.files?.[0] || null})} className="hidden" />
                                   </label>
                                </div>
                                <div className="grid gap-3">
                                   <input placeholder={getDefaultFeature(i+1).title} value={settings?.[`${f}Title`] || ''} onChange={e => setSettings({...settings, [`${f}Title`]: e.target.value})} className={inputClass} />
                                   <input placeholder={getDefaultFeature(i+1).desc} value={settings?.[`${f}Desc`] || ''} onChange={e => setSettings({...settings, [`${f}Desc`]: e.target.value})} className={inputClass + " text-xs"} />
                                </div>
                             </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* --- DIRECTOR --- */}
                {activeSubTab === "director" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Director Profile</h3></div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Director Name</label><input type="text" value={settings?.directorName || ''} onChange={e => setSettings({...settings, directorName: e.target.value})} className={inputClass} /></div>
                            <div><label className={labelClass}>Designation</label><input type="text" value={settings?.directorRole || ''} onChange={e => setSettings({...settings, directorRole: e.target.value})} className={inputClass} /></div>
                        </div>
                        <div><label className={labelClass}>Public Message</label><textarea rows={6} value={settings?.directorMessage || ''} onChange={e => setSettings({...settings, directorMessage: e.target.value})} className={inputClass + " leading-relaxed resize-none"} /></div>
                        
                        {/* Director Photo Upload */}
                        <div>
                          <label className={labelClass}>Director Photo (PNG / JPG / WebP)</label>
                          <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                             <div className="w-28 h-28 bg-white dark:bg-slate-900 rounded-full border-2 border-slate-100 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                                {directorImagePreview ? (
                                  <img src={directorImagePreview} className="w-full h-full object-cover" alt="Director Preview" />
                                ) : settings?.directorImage ? (
                                  <img src={getMediaUrl(settings.directorImage)} className="w-full h-full object-cover" alt="Director" />
                                ) : (
                                  <ImageIcon size={26} className="text-slate-300" />
                                )}
                             </div>
                            <div className="flex flex-col gap-3 flex-1">
                              <p className="text-xs text-slate-400 font-medium">Upload director's professional photo (PNG, JPG, WebP). Square image recommended (400×400px).</p>
                              <label className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg hover:scale-105 transition-all w-fit">
                                <Upload size={14} /> Upload Photo
                                <input type="file" accept="image/png,image/jpeg,image/webp,image/jpg" className="hidden" onChange={e => {
                                  const file = e.target.files?.[0] || null;
                                  setDirectorImageFile(file);
                                  setDirectorImagePreview(file ? URL.createObjectURL(file) : null);
                                }} />
                              </label>
                              {directorImageFile && <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">✓ {directorImageFile.name} — Ready to save</p>}
                            </div>
                          </div>
                        </div>
                    </div>
                )}

                {/* --- STATS --- */}
                {activeSubTab === "stats" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Key Indicators</h3></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              {key: 'statsClients', label: 'Clients'}, 
                              {key: 'statsProjects', label: 'Projects'}, 
                              {key: 'statsAwards', label: 'Awards'}, 
                              {key: 'statsExperience', label: 'Years'}
                            ].map(s => (
                                <div key={s.key}>
                                   <label className={labelClass}>{s.label}</label>
                                   <input value={settings?.[s.key] || ''} onChange={e => setSettings({...settings, [s.key]: e.target.value})} className={inputClass + " text-center tracking-widest"} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                    {/* --- SOCIAL --- */}
                    {activeSubTab === "social" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Official Channels</h3></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['facebook', 'twitter', 'linkedin', 'instagram'].map(s => (
                                    <div key={s}>
                                       <label className={labelClass}>{s}</label>
                                       <input value={settings?.socials?.[s] || ''} onChange={e => setSettings({...settings, socials: {...(settings.socials || {}), [s]: e.target.value}})} className={inputClass} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- CTAs & BUTTONS --- */}
                    {activeSubTab === "ctas" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-none">Interactive CTAs</h3></div>
                            <div className="grid gap-6">
                                {[
                                    { key: 'ctaJobEnabled', label: 'Enable "Apply for Job" Button', desc: 'Control visibility of recruitment buttons for candidates.' },
                                    { key: 'ctaBrochureEnabled', label: 'Enable "Download Brochure" CTA', desc: 'Allow B2B clients to access digital marketing assets.' },
                                    { key: 'ctaSafetyAuditEnabled', label: 'Enable "Free Safety Audit" Button', desc: 'Promote professional onsite security assessments.' }
                                ].map(cta => (
                                    <div key={cta.key} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                        <div className="flex-1 pr-6">
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{cta.label}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{cta.desc}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setSettings({...settings, [cta.key]: settings[cta.key] === false})}
                                            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${settings[cta.key] !== false ? 'bg-sky-600 shadow-lg shadow-sky-600/30' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${settings[cta.key] !== false ? 'left-8' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/10 dark:bg-slate-950/20 backdrop-blur-md rounded-b-[2.5rem]">
                 <button 
                   disabled={saving} 
                   type="submit" 
                   className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-sky-600/10 disabled:opacity-50 flex items-center gap-3"
                 >
                    <Save size={18} />
                    {saving ? "Publishing..." : "Sync Website Updates"}
                 </button>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}

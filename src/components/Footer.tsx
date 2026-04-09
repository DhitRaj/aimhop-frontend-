"use client";

import { Shield, Phone, Mail, MapPin, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI, serviceAPI } from "@/lib/api";
import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [footerServices, setFooterServices] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, serRes] = await Promise.all([settingsAPI.get(), serviceAPI.getAll()]);
        if (sRes.data) setSettings(sRes.data);
        if (serRes.data) setFooterServices(serRes.data.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

const FacebookIcon = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

  const socialLinks = [
    { icon: <FacebookIcon size={18} />, link: settings?.socials?.facebook || "#" },
    { icon: <TwitterIcon size={18} />, link: settings?.socials?.twitter || "#" },
    { icon: <InstagramIcon size={18} />, link: settings?.socials?.instagram || "#" },
    { icon: <LinkedinIcon size={18} />, link: settings?.socials?.linkedin || "#" },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 pt-16 pb-10 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              {settings?.logo ? (
                <div className="w-14 h-14 flex items-center justify-center">
                  <img 
                    src={getMediaUrl(settings.logo)} 
                    alt={settings.siteName || 'AimHop'} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <Shield className="w-10 h-10 text-sky-600" />
              )}
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                  {settings?.siteName ? settings.siteName.split(' ')[0] : 'Aimhop'}
                </span>
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest leading-tight">
                  {settings?.siteName && settings.siteName.includes(' ') 
                    ? settings.siteName.split(' ').slice(1).join(' ') 
                    : 'Security Solutions'}
                </span>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              AimHop Security Solutions — Started from {settings?.address?.split(',')[0] || 'Gorakhpur'}, currently providing trusted security and manpower services across India.
            </p>
            <div className="flex items-center gap-3">
               {socialLinks.map((s, i) => (
                 <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest leading-tight">
                    {s.icon}
                 </a>
               ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-sky-600 decoration-2 underline-offset-8">Our Services</h5>
             <ul className="space-y-3">
                {(footerServices.length > 0 ? footerServices : [{title: "Security Guards"}, {title: "Bodyguards"}]).map(s => (
                  <li key={s.title}>
                    <Link href="/services" className="font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors uppercase">
                      {s.title}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* Quick Links Column (NEW) */}
          <div>
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-sky-600 decoration-2 underline-offset-8">Quick Links</h5>
             <ul className="space-y-3 font-bold text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/about" className="hover:text-sky-600 transition-colors uppercase">About Agency</Link></li>
                <li><Link href="/blogs" className="hover:text-sky-600 transition-colors uppercase">News & Blogs</Link></li>
                {settings?.ctaJobEnabled !== false && (
                  <li><Link href="/careers" className="hover:text-sky-600 transition-colors uppercase">Work with us</Link></li>
                )}
                <li><Link href="/contact" className="hover:text-sky-600 transition-colors uppercase">Support</Link></li>
             </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-6">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-sky-600 decoration-2 underline-offset-8">Quick Contact</h5>
             <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                   <div className="w-10 h-10 bg-sky-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-sky-600 border border-sky-100 dark:border-slate-800">
                      <Phone size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{settings?.contactPhone || '+91 91513 85320'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 group">
                   <div className="w-10 h-10 bg-sky-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-sky-600 border border-sky-100 dark:border-slate-800">
                      <Mail size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                      <p className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-1">{settings?.contactEmail || 'info@aimhop.com'}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Head Office Column */}
          <div className="bg-sky-600 p-6 rounded-2xl border border-sky-700 space-y-4 shadow-lg relative overflow-hidden group">
             <Shield className="absolute -right-6 -bottom-6 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-1000" />
             <div className="relative z-10 space-y-3">
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Head Office</p>
                <p className="text-[11px] font-bold text-white leading-relaxed uppercase">
                   {settings?.address || 'Gorakhpur, Uttar Pradesh, India'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-white/70" />
                  <Globe className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider">PAN India Operations</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-900">
           <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               © 2026 {settings?.siteName || 'AimHop Security Solutions'} · India
             </p>
             <div className="hidden sm:block h-3 w-px bg-slate-200 dark:bg-slate-800" />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Reg. No. U74999UP2020PTC136479
             </p>
           </div>
           <div className="flex items-center gap-5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ISO Certified</span>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[9px] font-black text-sky-600/70 uppercase tracking-widest">PSARA Licensed</span>
           </div>
        </div>
      </div>
    </footer>
  );
}

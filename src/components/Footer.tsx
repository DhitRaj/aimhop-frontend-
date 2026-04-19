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
        if (serRes.data) {
          const services = Array.isArray(serRes.data) ? serRes.data : (serRes.data as any).data;
          if (Array.isArray(services)) setFooterServices(services.slice(0, 5));
        }
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
    <footer className="bg-muted dark:bg-card border-t border-border mt-auto">
      <div className="container-pad py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              {settings?.logo ? (
                <img 
                  src={getMediaUrl(settings.logo)} 
                  alt={settings.siteName || 'AimHop'} 
                  className="w-16 h-16 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              ) : (
                <Shield className="w-12 h-12 text-primary" />
              )}
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter uppercase leading-none">
                  {settings?.siteName ? settings.siteName.split(' ')[0] : 'Aimhop'}
                </span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-tight mt-1 opacity-60">
                  {settings?.siteName && settings.siteName.includes(' ') 
                    ? settings.siteName.split(' ').slice(1).join(' ') 
                    : 'Security Solutions'}
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
              Elevating security standards with military precision and modern technology. Serving India's elite infrastructure since {settings?.address?.split(',')[0] || '2020'}.
            </p>
            <div className="flex items-center gap-3">
               {socialLinks.map((s, i) => (
                 <a 
                   key={i} 
                   href={s.link} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="w-11 h-11 bg-background border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300"
                 >
                    {s.icon}
                 </a>
               ))}
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-8">
             <h5 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Services</h5>
             <ul className="space-y-4">
                {(footerServices.length > 0 ? footerServices : [{title: "Security Guards"}, {title: "Bodyguards"}]).map(s => (
                  <li key={s.title}>
                    <Link href="/services" className="text-sm text-muted-foreground font-bold hover:text-primary transition-colors uppercase tracking-tight">
                      {s.title}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-8">
             <h5 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Company</h5>
             <ul className="space-y-4 text-sm text-muted-foreground font-bold uppercase tracking-tight">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/blogs" className="hover:text-primary transition-colors">Blogs & News</Link></li>

                {settings?.ctaJobEnabled !== false && (
                  <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                )}
                <li><Link href="/contact" className="hover:text-primary transition-colors">Support</Link></li>
             </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-10">
             <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/10 space-y-6 relative overflow-hidden group">
                <Shield className="absolute -right-8 -bottom-8 w-24 h-24 text-primary/10 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest">Head Office</p>
                   <p className="text-xs font-black text-foreground leading-relaxed uppercase">
                      {settings?.address || 'Gorakhpur, Uttar Pradesh, India'}
                   </p>
                   <div className="pt-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                         <Phone size={14} className="text-primary" />
                         <span className="text-xs font-black text-foreground tracking-tight">{settings?.contactPhone || '+91 91513 85320'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Mail size={14} className="text-primary" />
                         <span className="text-[10px] font-black text-foreground tracking-tight break-all uppercase">{settings?.contactEmail || 'info@aimhop.com'}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 mt-12 border-t border-border/50">
           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
               © 2026 {settings?.siteName || 'AimHop Security Solutions'} · India
             </p>
             <div className="hidden sm:block h-3 w-px bg-border" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
               Reg: U74999UP2020PTC136479
             </p>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-4 py-2 bg-primary/5 rounded-full border border-primary/10">ISO 9001:2015</span>
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-4 py-2 bg-primary/5 rounded-full border border-primary/10">PSARA Licensed</span>
           </div>
        </div>
      </div>
    </footer>
  );
}

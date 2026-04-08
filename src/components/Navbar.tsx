"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Phone, Menu, X } from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    settingsAPI.get().then(res => { if(res.data) setSettings(res.data); });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Clients", href: "/clients" },
    ...(settings?.ctaJobEnabled !== false ? [{ name: "Careers", href: "/careers" }] : []),
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            {settings?.logo ? (
              <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                <img 
                  src={getMediaUrl(settings.logo)} 
                  alt={settings.siteName || 'AimHop'} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <>
                <Shield className="w-10 h-10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full scale-150 animate-pulse" />
              </>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-black text-xl lg:text-2xl tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              {settings?.siteName ? settings.siteName.split(' ')[0] : 'Aimhop'}
            </span>
            <span className="text-[7px] lg:text-[8px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.15em] leading-tight mt-0.5 whitespace-nowrap">
              {settings?.siteName && settings.siteName.includes(' ') 
                ? settings.siteName.split(' ').slice(1).join(' ') 
                : 'Security Solution Pvt. Ltd.'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {links.map(l => {
            const isActive = pathname === l.href;
            return (
              <Link 
                key={l.name} 
                href={l.href} 
                className={`relative text-xs font-black uppercase tracking-widest transition-colors pb-1 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'}`}
              >
                {l.name}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-sky-600 dark:bg-sky-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <ThemeToggle />
          <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="group flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-sky-600/30">
            <Phone className="w-3 h-3 group-hover:rotate-12" /> {settings?.contactPhone ? 'Call Us' : 'Call Now'}
          </a>
        </div>

        {/* Mobile Buttons */}
        <div className="flex lg:hidden items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Polished) */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 py-6 px-6 animate-in slide-in-from-top-2 duration-300 shadow-2xl">
           <div className="flex flex-col gap-1.5">
             {links.map(l => {
               const isActive = pathname === l.href;
               return (
                 <Link 
                   key={l.name} 
                   href={l.href} 
                   onClick={() => setMobileOpen(false)} 
                   className={`text-base font-bold uppercase tracking-widest py-2 transition-colors border-b border-slate-50 dark:border-slate-900/50 last:border-none flex items-center justify-between ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`}
                 >
                    {l.name}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />}
                 </Link>
               );
             })}
             <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="w-full bg-sky-600 text-white py-3 mt-2 text-center rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-sky-600/20 active:scale-95 transition-all">
               Call Agency
             </a>
           </div>
        </div>
      )}
    </header>
  );
}

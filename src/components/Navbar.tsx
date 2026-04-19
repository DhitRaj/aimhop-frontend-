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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    settingsAPI.get().then(res => { if(res.data) setSettings(res.data); });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blogs", href: "/blogs" },
    { name: "Clients", href: "/clients" },

    ...(settings?.ctaJobEnabled !== false ? [{ name: "Careers", href: "/careers" }] : []),
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass-panel py-3 shadow-lg shadow-black/5' : 'bg-transparent py-5'}`}>
      <div className="container-pad flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            {settings?.logo ? (
              <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center p-1 bg-white/10 rounded-2xl">
                <img 
                  src={getMediaUrl(settings.logo)} 
                  alt={settings.siteName || 'AimHop'} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="relative">
                <Shield className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-black text-lg lg:text-xl tracking-tighter uppercase leading-none">
              {settings?.siteName ? settings.siteName.split(' ')[0] : 'Aimhop'}
            </span>
            <span className="text-[7px] font-bold text-primary uppercase tracking-[0.2em] leading-tight mt-1 whitespace-nowrap opacity-80">
              {settings?.siteName && settings.siteName.includes(' ') 
                ? settings.siteName.split(' ').slice(1).join(' ') 
                : 'Security Solution Pvt. Ltd.'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => {
            const isActive = pathname === l.href;
            return (
              <Link 
                key={l.name} 
                href={l.href} 
                className={`relative text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-primary ${isActive ? 'text-primary' : 'text-foreground/70'}`}
              >
                {l.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <ThemeToggle />
          <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="btn-primary scale-90 hover:scale-100 py-3">
             {settings?.contactPhone ? 'Quick Call' : 'Contact Us'}
          </a>
        </div>

        {/* Mobile Buttons */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="w-11 h-11 flex items-center justify-center bg-muted dark:bg-slate-800 rounded-xl text-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-0 top-0 h-screen w-screen bg-background/95 backdrop-blur-3xl transition-transform duration-500 z-[110] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
               <span className="font-black text-2xl tracking-tighter">AIMHOP</span>
               <button onClick={() => setMobileOpen(false)} className="w-12 h-12 flex items-center justify-center bg-muted rounded-full">
                  <X size={24} />
               </button>
            </div>
            <div className="flex flex-col gap-6">
              {links.map((l, i) => {
                const isActive = pathname === l.href;
                return (
                  <Link 
                    key={l.name} 
                    href={l.href} 
                    onClick={() => setMobileOpen(false)} 
                    className={`text-2xl font-black uppercase tracking-tighter transition-all ${isActive ? 'text-primary' : 'opacity-50 hover:opacity-100'}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                     {l.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto">
               <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="w-full btn-primary py-5 rounded-3xl text-lg">
                  TALK TO SECURITY EXPERT
               </a>
               <p className="text-center mt-6 text-xs font-bold opacity-30 uppercase tracking-widest">Available 24/7 for you</p>
            </div>
         </div>
      </div>
    </header>
  );
}

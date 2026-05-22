"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Phone, Menu, X } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";

interface NavbarClientProps {
  settings: any;
  links: { name: string; href: string; isExternal?: boolean }[];
}

export function NavbarClient({ settings, links }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#E8F8ED] dark:bg-[#1e3a28] border-b border-[#5CC67A]/20 dark:border-[#5CC67A]/10 py-2.5 text-[13px] text-[#3daa5e] dark:text-[#7de09a] hidden md:block transition-colors duration-200">
        <div className="max-w-[1240px] mx-auto px-8 md:px-12 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <a href={`mailto:${settings?.contactEmail || 'info@aimhop.com'}`} className="flex items-center gap-2 hover:text-[#1A1A18] dark:hover:text-[#f8fafc] transition-colors font-medium">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {settings?.contactEmail || 'info@aimhop.com'}
            </a>
            <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="flex items-center gap-2 hover:text-[#1A1A18] dark:hover:text-[#f8fafc] transition-colors font-medium">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {settings?.contactPhone || '+91 91513 85320'}
            </a>
          </div>
          <div className="flex gap-4 items-center">
            <span className="bg-white/60 dark:bg-[#111113]/60 text-[#3daa5e] dark:text-[#7de09a] text-[11px] font-semibold px-3 py-1 rounded-full tracking-[0.4px] transition-colors duration-200 border border-[#5CC67A]/20 dark:border-[#5CC67A]/10">
              🚀 {settings?.isoCertification || 'ISO 9001:2015'} Certified
            </span>
            <a href="#" className="font-medium hover:text-[#1A1A18] dark:hover:text-[#f8fafc] transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`bg-white dark:bg-[#111113] border-b border-[#E8E8E4] dark:border-[#1e1e24] sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'shadow-[0_1px_0_#E8E8E4,0_2px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_1px_0_#1e1e24,0_2px_20px_rgba(0,0,0,0.3)]' : ''}`}>
        <div className="max-w-[1240px] mx-auto px-8 md:px-12 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            {settings?.logo ? (
              <img 
                src={getMediaUrl(settings.logo)} 
                alt={settings.siteName || 'AimHop'} 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-1">
                <span className="font-['Bricolage_Grotesque',sans-serif] text-[26px] font-extrabold text-[#1A1A18] dark:text-[#f8fafc] tracking-[-1px] transition-colors duration-200">
                  Aim<span className="text-[#FF8C47]">Hop</span><span className="text-[#5CC67A]">.</span>
                </span>
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex gap-1 items-center">
            {links.map(l => {
              const isActive = pathname === l.href;
              return (
                <li key={l.name}>
                  {l.isExternal ? (
                    <a 
                      href={l.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[14.5px] font-medium px-3.5 py-2 rounded-lg transition-all text-[#6B7068] dark:text-[#94a3b8] hover:bg-[#E8F8ED] dark:hover:bg-[#1e3a28] hover:text-[#3daa5e] dark:hover:text-[#7de09a]`}
                    >
                      {l.name}
                    </a>
                  ) : (
                    <Link 
                      href={l.href} 
                      className={`text-[14.5px] font-medium px-3.5 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'text-[#1A1A18] dark:text-[#f8fafc] font-semibold' 
                          : 'text-[#6B7068] dark:text-[#94a3b8] hover:bg-[#E8F8ED] dark:hover:bg-[#1e3a28] hover:text-[#3daa5e] dark:hover:text-[#7de09a]'
                      }`}
                    >
                      {l.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <ThemeToggle />
            <Link 
              href="/hire" 
              className="inline-flex items-center justify-center bg-amber-600 text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-amber-700 transition-all duration-200"
            >
              Hire Staff
            </Link>
            <Link 
              href="/apply" 
              className="inline-flex items-center justify-center bg-[#10B981] text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-emerald-600 transition-all duration-200"
            >
              Get Job
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="w-10 h-10 flex items-center justify-center bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[10px] text-[#1A1A18] dark:text-white hover:border-[#5CC67A] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 top-0 h-screen w-screen bg-white dark:bg-[#0a0a0b] z-[110] transition-transform duration-500 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-extrabold text-[#1A1A18] dark:text-[#f8fafc] tracking-[-1px] transition-colors duration-200">
              Aim<span className="text-[#FF8C47]">Hop</span><span className="text-[#5CC67A]">.</span>
            </span>
            <button 
              onClick={() => setMobileOpen(false)} 
              className="w-10 h-10 flex items-center justify-center bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] rounded-[10px] hover:border-[#FF8C47] transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh]">
            {links.map((l, i) => {
              const isActive = pathname === l.href;
              return l.isExternal ? (
                <a 
                  key={l.name} 
                  href={l.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)} 
                  className={`text-2xl font-bold tracking-tight transition-all text-[#1A1A18] dark:text-[#f8fafc] opacity-50 hover:opacity-100`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {l.name}
                </a>
              ) : (
                <Link 
                  key={l.name} 
                  href={l.href} 
                  onClick={() => setMobileOpen(false)} 
                  className={`text-2xl font-bold tracking-tight transition-all ${
                    isActive ? 'text-[#5CC67A]' : 'text-[#1A1A18] dark:text-[#f8fafc] opacity-50 hover:opacity-100'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {l.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link 
              href="/hire" 
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center bg-amber-600 text-white font-semibold text-lg py-4 rounded-[14px] hover:bg-amber-700 transition-all duration-200"
            >
              Hire Staff
            </Link>
            <Link 
              href="/apply" 
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center bg-[#10B981] text-white font-semibold text-lg py-4 rounded-[14px] hover:bg-[#3daa5e] transition-all duration-200"
            >
              Get Job
            </Link>
          </div>
          <p className="text-center text-xs font-bold opacity-30 uppercase tracking-widest mt-4">
            Available 24/7 for you
          </p>
        </div>
      </div>
    </>
  );
}

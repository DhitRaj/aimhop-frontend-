"use client";

import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";

interface FooterLink {
  label: string;
  url: string;
  isExternal: boolean;
}

interface FooterSectionData {
  _id: string;
  columnName: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

interface FooterClientProps {
  settings: any;
  sections: FooterSectionData[];
}

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export function FooterClient({ settings, sections }: FooterClientProps) {
  return (
    <footer className="bg-amber-50 text-slate-800 pt-16 pb-8 border-t border-amber-200">
      <div className="max-w-[1240px] mx-auto px-8 md:px-12">
        {/* Main footer grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-${Math.min(sections.length + 2, 5)} gap-12 mb-12`}>
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-1">
              {settings?.logo ? (
                <img 
                  src={getMediaUrl(settings.logo)} 
                  alt={settings.siteName || 'AimHop'} 
                  className="h-10 w-auto object-contain"
                />
                ) : (
                <span className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold tracking-[-1px] text-slate-900">
                  Aim<span className="text-[#10B981]">Hop</span><span className="text-[#2563EB]">.</span>
                </span>
              )}
            </Link>
            <p className="text-[14px] leading-relaxed max-w-sm text-slate-600">
              AimHop — Dual-category workforce and security platform. Deploying police-verified security personnel and facility manpower across India.
            </p>
            <div className="flex items-center gap-3">
                {[
                { icon: <FacebookIcon size={16} />, link: settings?.socials?.facebook || "#" },
                { icon: <TwitterIcon size={16} />, link: settings?.socials?.twitter || "#" },
                { icon: <InstagramIcon size={16} />, link: settings?.socials?.instagram || "#" },
                { icon: <LinkedinIcon size={16} />, link: settings?.socials?.linkedin || "#" },
              ].map((s, i) => (
                <a 
                  key={i} 
                  href={s.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white border border-amber-200 rounded-lg flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-amber-400 transition-all duration-300 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          {sections.map((section) => (
            <div key={section._id} className="space-y-6">
              <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.2em] font-mono">{section.columnName}</h4>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    {link.isExternal ? (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[14.5px] text-slate-700 hover:text-[#10B981] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.url} 
                        className="text-[14.5px] text-slate-700 hover:text-[#10B981] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-amber-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-[13px] text-slate-700">
              © {new Date().getFullYear()} AimHop. All rights reserved.
            </p>
            <div className="hidden sm:block h-3 w-px bg-slate-200" />
            <p className="text-[13px] text-slate-700">
              {settings?.gstNumber || 'GST No. Reg: U74999UP2020PTC136479'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {((Array.isArray(settings?.complianceLabels) && settings.complianceLabels.length > 0)
              ? settings.complianceLabels
              : [settings?.isoCertification || 'ISO 9001:2015', settings?.psaraLicense || 'PSARA Licensed']
            ).map((badge: string, idx: number) => (
              <span key={idx} className="text-[11px] font-semibold text-slate-800 uppercase tracking-[0.2em] px-3 py-1.5 bg-white rounded-full border border-amber-200">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

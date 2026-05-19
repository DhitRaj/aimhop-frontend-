"use client";

import SafeImage from "./SafeImage";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

/**
 * Clean Page Hero Banner - Professional header for all pages
 * Displays title, subtitle, and optional background image
 */
export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative w-full pt-24 md:pt-28 pb-12 md:pb-16 bg-white dark:bg-[#0a0a0b] transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-8 md:px-12">
        <div className="relative w-full min-h-[280px] md:min-h-[360px] flex items-center justify-center overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.3)] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {backgroundImage ? (
              <div className="relative w-full h-full">
                <SafeImage
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="w-full h-full object-cover object-center"
                  priority
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8F8ED] dark:from-[#1e3a28] via-[#FAFAF8] dark:via-[#0a0a0b] to-[#FFF0E6] dark:to-[#3a2618] transition-colors duration-200" />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 md:px-12 py-12">
            <h1 className={`font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-2px] leading-[1.08] mb-4 ${backgroundImage ? 'text-white' : 'text-[#1A1A18] dark:text-[#f8fafc]'} transition-colors duration-200`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-[clamp(15px,2vw,18px)] font-medium leading-relaxed max-w-2xl mx-auto ${backgroundImage ? 'text-white/90' : 'text-[#6B7068] dark:text-[#94a3b8]'} transition-colors duration-200`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Decorative accent line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5CC67A] to-transparent opacity-60" />
        </div>
      </div>
    </section>
  );
}

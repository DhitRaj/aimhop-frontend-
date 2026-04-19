"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

/**
 * Premium Page Hero - High Impact Banner for Public Pages
 * Supports both Light and Dark themes seamlessly.
 */
export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative w-full pt-28 md:pt-32 pb-10 bg-background transition-colors duration-500">
      <div className="container-pad">
        <div className="relative w-full h-[220px] md:h-[400px] flex items-center overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-primary/5 border border-border">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            {backgroundImage ? (
              <div className="relative w-full h-full">
                <SafeImage
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="w-full h-full object-cover object-center transition-all duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted via-background to-muted" />
            )}
          </div>

          {/* Banner Content Overlay (Optional, but user said remove text, so keeping it clean) */}
          <div className="relative z-10 p-10 md:p-20 w-full flex flex-col justify-end h-full">
            {/* Keeping it empty as per previous request to remove text from banners, 
                but maintaining the structure for future flexibility */}
          </div>

          {/* Decorative Bottom Line */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
        </div>
      </div>
    </section>
  );
}



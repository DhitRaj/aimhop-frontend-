"use client";

import { WhatsAppModal } from "@/components/WhatsAppModal";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getMediaUrl } from "@/lib/utils";

export function HeroSection({ heroSubtitle, heroImg, settings, banners = [] }: { heroSubtitle: string, heroImg: string, settings: any, banners?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const activeBanner = banners.length > 0 ? banners[currentIndex] : null;
  const currentImage = activeBanner?.image ? getMediaUrl(activeBanner.image) : heroImg;
  const currentSubtitle = activeBanner?.subtitle || heroSubtitle;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background to-background" />
      </div>

      <div className="container-pad relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-primary/20 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission: Your Total Safety</span>
            </div>

            <div className={`transition-all duration-300 transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {activeBanner?.title ? (
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
                  {activeBanner.title}
                </h1>
              ) : (
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
                  Protecting <br />
                  <span className="gradient-text">The Future</span><br />
                  Of India.
                </h1>
              )}

              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl mt-8">
                {currentSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 animate-fade-up stagger-1">
              <WhatsAppModal whatsappNumber={settings?.whatsappNumber}>
                <button className="btn-primary group">
                  Get Premium Guarding
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </WhatsAppModal>
              <Link href="/services" className="btn-secondary">
                View Solutions
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-10 border-t border-border/50 animate-fade-up stagger-2">
              {[
                { val: settings?.statsClients || '1200+', label: 'Clients' },
                { val: settings?.statsGuards || '5000+', label: 'Guards' },
                { val: settings?.statsExperience || '5+', label: 'Years' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter">{s.val}</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 opacity-60">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative group w-full max-w-xl mx-auto h-[600px]">
            <div className="absolute -inset-4 bg-primary/20 blur-[80px] rounded-full transition-colors duration-1000" />
            
            <div className={`relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <img
                key={currentImage}
                src={currentImage || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1470&auto=format&fit=crop"}
                alt={activeBanner?.title || "Security"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-2xl">
                <p className="text-white text-sm font-bold italic leading-tight">
                  "Our commitment is to deliver security with discipline and integrity."
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-white text-xs">OP</div>
                  <div>
                    <p className="text-white text-xs font-black uppercase tracking-widest">O.P. Yadav</p>
                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Managing Director</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            {banners.length > 1 && (
              <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-4 animate-fade-up stagger-3">
                <button 
                  onClick={handlePrev} 
                  className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`h-2 transition-all duration-300 rounded-full ${
                        idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNext} 
                  className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

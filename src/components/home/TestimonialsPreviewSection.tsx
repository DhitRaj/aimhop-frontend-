import React from "react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TestimonialsPreviewSectionProps {
  testimonials: any[];
}

export function TestimonialsPreviewSection({ testimonials }: TestimonialsPreviewSectionProps) {
  // Graceful fallback for empty database
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      _id: "1",
      name: "Ramesh Kumar",
      role: "Operations Manager, TechPark",
      message: "AimHop has completely transformed our facility's security. Their guards are professional, vigilant, and extremely well-trained.",
      rating: 5
    },
    {
      _id: "2",
      name: "Priya Sharma",
      role: "Director, City Hospital",
      message: "The CCTV surveillance setup provided by AimHop is top-notch. Their team was quick to install and offers great support.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0b] transition-colors duration-200">
      <div className="container-pad max-w-[1240px] mx-auto">
        <div className="bg-[#FAFAF8] dark:bg-[#111113] p-10 md:p-16 rounded-[32px] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e]">Client Testimonials</div>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[32px] font-extrabold tracking-[-1px] leading-tight text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                What our clients say
              </h3>
              <div className="flex items-center gap-1 text-[#FF8C47]">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-[15px] text-[#6B7068] dark:text-[#94a3b8] leading-relaxed transition-colors duration-200">
                Real feedback from businesses we protect every day.
              </p>
              
              <Link href="/clients" className="inline-flex items-center gap-2 mt-4 text-[#5CC67A] hover:text-[#3daa5e] font-bold text-[14px] group transition-colors">
                Read More Reviews
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {displayTestimonials.slice(0, 2).map(t => (
                <div key={t._id} className="p-6 bg-white dark:bg-[#1e1e24] rounded-[20px] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] space-y-4 hover:shadow-[0_4px_28px_rgba(255,140,71,.10)] dark:hover:shadow-[0_4px_28px_rgba(255,140,71,.05)] hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center gap-1 text-[#FF8C47]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-[14px] text-[#1A1A18] dark:text-[#f8fafc] leading-relaxed italic transition-colors duration-200">"{t.message}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E4] dark:border-[#2a2a32]">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#5CC67A] to-[#7de09a] text-white flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold text-[13px]">
                      {(t.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">{t.name || 'Anonymous'}</h5>
                      <p className="text-[11px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">{t.role || 'Client'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

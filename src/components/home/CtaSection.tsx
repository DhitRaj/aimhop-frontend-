import { WhatsAppModal } from "@/components/WhatsAppModal";
import React from "react";

export function CtaSection({ settings }: { settings: any }) {
  return (
    <section className="section-spacing bg-background relative overflow-hidden">
      <div className="container-pad relative z-10">
        <div className="bg-emerald-50 border border-slate-200 p-12 md:p-20 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-50 via-transparent to-transparent opacity-80" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ready to elevate your facility's security?
            </h2>
            <p className="text-slate-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Consult with our veteran security specialists today to identify vulnerabilities and receive a comprehensive, free site risk assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <WhatsAppModal whatsappNumber={settings?.whatsappNumber}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-base transition-all active:scale-95 shadow-sm">
                  Book Free Risk Assessment
                </button>
              </WhatsAppModal>
              <a href={`tel:${settings?.contactPhone || '9151385320'}`} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-base transition-all active:scale-95 shadow-sm">
                Talk to Coordinator
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

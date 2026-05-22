import React from "react";

export function WhyAimhopSection({ features }: { features: any[] }) {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="container-pad relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Elite Guarding <br />
              <span className="gradient-text">Without Compromise.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium">Why the biggest brands in India trust Aimhop for their infrastructure.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-10 bg-card border border-border rounded-[2.5rem] card-hover"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

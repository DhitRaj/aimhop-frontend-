interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

/**
 * Reusable hero/banner for all public pages.
 * Displays a full-width background image (or branded gradient fallback)
 * with a professional dark overlay and centered text.
 */
export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative h-[260px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-900 bg-gradient-to-br from-slate-100 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950 transition-colors duration-500" />
        )}
        
        {/* Adaptive Overlay — Crisp for Light Mode, Cinematic for Dark Mode */}
        {/* We use a higher opacity for light mode to ensure text on image readability */}
        <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/70 transition-colors duration-500" />
        
        {/* Subtle Bottom fade — Matches Page Background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent transition-colors duration-500" />
      </div>

      {/* Content — Theme Adaptive Typography */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4">
        <p className="text-[10px] md:text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.4em]">
          AimHop Security Solutions
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-100 font-medium max-w-2xl mx-auto opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

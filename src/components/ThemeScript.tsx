export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Get theme from localStorage
        let theme = localStorage.getItem('theme');
        
        // If no theme in localStorage, check system preference
        if (!theme || theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? 'dark' : 'light';
        }
        
        // Apply theme to html element
        const html = document.documentElement;
        if (theme === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
        
        // Store in data attribute for debugging
        html.setAttribute('data-theme', theme);
      } catch (e) {
        console.error('Theme script error:', e);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}

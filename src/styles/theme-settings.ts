/**
 * WEBSITE THEME SETTINGS
 * 
 * You can change the default or forced theme for the entire website from here.
 * 
 * forcedTheme: 'light' | 'dark' | undefined
 * Setting forcedTheme to 'light' or 'dark' will prevent the user from changing the theme.
 */
export const themeSettings = {
  defaultTheme: "light", // 'light', 'dark', or 'system'
  forcedTheme: undefined, // forcedTheme ko light ya dark likhein forcing ke liye
} as const;

"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Independent Admin Theme Context
const AdminThemeContext = createContext({ 
  adminTheme: "light", 
  toggleAdminTheme: () => {} 
});

export const useAdminTheme = () => useContext(AdminThemeContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminTheme, setAdminTheme] = useState<string>("waiting");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aimhop-admin-theme") || "light";
    setAdminTheme(saved);
  }, []);

  const toggleAdminTheme = () => {
    const next = adminTheme === "light" ? "dark" : "light";
    setAdminTheme(next);
    localStorage.setItem("aimhop-admin-theme", next);
  };

  // Prevent flash by waiting for mount
  if (adminTheme === "waiting") return null;

  return (
    <AdminThemeContext.Provider value={{ adminTheme, toggleAdminTheme }}>
      <div className={adminTheme === "dark" ? "dark" : ""}>
         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 text-slate-900 dark:text-slate-100">
            {children}
         </div>
      </div>
    </AdminThemeContext.Provider>
  );
}

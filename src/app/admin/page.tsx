"use client";

import { useEffect, useState } from "react";
import { 
  contactAPI, 
  statsAPI, 
  careerAPI, 
  serviceAPI, 
  settingsAPI, 
  clientAPI,
  testimonialAPI,
  blogAPI,
  bannerAPI,
  isLoggedIn,
  removeToken
} from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Mail, 
  UserCircle, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Users,
  MessageSquare,
  FileText,
  Menu,
  X,
  Sun,
  Moon,
  Layout
} from "lucide-react";
import { useAdminTheme } from "./layout";

// ── Components ───────────────────────────────────────────────────────────────
import { DashboardView } from "./components/DashboardView";
import { MessagesView } from "./components/MessagesView";
import { CareersView } from "./components/CareersView";
import { ServicesView } from "./components/ServicesView";
import { SettingsView } from "./components/SettingsView";
import { ClientsView } from "./components/ClientsView";
import { TestimonialsView } from "./components/TestimonialsView";
import { BlogsView } from "./components/BlogsView";
import { BannersView } from "./components/BannersView";
import { Contact, Career } from "./types";

// ── Admin Page Container ───────────────────────────────────────────────────────
type Tab = "dashboard" | "messages" | "careers" | "services" | "clients" | "testimonials" | "blogs" | "banners" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { adminTheme, toggleAdminTheme } = useAdminTheme();
  const [mounted, setMounted] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const results = await Promise.all([
        contactAPI.getAll(),
        careerAPI.getAll(),
        serviceAPI.getAll(),
        settingsAPI.get(),
        statsAPI.get(),
        clientAPI.getAll(),
        testimonialAPI.getAll('all'),
        blogAPI.getAll(),
        bannerAPI.getAll()
      ]);

      const unauthorized = results.find(r => r.error === 'No token provided' || r.error === 'Invalid token' || r.error?.toString().includes('401'));
      if (unauthorized) {
          removeToken();
          router.push('/admin/login');
          return;
      }

      if (results[0].data) setContacts(results[0].data);
      if (results[1].data) setCareers(results[1].data);
      if (results[2].data) setServices(results[2].data);
      if (results[3].data) setSettings(results[3].data);
      if (results[4].data) setStats(results[4].data);
      if (results[5].data) setClients(results[5].data);
      if (results[6].data) setTestimonials(results[6].data);
      if (results[7].data) setBlogs(results[7].data);
      if (results[8].data) setBanners(results[8].data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium tracking-tight">Admin Environment Initializing...</p>
        </div>
      </div>
    );
  }

  const navItems: { tab: Tab; icon: any; label: string }[] = [
    { tab: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { tab: "messages", icon: Mail, label: "Messages" },
    { tab: "careers", icon: UserCircle, label: "Careers" },
    { tab: "services", icon: ShieldCheck, label: "Services" },
    { tab: "clients", icon: Users, label: "Our Clients" },
    { tab: "testimonials", icon: MessageSquare, label: "Reviews" },
    { tab: "blogs", icon: FileText, label: "Blogs" },
    { tab: "banners", icon: Layout, label: "Banners" },
    { tab: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 scroll-smooth overflow-x-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 z-[70] shadow-sm transform transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-7 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
             {settings?.logo ? (
                <div className="w-11 h-11 flex items-center justify-center">
                  <img src={getMediaUrl(settings.logo)} className="w-full h-full object-contain" alt="Logo" />
                </div>
             ) : (
                <div className="w-9 h-9 bg-sky-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-sky-600/20">A</div>
             )}
             <div>
               <p className="font-black text-slate-900 dark:text-white text-lg lg:text-xl leading-none uppercase tracking-tighter">
                 AimHop
               </p>
               <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em] mt-1 ml-0.5">Admin</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/10"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={18} />
                {label}
              </div>
              {activeTab === tab && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <ExternalLink size={16} />
            Live Preview
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-3 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="font-bold text-base md:text-lg text-slate-900 dark:text-white tracking-tight">
              {navItems.find(n => n.tab === activeTab)?.label || activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4 text-slate-400">
                <button 
                    onClick={() => toggleAdminTheme()}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Theme"
                >
                    {mounted && (adminTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />)}
                </button>
                <button 
                    onClick={fetchData} 
                    className={`hover:text-slate-900 dark:hover:text-white transition-colors ${loading ? "animate-spin text-sky-500" : ""}`}
                    title="Refresh"
                >
                    <RefreshCw size={17} />
                </button>
             </div>

             <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

             <div className="flex items-center gap-4 relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="hidden sm:flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all"
                >
                   <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-black shadow-lg shadow-slate-900/10 transition-transform active:scale-95">A</div>
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Admin</span>
                </button>
                
                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 animate-in zoom-in-95 slide-in-from-top-2 duration-200 z-10">
                       <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Management</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white mt-1 uppercase">Admin Panel</p>
                       </div>
                       <button 
                         onClick={() => {
                           setProfileOpen(false);
                           handleLogout();
                         }}
                         className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all"
                       >
                          <LogOut size={14} />
                          Sign Out
                       </button>
                    </div>
                  </>
                )}

                <button 
                  onClick={handleLogout}
                  className="sm:hidden text-slate-400 p-2"
                >
                   <LogOut size={18} />
                </button>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-[1440px]">
          {activeTab === "dashboard" && <DashboardView stats={stats} latestContacts={contacts} />}
          {activeTab === "messages" && <MessagesView contacts={contacts} />}
          {activeTab === "careers" && <CareersView careers={careers} />}
          {activeTab === "services" && <ServicesView services={services} refresh={fetchData} />}
          {activeTab === "clients" && <ClientsView clients={clients} refresh={fetchData} />}
          {activeTab === "testimonials" && <TestimonialsView testimonials={testimonials} refresh={fetchData} />}
          {activeTab === "blogs" && <BlogsView blogs={blogs} refresh={fetchData} />}
          {activeTab === "banners" && <BannersView />}
          {activeTab === "settings" && <SettingsView settings={settings || { socials: {} }} refresh={fetchData} />}
        </main>
      </div>
    </div>
  );
}

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
  Settings as SettingsIcon, 
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
  Layout,
  Bell,
  Search,
  Command,
  Database,
  Globe,
  Lock,
  Zap
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
import { Contact, Career, Service, Blog, Client, Testimonial, Banner, Settings, Stats } from "./types";

// ── Admin Page Container ───────────────────────────────────────────────────────
type Tab = "dashboard" | "messages" | "careers" | "services" | "clients" | "testimonials" | "blogs" | "banners" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { adminTheme, toggleAdminTheme } = useAdminTheme();
  const [mounted, setMounted] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
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

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-slate-900 border-t-transparent dark:border-white rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navItems: { tab: Tab; icon: any; label: string }[] = [
    { tab: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { tab: "messages", icon: Mail, label: "Messages" },
    { tab: "careers", icon: UserCircle, label: "Job Applications" },
    { tab: "services", icon: ShieldCheck, label: "Our Services" },
    { tab: "blogs", icon: FileText, label: "Blog Posts" },
    { tab: "clients", icon: Users, label: "Our Clients" },
    { tab: "testimonials", icon: MessageSquare, label: "Testimonials" },
    { tab: "banners", icon: Layout, label: "Website Banners" },
    { tab: "settings", icon: SettingsIcon, label: "General Settings" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans text-slate-900 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors duration-500">
      {/* Sidebar Overlay (Mobile) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[280px] bg-[#0F172A] border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-[70] transition-all duration-300 ease-in-out transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-8 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-600/30">A</div>
             <p className="font-bold text-white text-sm tracking-tight">
               AimHop <span className="text-slate-500 font-medium ml-1">Admin</span>
             </p>
          </Link>
        </div>

        <div className="px-4 py-8 flex flex-col h-full overflow-hidden">
          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Control Center</p>
            {navItems.map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} strokeWidth={activeTab === tab ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <Link 
              href="/" 
              target="_blank" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all group"
            >
              <ExternalLink size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Visit Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen relative bg-white dark:bg-slate-950">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
              className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-all"
            >
              {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />
              <h1 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {navItems.find(n => n.tab === activeTab)?.label || activeTab}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleAdminTheme()}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
                >
                  {adminTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                <button 
                  onClick={fetchData} 
                  className={`w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all ${loading ? "animate-spin" : ""}`}
                >
                  <RefreshCw size={18} />
                </button>
             </div>

             <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

              <div className="relative">
                 <button 
                   onClick={() => setProfileOpen(!profileOpen)}
                   className="flex items-center gap-3 py-1.5 rounded-lg transition-all"
                 >
                    <div className="w-8 h-8 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center text-[10px] font-black uppercase">A</div>
                    <div className="hidden sm:block text-left">
                       <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-tight">System Admin</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Available</p>
                    </div>
                 </button>
                 
                 {profileOpen && (
                   <>
                     <div className="fixed inset-0 z-0" onClick={() => setProfileOpen(false)} />
                     <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-10 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-1">
                           <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest">Administrator</p>
                           <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tight font-bold">admin@aimhop.com</p>
                        </div>
                        
                        <div className="space-y-0.5">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-lg uppercase tracking-widest">
                             <UserCircle size={14} /> My Profile
                          </button>
                          <div className="h-px bg-slate-50 dark:bg-slate-800 my-1.5" />
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-lg uppercase tracking-[0.2em]"
                          >
                             <LogOut size={14} /> End Session
                          </button>
                        </div>
                     </div>
                   </>
                 )}
              </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-8 md:p-12 max-w-[1500px] w-full mx-auto">
          <div className="mb-12">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight uppercase">
                    {navItems.find(n => n.tab === activeTab)?.label || activeTab}
                  </h2>
                </div>
                <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 dark:bg-slate-900 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-800">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   Active
                </div>
             </div>
          </div>

          <div className="transition-all duration-300">
            {activeTab === "dashboard" && <DashboardView stats={stats} latestContacts={contacts} />}
            {activeTab === "messages" && <MessagesView contacts={contacts} />}
            {activeTab === "careers" && <CareersView careers={careers} />}
            {activeTab === "services" && <ServicesView services={services} refresh={fetchData} />}
            {activeTab === "clients" && <ClientsView clients={clients} refresh={fetchData} />}
            {activeTab === "testimonials" && <TestimonialsView testimonials={testimonials} refresh={fetchData} />}
            {activeTab === "blogs" && <BlogsView blogs={blogs} refresh={fetchData} />}
            {activeTab === "banners" && <BannersView />}
            {activeTab === "settings" && <SettingsView settings={settings || { socials: {} } as Settings} refresh={fetchData} />}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.3);
        }
      `}</style>
    </div>
  );
}

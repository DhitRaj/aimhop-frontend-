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
  removeToken,
  inquiryAPI,
  workerAPI
} from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Mail, 
  Briefcase, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  X,
  RefreshCw,
  Users,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Home,
  ShieldCheck,
  Building2
} from "lucide-react";

import { Button } from "@/components/ui/Button";
// Components
import { DashboardView } from "./components/DashboardView";
import { MessagesView } from "./components/MessagesView";
import { CareersView } from "./components/CareersView";
import { ServicesView } from "./components/ServicesView";
import { SettingsView } from "./components/SettingsView";
import { ClientsView } from "./components/ClientsView";
import { TestimonialsView } from "./components/TestimonialsView";
import { BlogsView } from "./components/BlogsView";
import { BannersView } from "./components/BannersView";
import { WorkersView } from "./components/WorkersView";
import { InquiriesView } from "./components/InquiriesView";
import { HireCategoryView } from "./components/HireCategoryView";
import { IndustriesView } from "./components/IndustriesView";
import { Contact, Career, Service, Blog, Client, Testimonial, Banner, Settings, Stats } from "./types";

type Tab = "dashboard" | "inquiries" | "workers" | "hire_categories" | "messages" | "careers" | "services" | "clients" | "testimonials" | "blogs" | "banners" | "settings" | "industries";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
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
  const [workers, setWorkers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        bannerAPI.getAll(),
        inquiryAPI.getAll(1, 20),
        workerAPI.getAll(1, 20)
      ]);

      const unauthorized = results.find(r => r.error === 'No token provided' || r.error === 'Invalid token' || r.error?.toString().includes('401'));
      if (unauthorized) {
          removeToken();
          router.push('/admin/login');
          return;
      }

      if (results[0].data) setContacts(results[0].data as Contact[]);
      if (results[1].data) setCareers(results[1].data as Career[]);
      if (results[2].data) setServices(results[2].data as Service[]);
      if (results[3].data) setSettings(results[3].data as Settings);
      if (results[4].data) setStats(results[4].data as Stats);
      if (results[5].data) setClients(results[5].data as Client[]);
      if (results[6].data) setTestimonials(results[6].data as Testimonial[]);
      if (results[7].data) setBlogs(results[7].data as Blog[]);
      if (results[8].data) setBanners(results[8].data as Banner[]);
      if (results[9].data) setInquiries(results[9].data);
      if (results[10].data) setWorkers(results[10].data);
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

    // Tab persistence from URL Hash
    const hash = window.location.hash.replace('#', '') as Tab;
    const validTabs: Tab[] = ["dashboard", "inquiries", "workers", "hire_categories", "messages", "careers", "services", "clients", "testimonials", "blogs", "banners", "settings", "industries"];
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (mounted) {
      window.location.hash = activeTab;
    }
  }, [activeTab, mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Initialising Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navItems: { tab: Tab; icon: any; label: string }[] = [
    { tab: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { tab: "inquiries", icon: Users, label: "Hire Inquiries" },
    { tab: "workers", icon: ShieldCheck, label: "Worker Pool" },
    { tab: "hire_categories", icon: Briefcase, label: "Hire Categories" },
    { tab: "messages", icon: Mail, label: "Messages" },
    { tab: "careers", icon: Briefcase, label: "Job Applications" },
    { tab: "services", icon: SettingsIcon, label: "Services" },
    { tab: "industries", icon: Building2, label: "Industries" },
    { tab: "blogs", icon: FileText, label: "Blog Posts" },
    { tab: "clients", icon: Users, label: "Clients" },
    { tab: "testimonials", icon: MessageSquare, label: "Testimonials" },
    { tab: "banners", icon: ImageIcon, label: "Banners" },
    { tab: "settings", icon: Home, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-slate-50 text-slate-900 border-r border-slate-200 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none flex flex-col h-full`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-200 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-4 group">
            {settings?.logo ? (
              <img 
                src={getMediaUrl(settings.logo)} 
                alt="Logo" 
                className="w-11 h-11 object-contain rounded-xl bg-white p-1"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm shadow-emerald-500/20">
                {settings?.siteName?.charAt(0) || 'A'}
              </div>
            )}
            <div className="transition-transform group-hover:translate-x-1 duration-200">
              <p className="font-semibold text-xl tracking-tight leading-none mb-1 text-slate-900">AimHop</p>
              <p className="text-[10px] text-slate-500 font-medium tracking-[0.15em] uppercase">Control Centre</p>
            </div>
          </Link>
        </div>

        <nav className="p-8 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Navigation</p>
          {navItems.map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all group relative ${
                activeTab === tab
                  ? "bg-white text-emerald-600 shadow-sm border border-slate-200 font-semibold"
                  : "text-slate-600 font-medium hover:bg-slate-200/50 hover:text-slate-900"
              }`}
            >
              <Icon size={20} className={activeTab === tab ? "text-emerald-600" : "text-slate-500 group-hover:text-slate-900 transition-colors"} />
              <span className="text-sm tracking-tight">{label}</span>
              {activeTab === tab && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-200 flex-shrink-0 bg-slate-50">
          <Button variant="danger" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}><LogOut size={18} /> Sign Out</Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-10 h-24 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {navItems.find(n => n.tab === activeTab)?.label || activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="secondary" size="icon" onClick={fetchData} title="Refresh system data" className="group"><RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" /></Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardView stats={stats} latestContacts={contacts} />}
            {activeTab === "inquiries" && <InquiriesView inquiries={inquiries} />}
            {activeTab === "workers" && <WorkersView workers={workers} />}
            {activeTab === "hire_categories" && <HireCategoryView />}
            {activeTab === "messages" && <MessagesView contacts={contacts} />}
            {activeTab === "careers" && <CareersView careers={careers} />}
            {activeTab === "services" && <ServicesView services={services} refreshAction={fetchData} />}
            {activeTab === "industries" && <IndustriesView />}
            {activeTab === "clients" && <ClientsView clients={clients} refreshAction={fetchData} />}
            {activeTab === "testimonials" && <TestimonialsView testimonials={testimonials} refreshAction={fetchData} />}
            {activeTab === "blogs" && <BlogsView blogs={blogs} refreshAction={fetchData} />}
            {activeTab === "banners" && <BannersView />}
            {activeTab === "settings" && <SettingsView settings={settings || { socials: {} } as Settings} refreshAction={fetchData} />}
          </div>
        </main>
      </div>
    </div>
  );
}

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
  Home
} from "lucide-react";

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
import { Contact, Career, Service, Blog, Client, Testimonial, Banner, Settings, Stats } from "./types";

type Tab = "dashboard" | "messages" | "careers" | "services" | "clients" | "testimonials" | "blogs" | "banners" | "settings";

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
        bannerAPI.getAll()
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navItems: { tab: Tab; icon: any; label: string }[] = [
    { tab: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { tab: "messages", icon: Mail, label: "Messages" },
    { tab: "careers", icon: Briefcase, label: "Job Applications" },
    { tab: "services", icon: SettingsIcon, label: "Services" },
    { tab: "blogs", icon: FileText, label: "Blog Posts" },
    { tab: "clients", icon: Users, label: "Clients" },
    { tab: "testimonials", icon: MessageSquare, label: "Testimonials" },
    { tab: "banners", icon: ImageIcon, label: "Banners" },
    { tab: "settings", icon: Home, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-serif text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b-2 border-gray-700">
          <Link href="/admin" className="flex items-center gap-3">
            {settings?.logo ? (
              <img 
                src={getMediaUrl(settings.logo)} 
                alt="Logo" 
                className="w-10 h-10 object-contain rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded flex items-center justify-center text-white font-bold text-lg">
                {settings?.siteName?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <p className="font-bold text-lg tracking-tight">AimHop</p>
              <p className="text-[10px] text-gray-400 font-light tracking-widest uppercase opacity-70">Admin Portal</p>
            </div>
          </Link>
        </div>

        <nav className="p-6 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Menu</p>
          {navItems.map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === tab
                  ? "bg-amber-600 text-white shadow-xl shadow-amber-900/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} className={activeTab === tab ? "text-white" : "text-gray-500 group-hover:text-amber-400"} />
              <span className="text-sm font-semibold tracking-wide">{label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-300 px-6 h-20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {navItems.find(n => n.tab === activeTab)?.label || activeTab}
            </h1>
          </div>

          <button 
            onClick={fetchData} 
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            title="Refresh data"
          >
            <RefreshCw size={20} />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
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
    </div>
  );
}

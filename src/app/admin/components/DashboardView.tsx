"use client";

import { Contact, Stats } from "../types";
import { 
  Mail, 
  Shield, 
  Users, 
  Activity, 
  Inbox,
  ArrowRight,
  FileText,
  Settings
} from "lucide-react";

export function DashboardView({ stats, latestContacts }: { stats: Stats | null, latestContacts: Contact[] }) {
  const dashboardStats = [
    { 
      label: "All Inquiries", 
      value: stats?.totalMessages?.toString() || "0", 
      trend: "+12%", 
      icon: Mail, 
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/10",
    },
    { 
      label: "Applications", 
      value: stats?.totalApplications?.toString() || "0", 
      trend: "Steady", 
      icon: Shield, 
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
    },
    { 
      label: "Our Clients", 
      value: stats?.totalClients?.toString() || "0", 
      trend: "+4%", 
      icon: Users, 
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/10",
    },
    { 
      label: "Blog Posts", 
      value: stats?.totalBlogs?.toString() || "0", 
      trend: "Active", 
      icon: FileText, 
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/10",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shadow-inner`}>
                <s.icon size={22} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.1em] uppercase">{s.label}</p>
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                {s.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-left">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">Recent Inquiries</h3>
              </div>
              <button className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4">
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {latestContacts.length > 0 ? (
                latestContacts.slice(0, 5).map((contact) => (
                  <div key={contact._id} className="px-8 py-5 flex items-center gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 group-hover:text-indigo-600 transition-all">
                      <Inbox size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{contact.name}</p>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(contact.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate font-semibold uppercase tracking-tight">
                         {contact.email} • <span className="text-slate-600 dark:text-slate-400 font-bold">{contact.subject}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <Inbox className="mx-auto text-slate-100 dark:text-slate-800 mb-6" size={56} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System is caught up.<br />No messages found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-left">
              <h3 className="font-bold text-[9px] text-slate-400 mb-10 uppercase tracking-[0.2em]">Deployment Health</h3>
              <div className="space-y-8">
                 <HealthBar label="Database Cluster" percentage={99.8} color="bg-indigo-600" />
                 <HealthBar label="API Response" percentage={94} color="bg-emerald-500" />
                 <HealthBar label="CPU Load" percentage={12} color="bg-slate-900 dark:bg-white" />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-left">
              <h3 className="font-bold text-[9px] text-slate-400 mb-8 uppercase tracking-[0.2em]">Quick Console</h3>
              <div className="grid grid-cols-2 gap-4">
                 <QuickActionButton label="New Blog" icon={FileText} />
                 <QuickActionButton label="Settings" icon={Settings} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function HealthBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.1em]">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-slate-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickActionButton({ label, icon: Icon }: { label: string, icon: any }) {
  return (
    <button className="flex flex-col items-center justify-center p-5 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/20 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all gap-4 group">
       <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-all group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
          <Icon size={16} />
       </div>
       <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors group-hover:text-indigo-600 dark:group-hover:text-white">{label}</span>
    </button>
  );
}

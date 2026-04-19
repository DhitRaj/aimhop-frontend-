"use client";

import { Contact, Stats } from "../types";
import { 
  Mail, 
  Shield, 
  Users, 
  FileText,
  TrendingUp
} from "lucide-react";

export function DashboardView({ stats, latestContacts }: { stats: Stats | null, latestContacts: Contact[] }) {
  const dashboardStats = [
    { 
      label: "Total Inquiries", 
      value: stats?.totalMessages?.toString() || "0", 
      icon: Mail, 
    },
    { 
      label: "Applications", 
      value: stats?.totalApplications?.toString() || "0", 
      icon: Shield, 
    },
    { 
      label: "Our Clients", 
      value: stats?.totalClients?.toString() || "0", 
      icon: Users, 
    },
    { 
      label: "Blog Posts", 
      value: stats?.totalBlogs?.toString() || "0", 
      icon: FileText, 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-100 transition-colors">
                <s.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{s.label}</p>
            <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {s.value}
            </h4>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Recent Inquiries</h3>
          <button className="text-[10px] font-bold text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {latestContacts.length > 0 ? (
            latestContacts.slice(0, 8).map((contact) => (
              <div key={contact._id} className="px-8 py-6 hover:bg-slate-50 transition-colors border-l-4 border-l-transparent hover:border-l-amber-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">{contact.name}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{contact.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter">Subject</span>
                  <p className="text-sm font-semibold text-slate-700">{contact.subject}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-slate-300" size={32} />
              </div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

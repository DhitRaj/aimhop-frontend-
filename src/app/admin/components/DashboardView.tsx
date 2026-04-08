"use client";

import { Contact } from "../types";
import { Mail, Shield, Users, Clock, ArrowUpRight } from "lucide-react";

export function DashboardView({ stats, latestContacts }: { stats: any, latestContacts: Contact[] }) {
  const dashboardStats = [
    { label: "Total Messages", value: stats?.totalInquiries || "0", icon: Mail, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-100 dark:border-blue-800" },
    { label: "Active Guards", value: "5000+", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-100 dark:border-emerald-800" },
    { label: "Total Clients", value: "1200+", icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-100 dark:border-amber-800" },
    { label: "Latest Activity", value: latestContacts.length || "0", icon: Clock, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/10", border: "border-sky-100 dark:border-sky-800" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <ArrowUpRight size={14} className="text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Recent Inquiries</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {latestContacts.length > 0 ? (
            latestContacts.slice(0, 8).map((contact) => (
              <div key={contact._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{contact.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-2">
                    <span className="text-sky-600 font-bold uppercase">{contact.subject}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>{new Date(contact.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-400 text-xs font-medium">No recent inquiries found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

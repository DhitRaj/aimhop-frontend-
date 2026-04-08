"use client";

import { useState } from "react";
import { Contact } from "../types";
import { User, Phone, Mail, Calendar, Trash2, Loader2 } from "lucide-react";
import { contactAPI } from "@/lib/api";

export function MessagesView({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setDeleting(id);
    const { error } = await contactAPI.delete(id);
    if (!error) {
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
    }
    setDeleting(null);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Sidebar List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Inbox ({contacts.length})</h3>
        </div>
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {contacts.map((msg) => (
            <button
              key={msg._id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selected?._id === msg._id ? "bg-sky-50/50 dark:bg-sky-900/10 border-l-2 border-sky-600" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{msg.name}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-sky-600 font-medium truncate mb-1">{msg.subject}</p>
              <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{msg.message}</p>
            </button>
          ))}
          {contacts.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">List empty</div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {selected ? (
          <div className="flex flex-col h-full">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
               <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl leading-tight mb-2">{selected.subject}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                     <span className="flex items-center gap-2"><User size={14} className="text-slate-400" /> {selected.name}</span>
                     <span className="flex items-center gap-2 font-bold text-sky-600"><Phone size={14} /> {selected.phone}</span>
                     <span className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {selected.email}</span>
                  </div>
               </div>
               <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Calendar size={12} /> {new Date(selected.createdAt).toLocaleString()}
               </p>
            </div>
            
            <div className="px-8 py-8 flex-1 overflow-y-auto">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
              <a href={`tel:${selected.phone}`} className="px-6 py-2.5 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition shadow-sm">
                Call Back
              </a>
              <a href={`mailto:${selected.email}`} className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Send Email
              </a>
              <div className="ml-auto">
                 <button
                   onClick={() => handleDelete(selected._id)}
                   disabled={deleting === selected._id}
                   className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 rounded-lg disabled:opacity-50"
                 >
                    {deleting === selected._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center gap-4 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-inner flex items-center justify-center border border-slate-100 dark:border-slate-700">
               <Mail size={24} className="text-slate-200" />
            </div>
            <p className="font-semibold text-sm uppercase tracking-widest text-slate-400">Select an item from the list</p>
          </div>
        )}
      </div>
    </div>
  );
}

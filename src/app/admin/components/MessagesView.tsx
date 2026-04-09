"use client";

import { useState } from "react";
import { Contact } from "../types";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Trash2, 
  Loader2, 
  Search, 
  PhoneCall, 
  Send,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { contactAPI } from "@/lib/api";

export function MessagesView({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) return;
    setDeleting(id);
    const { error } = await contactAPI.delete(id);
    if (!error) {
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
    }
    setDeleting(null);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-12 gap-0 h-[calc(100vh-200px)] bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-left">
      {/* Messages List */}
      <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbox</h3>
            <span className="px-2 py-0.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded-md">{contacts.length}</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-[11px] font-semibold text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-slate-200 transition-all placeholder:text-slate-400" 
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredContacts.map((msg) => (
            <button
              key={msg._id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left px-6 py-5 hover:bg-white dark:hover:bg-slate-800 transition-all relative ${selected?._id === msg._id ? "bg-white dark:bg-slate-800" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-tight truncate ${selected?._id === msg._id ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{msg.name}</span>
                <span className="text-[9px] font-bold text-slate-400 flex-shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-[10px] text-slate-900 dark:text-slate-200 font-bold uppercase tracking-widest truncate mb-1">{msg.subject}</p>
              <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">{msg.message}</p>
              {selected?._id === msg._id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900 dark:bg-white" />
              )}
            </button>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
               <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Search size={16} className="text-slate-300" />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No messages found</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-950">
        {selected ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg">
                     {selected.name.charAt(0)}
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{selected.name}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <Clock size={10} /> Received: {new Date(selected.createdAt).toLocaleDateString()} at {new Date(selected.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(selected._id)}
                    disabled={deleting === selected._id}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-all disabled:opacity-50 border border-transparent hover:border-rose-100"
                  >
                     {deleting === selected._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
               </div>
            </div>

            {/* Contact Info */}
            <div className="px-10 py-6 bg-slate-50/50 dark:bg-slate-900/30 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{selected.email}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{selected.phone || 'Not Provided'}</p>
               </div>
               <div className="md:text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-[9px] font-bold uppercase tracking-widest rounded">
                    Subject: {selected.subject}
                  </span>
               </div>
            </div>
            
            {/* Message Body */}
            <div className="px-12 py-12 flex-1 overflow-y-auto">
              <div className="max-w-3xl">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-[1.8] whitespace-pre-wrap font-medium">
                  {selected.message}
                </p>
              </div>
            </div>
            
            {/* Action Footer */}
            <div className="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <a href={`tel:${selected.phone}`} className="h-10 flex-1 md:flex-none px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <PhoneCall size={12} />
                  Call Now
                </a>
                <a href={`mailto:${selected.email}`} className="h-10 flex-1 md:flex-none px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Send size={12} />
                  Reply via Email
                </a>
              </div>
               <div className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-10">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-800 mb-6">
              <Mail size={24} className="text-slate-300" />
            </div>
             <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-2">Select a Message</h3>
          </div>
        )}
      </div>
    </div>
  );
}

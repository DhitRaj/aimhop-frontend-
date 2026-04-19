"use client";

import { useState } from "react";
import { Contact } from "../types";
import { 
  Mail, 
  Trash2, 
  Loader2, 
  Search, 
  PhoneCall, 
  Send
} from "lucide-react";
import { contactAPI } from "@/lib/api";

export function MessagesView({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest mb-4">Inquiries ({contacts.length})</h3>
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400" 
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredContacts.map((msg) => (
            <button
              key={msg._id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left px-6 py-5 hover:bg-slate-50 transition-all border-l-4 ${selected?._id === msg._id ? "bg-amber-50/50 border-l-amber-600" : "border-l-transparent"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter whitespace-nowrap ml-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mb-1 truncate uppercase tracking-tighter">{msg.subject}</p>
              <p className="text-xs text-slate-500 line-clamp-1 font-medium italic opacity-80">{msg.message}</p>
            </button>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <Mail size={32} className="text-slate-300" />
               </div>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">No messages found</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        {selected ? (
          <>
            {/* Header */}
            <div className="px-8 py-7 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{selected.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded uppercase tracking-widest">
                      {new Date(selected.createdAt).toLocaleDateString()} at {new Date(selected.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
               </div>
               
               <button
                 onClick={() => handleDelete(selected._id)}
                 disabled={deleting === selected._id}
                 className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
               >
                  {deleting === selected._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
               </button>
            </div>

            {/* Contact Info */}
            <div className="px-8 py-6 bg-white border-b border-slate-100 grid grid-cols-2 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.email}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.phone || 'Not Provided'}</p>
               </div>
            </div>
            
            {/* Message Body */}
            <div className="px-8 py-8 flex-1 overflow-y-auto">
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Subject & Inquiry Details</p>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selected.subject}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {selected.message}
                </p>
              </div>
            </div>
            
            {/* Action Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <a href={`tel:${selected.phone}`} className="flex-1 px-6 py-3.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 tracking-widest shadow-lg shadow-slate-200">
                <PhoneCall size={16} />
                Initiate Call
              </a>
              <a href={`mailto:${selected.email}`} className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 tracking-widest">
                <Send size={16} />
                Send Email
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Mail size={40} className="text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Message Center</h4>
            <p className="text-sm text-slate-500 font-medium">Select a conversation from the list to view the full inquiry details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

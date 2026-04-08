"use client";

import { useState } from "react";
import { 
  Shield, Plus, Edit2, Trash2, Save, X, 
  Image as ImageIcon, ListPlus, Search, Info
} from "lucide-react";
import { serviceAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { Service } from "../types";

export function ServicesView({ services, refresh }: { services: Service[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Shield', features: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');



  const resetForm = () => {
    setEditing(null);
    setFormData({ title: '', description: '', icon: 'Shield', features: '', order: 0 });
    setFile(null);
    setModalOpen(false);
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setFormData({ 
      title: s.title, 
      description: s.description, 
      icon: s.icon || 'Shield', 
      features: (s.features || []).join(', '), 
      order: s.order || 0 
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('icon', formData.icon);
    data.append('features', JSON.stringify(formData.features.split(',').map(f => f.trim()).filter(f => f)));
    data.append('order', formData.order.toString());
    if (file) data.append('image', file);

    const res = editing 
      ? await serviceAPI.update(editing._id, data)
      : await serviceAPI.create(data);

    if (!res.error) {
      refresh();
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this service?')) {
      await serviceAPI.delete(id);
      refresh();
    }
  };

  const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none ring-0 focus:ring-1 focus:ring-sky-600/20 transition-all"
            />
         </div>
         <button 
           onClick={() => { resetForm(); setModalOpen(true); }}
           className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
         >
            <Plus size={18} /> Add New Service
         </button>
      </div>

      {/* Grid of Services */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filtered.map(s => (
           <div key={s._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col group hover:border-sky-600/20 transition-all shadow-sm hover:shadow-xl">
              <div className="flex items-start justify-between mb-6">
                 <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-sky-600 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                    {s.image ? (
                       <img src={getMediaUrl(s.image)} className="w-full h-full object-cover rounded-2xl" alt="" />
                    ) : (
                       <Shield size={24} />
                    )}
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEdit(s)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-sky-600 transition-all">
                       <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg mb-2">{s.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-3 mb-6 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl">{s.description}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order: {s.order}</span>
                 <span className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase">Active</span>
              </div>
           </div>
         ))}
         {filtered.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Search size={30} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No services found.</p>
           </div>
         )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={resetForm} />
           
           {/* Dialog */}
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-slate-100 dark:border-slate-800">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{editing ? 'Modify' : 'Register'} Service</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Fill in the technical profile of the service</p>
                 </div>
                 <button onClick={resetForm} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-400 transition-all active:scale-90">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Title</label>
                       <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/20 transition-all" placeholder="e.g. Industrial Escort"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sort Order</label>
                       <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none"/>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detailed Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none leading-relaxed resize-none focus:ring-2 focus:ring-sky-600/20 transition-all" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Key Features (Use commas to separate)</label>
                    <div className="relative">
                       <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-6 pr-12 py-4 text-sm font-bold outline-none" placeholder="24/7 Monitoring, GPS Tracking..."/>
                       <ListPlus className="absolute right-6 top-1/2 -translate-y-1/2 text-sky-600 opacity-50" size={18} />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 pl-1 italic flex items-center gap-2"><Info size={10} /> Separated values will appear as bullet points.</p>
                 </div>

                 <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block text-center">Service Banner / Illustration</label>
                    <div className="flex flex-col items-center gap-6">
                       <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                          {file ? <div className="absolute inset-0 bg-sky-600 flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest">New Upload</div> : 
                           editing?.image ? <img src={getMediaUrl(editing.image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" /> : 
                           <ImageIcon size={32} className="text-slate-300" />}
                          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus className="text-white" />
                          </div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Click photo above to browse files</p>
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button onClick={resetForm} type="button" className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700">
                       Cancel
                    </button>
                    <button disabled={loading} type="submit" className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50">
                       <Save size={18} /> {loading ? 'Saving Changes...' : (editing ? 'Apply Changes' : 'Confirm Registration')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

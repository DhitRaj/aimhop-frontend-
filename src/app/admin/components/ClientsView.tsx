"use client";

import { useState } from "react";
import { Plus, Trash2, Building2, Save, X, Search, Image as ImageIcon } from "lucide-react";
import { clientAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function ClientsView({ clients, refresh }: { clients: any[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');



  const resetForm = () => {
    setFormData({ name: '', industry: '', order: 0 });
    setFile(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('industry', formData.industry);
    data.append('order', formData.order.toString());
    if (file) data.append('logo', file);

    const res = await clientAPI.create(data);
    if (!res.error) {
      refresh();
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this client?')) {
      await clientAPI.delete(id);
      refresh();
    }
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none tracking-tight ring-0 focus:ring-1 focus:ring-sky-600/20 transition-all"
            />
         </div>
         <button 
           onClick={() => setModalOpen(true)}
           className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
         >
            <Plus size={18} /> Add New Client
         </button>
      </div>

      {/* Grid of Clients */}
      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
         {filtered.map(c => (
           <div key={c._id} className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center text-center group hover:border-sky-600/20 transition-all shadow-sm">
              <div className="relative w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
                   {c.logo ? (
                     <img src={getMediaUrl(c.logo)} className="w-full h-full object-contain p-2" alt={c.name} />
                  ) : (
                     <Building2 size={24} className="text-slate-300" />
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(c._id)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm line-clamp-1">{c.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{c.industry}</p>
           </div>
         ))}
         {filtered.length === 0 && (
           <div className="col-span-full py-20 text-center opacity-50">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No client partners found.</p>
           </div>
         )}
      </div>

      {/* --- ADD MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={resetForm} />
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-slate-100 dark:border-slate-800">
              <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                 <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Client</h2>
                 <button onClick={resetForm} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none"/>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry / Sector</label>
                    <input required type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none" placeholder="e.g. Banking, IT, Retail"/>
                 </div>
                 
                 <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                       {file ? <div className="absolute inset-0 bg-sky-600 flex items-center justify-center text-white text-[9px] font-black uppercase">Ready</div> : <ImageIcon size={24} className="text-slate-300" />}
                       <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Upload Company Logo</p>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button onClick={resetForm} type="button" className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                    <button disabled={loading} type="submit" className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                       <Save size={16} /> {loading ? 'Saving...' : 'Add Client'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

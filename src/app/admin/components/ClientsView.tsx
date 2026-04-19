"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Building2, 
  Save, 
  X, 
  Search, 
  Image as ImageIcon, 
  Loader2, 
  Globe, 
  Upload,
  CheckCircle2,
  Edit2
} from "lucide-react";
import { clientAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { Client } from "../types";

export function ClientsView({ clients, refresh }: { clients: Client[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '', industry: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setEditing(null);
    setFormData({ name: '', industry: '', order: 0 });
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setModalOpen(false);
  };

  const handleEdit = (client: Client) => {
    setEditing(client);
    setFormData({ 
      name: client.name, 
      industry: client.industry, 
      order: client.order || 0 
    });
    setPreviewUrl(client.logo ? getMediaUrl(client.logo) : null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('industry', formData.industry);
    data.append('order', formData.order.toString());
    if (file) data.append('logo', file);

    const res = editing 
      ? await clientAPI.update(editing._id, data)
      : await clientAPI.create(data);
      
    if (!res.error) {
      refresh();
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await clientAPI.delete(id);
      refresh();
    }
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 text-left">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
               type="text" 
               placeholder="Search by company name..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg pl-12 pr-4 py-3 h-11 text-xs font-bold outline-none focus:ring-1 focus:ring-slate-200 transition-all text-slate-900 dark:text-white placeholder:text-slate-300"
            />
         </div>
         <button 
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 h-11 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
         >
            <Plus size={14} /> Add New Client
         </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
         {filtered.map(c => (
            <div key={c._id} className="group bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center hover:border-slate-300 dark:hover:border-slate-700 transition-all relative">
               <div className="w-20 h-20 mb-6 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border dark:border-slate-800 shadow-sm overflow-hidden">
                  {c.logo ? (
                     <img src={getMediaUrl(c.logo)} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" alt={c.name} />
                  ) : (
                     <Building2 size={32} className="text-slate-200 dark:text-slate-800" />
                  )}
               </div>

               <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-widest line-clamp-1">{c.name}</h4>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2">{c.industry || 'General'}</p>

               <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEdit(c)}
                    className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(c._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                  >
                    <Trash2 size={12} />
                  </button>
               </div>
            </div>
         ))}
         
         {filtered.length === 0 && (
            <div className="col-span-full py-24 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
               <Globe size={48} className="text-slate-100 dark:text-slate-900 mb-6" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No clients matching your search</p>
            </div>
         )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" onClick={resetForm} />
           
           <div className="relative bg-white dark:bg-slate-950 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
              <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950">
                 <h2 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                    {editing ? 'Edit Client' : 'Add New Client'}
                 </h2>
                 <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Company Name</label>
                       <input 
                          required 
                          type="text" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-slate-200 transition-all h-12" 
                          placeholder="e.g. Globex Inc"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Industry Sector</label>
                       <input 
                          required 
                          type="text" 
                          value={formData.industry} 
                          onChange={e => setFormData({...formData, industry: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-slate-200 transition-all h-12" 
                          placeholder="e.g. Technology"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Display Order</label>
                    <input 
                      type="number" 
                      value={formData.order} 
                      onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-slate-200 transition-all h-12" 
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Client Logo Asset</label>
                    <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-indigo-500 group transition-all p-1">
                       {previewUrl ? (
                          <div className="relative w-full h-full">
                             <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                                <Upload size={24} className="mb-2" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{file ? 'Change Image' : 'Update Image'}</span>
                             </div>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center gap-4 text-slate-300 py-10">
                             <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                                <Upload size={24} className="text-slate-400" />
                             </div>
                             <div className="text-center">
                               <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest block mb-1">Upload Brand Mark</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Alpha-channel PNG preferred</span>
                             </div>
                          </div>
                       )}
                       <input type="file" onChange={e => {
                         const selectedFile = e.target.files?.[0];
                         if (selectedFile) {
                           setFile(selectedFile);
                           setPreviewUrl(URL.createObjectURL(selectedFile));
                         }
                       }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                       * Recommended size: 400x200px (2:1 Ratio). Use a transparent PNG for best results.
                    </p>
                 </div>

                 <div className="pt-8 flex items-center justify-end gap-6 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={resetForm} type="button" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
                    <button 
                       disabled={loading} 
                       type="submit" 
                       className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 h-11 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-opacity shadow-sm hover:opacity-90 disabled:opacity-50"
                    >
                       {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                       {loading ? 'Processing...' : (editing ? 'Save Changes' : 'Create Client')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

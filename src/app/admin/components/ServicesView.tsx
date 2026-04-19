"use client";

import { useState } from "react";
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Box,
  Loader2,
  CheckCircle2,
  Upload,
  Layers,
  Layout,
  ChevronRight
} from "lucide-react";
import { serviceAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { Service } from "../types";

export function ServicesView({ services, refresh }: { services: Service[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', icon: 'Shield', features: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setEditing(null);
    setFormData({ title: '', description: '', category: '', icon: 'Shield', features: '', order: 0 });
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setModalOpen(false);
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setFormData({ 
      title: s.title, 
      description: s.description, 
      category: s.category || '',
      icon: s.icon || 'Shield', 
      features: (s.features || []).join(', '), 
      order: s.order || 0 
    });
    setPreviewUrl(s.image ? getMediaUrl(s.image) : null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
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
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await serviceAPI.delete(id);
      refresh();
    }
  };

  const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 text-left">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
               type="text" 
               placeholder="Search our services..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
            />
         </div>
         <button 
           onClick={() => { resetForm(); setModalOpen(true); }}
           className="w-full md:w-auto bg-indigo-600 text-white px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
         >
            <Plus size={16} strokeWidth={2.5} /> Add New Service
         </button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.map((s) => (
            <div key={s._id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all overflow-hidden">
               <div className="aspect-video bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                  {s.image ? (
                     <img src={getMediaUrl(s.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={s.title} />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800 group-hover:scale-110 transition-transform duration-700">
                        <Shield size={48} />
                     </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                     <button onClick={() => handleEdit(s)} className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-lg shadow-xl hover:bg-white dark:hover:bg-slate-950 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-800">
                        <Edit2 size={14} />
                     </button>
                     <button onClick={() => handleDelete(s._id)} className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-rose-500 rounded-lg shadow-xl hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 transition-all border border-slate-100 dark:border-slate-800">
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>

               <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Order: {s.order}</span>
                       {s.category && (
                         <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                           {s.category}
                         </span>
                       )}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors mb-2">{s.title}</h4>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6 font-medium italic">"{s.description}"</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                     {(s.features || []).slice(0, 3).map((f, i) => (
                       <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-[0.1em] border border-slate-100 dark:border-slate-800/50 rounded-md">
                          {f}
                       </span>
                     ))}
                  </div>
               </div>
            </div>
         ))}
         
         {filtered.length === 0 && (
            <div className="col-span-full py-32 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
               <Box size={48} className="text-slate-200 dark:text-slate-800 mb-6" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No services found in the database</p>
            </div>
         )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={resetForm} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh] text-left animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">
                {editing ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Service Title</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                    placeholder="e.g. Digital Marketing"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                    placeholder="e.g. Security"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Service Description</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium italic" 
                  placeholder="Describe what this service covers..." 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Key Features (Comma Separated)</label>
                <input 
                  type="text" 
                  value={formData.features} 
                  onChange={e => setFormData({...formData, features: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                  placeholder="SEO, PPC, Social Media..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Service Image</label>
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                        <Upload size={24} className="mb-2" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{file ? 'Change Image' : 'Update Image'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <Upload size={32} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Image</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={e => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        if (previewUrl && !editing?.image?.includes(previewUrl)) {
                          URL.revokeObjectURL(previewUrl);
                        }
                        setPreviewUrl(URL.createObjectURL(selectedFile));
                      }
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 ml-1">
                  * Recommended size: 1200x900px (4:3 Ratio). This matches the card layout on the services page.
                </p>
                {file && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg">
                    <CheckCircle2 size={12} />
                    Selected: {file.name}
                  </div>
                )}
              </div>

              <div className="pt-10 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={resetForm} 
                  type="button" 
                  className="px-6 h-12 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="bg-indigo-600 text-white px-10 h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? 'Saving...' : (editing ? 'Save Changes' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

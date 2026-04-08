"use client";

import { useState } from "react";
import { Plus, Trash2, Star, Save, X, Search, CheckCircle, Clock, UserCircle, MessageSquare } from "lucide-react";
import { testimonialAPI } from "@/lib/api";

export function TestimonialsView({ testimonials, refresh }: { testimonials: any[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setFormData({ name: '', role: '', message: '', rating: 5 });
    setModalOpen(false);
  };

  const getRatingColor = (r: number) => {
    if (r === 1) return "text-rose-500";
    if (r === 2) return "text-orange-500";
    if (r === 3) return "text-amber-500";
    if (r === 4) return "text-lime-500";
    return "text-emerald-500 text-glow-emerald";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await testimonialAPI.add(formData);
    if (!res.error) {
      refresh();
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this review?')) {
      await testimonialAPI.delete(id);
      refresh();
    }
  };

  const handleApprove = async (id: string) => {
    const res = await testimonialAPI.update(id, { status: 'approved' });
    if (!res.error) refresh();
  };

  const filtered = testimonials.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.message.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none"
            />
         </div>
         <button 
           onClick={() => setModalOpen(true)}
           className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
         >
            <Plus size={18} /> Add New Review
         </button>
      </div>

      {/* Grid of Reviews */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map(t => (
           <div key={t._id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border ${t.status === 'pending' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100 dark:border-slate-800'} p-8 flex flex-col group transition-all hover:shadow-xl`}>
              <div className="flex items-center justify-between mb-6">
                 <div className={`flex items-center gap-1 ${getRatingColor(t.rating || 5)}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                       <Star key={i} size={12} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                    ))}
                 </div>
                 {t.status === 'pending' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest">
                       <Clock size={10} /> Pending
                    </span>
                 ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                       <CheckCircle size={10} /> Verified
                    </span>
                 )}
              </div>
              
              <div className="mb-8 relative">
                 <MessageSquare className="absolute -top-4 -left-4 text-slate-100 dark:text-slate-800 -z-0" size={40} />
                 <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10 line-clamp-4">"{t.message}"</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-sky-600 font-black uppercase text-sm">
                       {(t.name || 'U').charAt(0)}
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{t.name || 'Anonymous'}</h4>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{t.role || 'Partner'}</p>
                    </div>
                 </div>
                 <button onClick={() => handleDelete(t._id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all">
                    <Trash2 size={16} />
                 </button>
              </div>

              {t.status === 'pending' && (
                 <button 
                   onClick={() => handleApprove(t._id)}
                   className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                 >
                    <CheckCircle size={14} /> Approve Review
                 </button>
              )}
           </div>
         ))}
      </div>

      {/* --- ADD MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={resetForm} />
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-slate-100 dark:border-slate-800">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                 <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Client Review</h2>
                 <button onClick={resetForm} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-all"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Author Name</label>
                       <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Star Rating</label>
                       <select value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role / Company</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none" placeholder="e.g. CEO, Global Logistics"/>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Review Content</label>
                    <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-5 text-sm font-medium leading-relaxed outline-none resize-none"/>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button onClick={resetForm} type="button" className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Discard</button>
                    <button disabled={loading} type="submit" className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                       <Save size={16} /> {loading ? 'Posting...' : 'Push to Live Site'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

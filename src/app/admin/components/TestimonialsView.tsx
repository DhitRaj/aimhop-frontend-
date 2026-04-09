"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Star, 
  X, 
  Search, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  Loader2, 
  MoreVertical,
  User,
  Quote,
  CheckCircle2,
  Save
} from "lucide-react";
import { testimonialAPI } from "@/lib/api";
import { Testimonial } from "../types";

export function TestimonialsView({ testimonials, refresh }: { testimonials: Testimonial[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setFormData({ name: '', role: '', message: '', rating: 5 });
    setModalOpen(false);
  };

  const getRatingColor = (r: number) => {
    if (r <= 2) return "text-rose-400";
    if (r === 3) return "text-amber-400";
    return "text-slate-900 dark:text-white";
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
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await testimonialAPI.delete(id);
      refresh();
    }
  };

  const handleApprove = async (id: string) => {
    const res = await testimonialAPI.update(id, { status: 'approved' });
    if (!res.error) refresh();
  };

  const filtered = testimonials.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 text-left">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
               type="text" 
               placeholder="Search testimonials..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-300"
            />
         </div>
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="hidden lg:flex items-center gap-2 px-6 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <MessageSquare size={14} className="text-slate-300" />
               <span>{testimonials.length} Total Reviews</span>
            </div>
            <button 
               onClick={() => setModalOpen(true)}
               className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            >
               <Plus size={16} strokeWidth={2.5} /> Add Testimonial
            </button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(t => (
          <div key={t._id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 flex flex-col hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 dark:text-slate-800/50 pointer-events-none transition-colors">
               <Quote size={80} strokeWidth={1} />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < (t.rating || 5) ? getRatingColor(t.rating || 5) : "text-slate-100 dark:text-slate-800"} 
                    fill={i < (t.rating || 5) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              {t.status === 'pending' ? (
                <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] rounded-md border border-slate-100 dark:border-slate-800/50">
                  Pending Approval
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-[0.2em] rounded-md border border-indigo-100 dark:border-indigo-500/20">
                  <ShieldCheck size={12} strokeWidth={2.5} /> Published
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium italic relative z-10 line-clamp-4">
              "{t.message}"
            </p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 text-sm uppercase shadow-sm">
                  {t.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em] leading-none mb-1 group-hover:text-indigo-600 transition-colors">{t.name || 'Anonymous Client'}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.role || 'Partner'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {t.status === 'pending' && (
                  <button 
                    onClick={() => handleApprove(t._id)} 
                    className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100/50 dark:border-emerald-500/20"
                    title="Approve Review"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(t._id)} 
                  className="p-2.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all rounded-lg"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-32 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <MessageSquare className="text-slate-200 dark:text-slate-800 mb-6" size={48} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">No testimonials found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={resetForm} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-10 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Add New Testimonial</h2>
              <button onClick={resetForm} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Person's Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase tracking-tight" 
                    placeholder="e.g. JOHN DOE"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Rating (1-5)</label>
                  <select 
                    value={formData.rating} 
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} {r === 1 ? 'Star' : 'Stars'}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Job Title / Company</label>
                <input 
                  required 
                  type="text" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase tracking-tight" 
                  placeholder="e.g. CEO, GLOBEX INC"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Testimonial Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all italic" 
                  placeholder="Enter the client's feedback message here..."
                />
              </div>

              <div className="pt-10 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={resetForm} type="button" className="flex-1 h-12 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all uppercase tracking-widest">Cancel</button>
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="flex-[2] bg-indigo-600 text-white h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-opacity shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? 'Processing...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

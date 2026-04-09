"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Save, 
  X, 
  Upload,
  Power,
  ChevronRight,
  Layout,
  Eye,
  Monitor,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { Banner } from "../types";

export function BannersView() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    page: "Home",
    order: "0",
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await bannerAPI.getAll();
    if (data) {
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleStatus = async (banner: Banner) => {
    const newStatus = !banner.active;
    const { error } = await bannerAPI.toggleStatus(banner._id, newStatus);
    if (!error) {
      setBanners(banners.map(b => b._id === banner._id ? { ...b, active: newStatus } : b));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const { error } = await bannerAPI.delete(id);
    if (!error) {
      setBanners(banners.filter(b => b._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("page", formData.page);
    data.append("order", formData.order);
    data.append("active", String(formData.active));
    if (imageFile) data.append("image", imageFile);

    let res;
    if (editingBanner) {
      res = await bannerAPI.update(editingBanner._id, data);
    } else {
      res = await bannerAPI.create(data);
    }

    if (!res.error) {
      setIsModalOpen(false);
      setEditingBanner(null);
      setFormData({ title: "", subtitle: "", page: "Home", order: "0", active: true });
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } else {
      alert("Error: " + res.error);
    }
    setSubmitting(false);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      page: banner.page || "Home",
      order: String(banner.order || 0),
      active: banner.active ?? true
    });
    setImagePreview(banner.image ? getMediaUrl(banner.image) : null);
    setIsModalOpen(true);
  };

  const activeBannersCount = banners.filter(b => b.active).length;

  return (
    <div className="space-y-8 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Homepage Banners</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeBannersCount}</span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Banners</span>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingBanner(null);
            setFormData({ title: "", subtitle: "", page: "Home", order: "0", active: true });
            setImageFile(null);
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} strokeWidth={2.5} /> New Banner
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
           {banners.map((banner) => (
             <div 
               key={banner._id} 
               className={`group bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-6 p-4 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all ${!banner.active ? 'opacity-60 grayscale' : ''}`}
             >
               <div className="relative w-32 aspect-video overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-lg shrink-0 border border-slate-200/50 dark:border-slate-800">
                 {banner.image ? (
                   <img src={getMediaUrl(banner.image)} className="w-full h-full object-cover" alt={banner.title} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700"><ImageIcon size={20} /></div>
                 )}
               </div>
               
               <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                      {banner.page || 'Home'}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 uppercase tracking-tight">{banner.title || 'Untitled Banner'}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium italic">"{banner.subtitle || 'No description provided'}"</p>
                  <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded w-fit bg-slate-50 dark:bg-slate-950">
                    Order: {banner.order}
                  </div>
               </div>

               <div className="flex items-center gap-3 shrink-0 pr-2">
                 {/* Toggle Switch */}
                 <div className="flex items-center gap-3 mr-4">
                    <span className={`hidden sm:block text-[9px] font-bold uppercase tracking-[0.2em] ${banner.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                    <button 
                      onClick={() => handleToggleStatus(banner)}
                      className={`w-10 h-5 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${banner.active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${banner.active ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                 </div>

                 <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block" />

                 <button 
                   onClick={() => openEdit(banner)}
                   className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-slate-100 dark:border-slate-800/50"
                 >
                   <Edit2 size={14} />
                 </button>

                 <button 
                   onClick={() => handleDelete(banner._id)}
                   className="p-2.5 rounded-lg text-rose-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
             </div>
           ))}
           
           {banners.length === 0 && (
             <div className="col-span-full py-20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <ImageIcon size={40} className="text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No banners found</p>
             </div>
           )}
        </div>
      )}

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
              <h2 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">
                {editingBanner ? "Edit Banner" : "New Banner"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Banner Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3 h-11 text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Enter headline..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Display Page</label>
                    <div className="relative">
                      <select 
                        value={formData.page}
                        onChange={e => setFormData({...formData, page: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3 h-11 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                      >
                        <option value="Home">Home Page</option>
                        <option value="About">About Us</option>
                        <option value="Services">Services</option>
                        <option value="Clients">Clients</option>
                        <option value="Careers">Careers</option>
                        <option value="Contact">Contact</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Display Order</label>
                    <input 
                      type="number" 
                      value={formData.order} 
                      onChange={e => setFormData({...formData, order: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3 h-11 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Description / Subtitle</label>
                  <textarea 
                    rows={2}
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-medium italic text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Enter description..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Banner Image</label>
                  <div className="h-32 bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group hover:border-indigo-500/50 transition-all relative overflow-hidden">
                    {imagePreview ? (
                      <div className="w-full h-full relative">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                           <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 shadow-sm">
                              Change Image
                              <input type="file" onChange={e => {
                                const file = e.target.files?.[0] || null;
                                setImageFile(file);
                                setImagePreview(file ? URL.createObjectURL(file) : null);
                              }} className="hidden" />
                           </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors w-full h-full justify-center">
                        <Upload size={20} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Click to Upload</span>
                        <input type="file" onChange={e => {
                          const file = e.target.files?.[0] || null;
                          setImageFile(file);
                          setImagePreview(file ? URL.createObjectURL(file) : null);
                        }} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 h-10 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={(e: any) => handleSubmit(e)}
                    disabled={submitting}
                    className="bg-indigo-600 text-white px-8 h-10 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} 
                    {editingBanner ? "Save Changes" : "Save Banner"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

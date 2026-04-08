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
  Layout
} from "lucide-react";
import { bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function BannersView() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    order: "0",
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await bannerAPI.getAll();
    if (data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleStatus = async (banner: any) => {
    const newStatus = !banner.active;
    const { error } = await bannerAPI.toggleStatus(banner._id, newStatus);
    if (!error) {
      setBanners(banners.map(b => b._id === banner._id ? { ...b, active: newStatus } : b));
    } else {
      alert("Error: " + error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const { error } = await bannerAPI.delete(id);
    if (!error) {
      setBanners(banners.filter(b => b._id !== id));
    } else {
      alert("Error: " + error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
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
      setFormData({ title: "", subtitle: "", order: "0", active: true });
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } else {
      alert("Error: " + res.error);
    }
  };

  const openEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      order: String(banner.order || 0),
      active: banner.active ?? true
    });
    setImagePreview(banner.image ? getMediaUrl(banner.image) : null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pl-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Banner Management</h1>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide italic">Manage homepage hero sliders and visibility</p>
        </div>
        <button 
          onClick={() => {
            setEditingBanner(null);
            setFormData({ title: "", subtitle: "", order: "0", active: true });
            setImageFile(null);
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all w-fit"
        >
          <Plus size={16} /> New Banner
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
           <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No banners added yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {banners.map((banner) => (
             <div key={banner._id} className={`group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full ${!banner.active ? 'opacity-60 grayscale' : ''}`}>
               <div className="relative h-48 bg-slate-100 dark:bg-black overflow-hidden">
                 {banner.image ? (
                   <img src={getMediaUrl(banner.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={banner.title} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                 )}
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(banner)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${banner.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-500 text-white'}`}
                      title={banner.active ? "Deactivate" : "Activate"}
                    >
                      <Power size={16} />
                    </button>
                 </div>
                 {!banner.active && (
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Inactive</span>
                   </div>
                 )}
               </div>
               <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-lg">Order: {banner.order}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 line-clamp-1">{banner.title || 'Untitled Banner'}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-6 flex-1 line-clamp-2">{banner.subtitle || 'No description provided'}</p>
                  
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-50 dark:border-slate-800">
                     <button 
                       onClick={() => openEdit(banner)}
                       className="flex-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 p-3.5 rounded-xl text-slate-500 transition-all flex items-center justify-center gap-2"
                     >
                        <Edit2 size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Modify</span>
                     </button>
                     <button 
                       onClick={() => handleDelete(banner._id)}
                       className="w-12 h-12 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
             </div>
           ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{editingBanner ? "Modify Banner" : "New Hero Asset"}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Heading</label>
                         <input 
                           type="text" 
                           placeholder="Ex: Security You Can Trust"
                           value={formData.title} 
                           onChange={e => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600/30 transition-all text-slate-900 dark:text-white"
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Order</label>
                         <input 
                           type="number" 
                           value={formData.order} 
                           onChange={e => setFormData({...formData, order: e.target.value})}
                           className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600/30 transition-all text-slate-900 dark:text-white"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description / Subtitle</label>
                      <textarea 
                        rows={3}
                        placeholder="Catchy subtext for the banner..."
                        value={formData.subtitle} 
                        onChange={e => setFormData({...formData, subtitle: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 focus:border-sky-600/30 transition-all text-slate-900 dark:text-white resize-none"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Banner Visual (1920x800 recommended)</label>
                      <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                         <div className="w-24 h-16 rounded-xl bg-white dark:bg-slate-950 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 flex items-center justify-center shrink-0">
                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-200" />}
                         </div>
                         <div className="flex-1 flex flex-col gap-2">
                            <label className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit transition-transform active:scale-95">
                               <Upload size={14} /> {imagePreview ? "Change Visual" : "Upload Image"}
                               <input type="file" onChange={e => {
                                 const file = e.target.files?.[0] || null;
                                 setImageFile(file);
                                 setImagePreview(file ? URL.createObjectURL(file) : null);
                               }} className="hidden" />
                            </label>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Format: JPG, PNG, WebP (Max 15MB)</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <button 
                           type="button"
                           onClick={() => setFormData({...formData, active: !formData.active})}
                           className={`w-12 h-6 rounded-full relative transition-all ${formData.active ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.active ? 'left-7' : 'left-1'}`} />
                         </button>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</span>
                      </div>

                      <div className="flex items-center gap-4">
                         <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                         <button type="submit" className="bg-sky-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                            <Save size={16} /> {editingBanner ? "Update Assets" : "Publish Online"}
                         </button>
                      </div>
                   </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

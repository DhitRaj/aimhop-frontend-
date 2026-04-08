"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X, Search, Image as ImageIcon, FileText, Calendar, User } from "lucide-react";
import { blogAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function BlogsView({ blogs, refresh }: { blogs: any[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');


  const resetForm = () => {
    setEditing(null);
    setFile(null);
    setModalOpen(false);
  };

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setEditing({ ...blog });
    } else {
      setEditing({ title: '', content: '', category: 'Security', author: 'Admin' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', editing.title);
    formData.append('content', editing.content || '');
    formData.append('category', editing.category || 'Security');
    formData.append('author', editing.author || 'Admin');
    if (file) formData.append('thumbnail', file);

    const { error } = editing._id 
      ? await blogAPI.update(editing._id, formData)
      : await blogAPI.create(formData);

    if (!error) {
      refresh();
      resetForm();
    } else {
      alert(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this article?")) {
      await blogAPI.delete(id);
      refresh();
    }
  };

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search blog articles..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none"
            />
         </div>
         <button 
           onClick={() => handleOpenModal()}
           className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
         >
            <Plus size={18} /> Create New Post
         </button>
      </div>

      {/* Blog List View */}
      <div className="grid lg:grid-cols-2 gap-6">
         {filtered.map(blog => (
           <div key={blog._id} className="group bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all flex gap-6 items-center">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner">
                  {blog.thumbnail ? (
                  <img src={getMediaUrl(blog.thumbnail)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={blog.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200"><FileText size={24} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] font-black text-sky-600 uppercase tracking-widest px-2 py-0.5 bg-sky-50 dark:bg-sky-900/20 rounded-md">
                      {blog.category || 'Security'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                       <Calendar size={10} /> {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                 </div>
                 <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight truncate group-hover:text-sky-600 transition-colors">
                   {blog.title}
                 </h4>
                 <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(blog)} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase text-sky-600 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-slate-100 dark:border-slate-800 transition-all">Edit Post</button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-xl transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {modalOpen && editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={resetForm} />
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-slate-100 dark:border-slate-800">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{editing._id ? 'Edit' : 'Create'} Blog Article</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Publish news, tips and updates to your public site</p>
                 </div>
                 <button onClick={resetForm} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={20}/></button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Headline</label>
                       <input required type="text" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-sky-600/10 transition-all"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                       <input value={editing.category || ''} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none" placeholder="Security Tips"/>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Content (Markdown Supported)</label>
                    <textarea required rows={10} value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] px-8 py-6 text-sm font-medium leading-relaxed outline-none resize-none focus:ring-2 focus:ring-sky-600/10 transition-all"/>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 leading-none">Cover Illustration</label>
                       <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative group flex items-center justify-center p-4">
                          {file ? <div className="absolute inset-0 bg-sky-600 text-white flex items-center justify-center font-black text-[10px] uppercase">New File Ready</div> :
                           editing?.thumbnail ? <img src={getMediaUrl(editing.thumbnail)} className="max-h-full max-w-full object-contain rounded-xl" /> :
                           <ImageIcon size={32} className="text-slate-300" />}
                          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                    </div>
                    <div className="flex gap-4 self-end">
                       <button onClick={resetForm} type="button" className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">Discard</button>
                       <button disabled={loading} type="submit" className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98]">
                          <Save size={20} /> {loading ? "Updating..." : "Publish to Blog"}
                       </button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

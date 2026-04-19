"use client";

import { useState } from "react";
import { 
  Plus, Trash2, Edit2, X, Search, 
  Image as ImageIcon, FileText, Calendar,
  Layout, Loader2, ShieldCheck
} from "lucide-react";
import { blogAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
import { Blog } from "../types";

export function BlogsView({ blogs, refresh }: { blogs: Blog[], refresh: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | Partial<Blog> | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setEditing(null);
    setFile(null);
    setModalOpen(false);
  };

  const handleOpenModal = (blog: Blog | null = null) => {
    if (blog) {
      setEditing({ ...blog });
    } else {
      setEditing({ title: '', content: '', category: 'News', author: 'Admin' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', editing.title || '');
    formData.append('content', editing.content || '');
    formData.append('category', editing.category || 'News');
    formData.append('author', editing.author || 'Admin');
    if (file) formData.append('image', file);

    const { error } = (editing as Blog)._id 
      ? await blogAPI.update((editing as Blog)._id, formData)
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
    if (confirm("Are you sure you want to delete this blog post?")) {
      await blogAPI.delete(id);
      refresh();
    }
  };

  const filtered = blogs.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 text-left">
      
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="relative w-full md:max-w-md transition-all">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search blog posts..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
            />
         </div>
         <button 
           onClick={() => handleOpenModal()}
           className="w-full md:w-auto bg-indigo-600 text-white px-8 h-12 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20"
         >
            <Plus size={16} strokeWidth={2.5} /> Add New Post
         </button>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.map(blog => (
           <div key={blog._id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="aspect-video relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {blog.image || blog.thumbnail ? (
                  <SafeImage 
                    src={getMediaUrl(blog.image || blog.thumbnail) + `?t=${new Date(blog.updatedAt || blog.createdAt).getTime()}`} 
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={blog.title} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800 group-hover:scale-110 transition-transform duration-700"><Layout size={40} /></div>
                )}
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 rounded bg-slate-900/90 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-widest shadow-lg">
                      {blog.category}
                   </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold mb-4 uppercase tracking-[0.1em]">
                    <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                 </div>
                 <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6 line-clamp-2 leading-snug tracking-tight">
                   {blog.title}
                 </h4>
                 
                 <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold uppercase">
                          {blog.author?.charAt(0) || 'A'}
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{blog.author || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <button 
                         onClick={() => handleOpenModal(blog)} 
                         className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all"
                       >
                          <Edit2 size={14} />
                       </button>
                       <button 
                         onClick={() => handleDelete(blog._id)} 
                         className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-all"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
         
         {filtered.length === 0 && (
           <div className="col-span-full py-32 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <FileText size={48} className="text-slate-200 dark:text-slate-800 mb-6" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No blog posts found</p>
           </div>
         )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={resetForm} />
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left animate-in slide-in-from-bottom-4 duration-300">
              
              <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">
                    {editing._id ? 'Edit Blog Post' : 'Create New Post'}
                 </h2>
                 <button onClick={resetForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
                    <X size={16} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar">
                 <div className="p-10 grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                       <div className="space-y-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Post Title</label>
                          <input 
                            required 
                            type="text" 
                            value={editing.title} 
                            onChange={e => setEditing({...editing, title: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                            placeholder="Enter the post title..."
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Post Content</label>
                          <textarea 
                            required 
                            rows={14} 
                            value={editing.content} 
                            onChange={e => setEditing({...editing, content: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-4 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" 
                            placeholder="Write your content here..."
                          />
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                          <input 
                            value={editing.category || ''} 
                            onChange={e => setEditing({...editing, category: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                            placeholder="e.g. Technology, News"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Author</label>
                          <input 
                            value={editing.author || ''} 
                            onChange={e => setEditing({...editing, author: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                            placeholder="e.g. Admin"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Featured Image</label>
                          <div className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group">
                             {file ? (
                                <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 gap-3">
                                   <ShieldCheck size={32} />
                                   <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Image Selected</span>
                                </div>
                             ) : (editing?.image || editing?.thumbnail) ? (
                                <div className="relative w-full h-full">
                                    <SafeImage src={getMediaUrl(editing.image || editing.thumbnail) + `?t=${Date.now()}`} fill className="w-full h-full object-cover opacity-60" alt="preview" />
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-900 dark:text-white">
                                        <ImageIcon size={24} />
                                    </div>
                                </div>
                             ) : (
                                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                   <ImageIcon size={32} />
                                   <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Image</span>
                                </div>
                             )}
                             <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 ml-1">
                             * Recommended size: 1200x675px (16:9 Ratio).
                           </p>
                       </div>
                    </div>
                 </div>

                 <div className="px-10 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-4 rounded-b-2xl">
                    <button onClick={resetForm} type="button" className="px-6 h-12 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all uppercase tracking-widest">Cancel</button>
                     <button 
                       disabled={loading} 
                       type="submit" 
                       className="bg-indigo-600 text-white px-10 h-12 rounded-xl text-[10px] font-bold flex items-center gap-3 hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20"
                     >
                       {loading && <Loader2 size={14} className="animate-spin" />}
                       {loading ? 'Saving...' : (editing._id ? 'Save Changes' : 'Publish Post')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}


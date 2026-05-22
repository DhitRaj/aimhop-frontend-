"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { seoAPI } from "@/lib/api";
import { SEOData } from "../types";

export function SEOsView() {
  const [seos, setSeos] = useState<SEOData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SEOData>>({});

  const fetchSEOs = async () => {
    setIsLoading(true);
    const res = await seoAPI.getAll();
    if (res.data) setSeos(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSEOs();
  }, []);

  const handleEdit = (seo: SEOData) => {
    setIsEditing(seo._id);
    setFormData(seo);
  };

  const handleSave = async (id: string) => {
    if (id === 'new') {
      await seoAPI.create(formData);
    } else {
      await seoAPI.update(id, formData);
    }
    setIsEditing(null);
    fetchSEOs();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this SEO configuration?")) {
      await seoAPI.delete(id);
      fetchSEOs();
    }
  };

  const addNew = () => {
    const newSEO: any = {
      _id: 'new',
      pageRoute: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: '',
      canonicalUrl: ''
    };
    setSeos([newSEO, ...seos]);
    setIsEditing('new');
    setFormData(newSEO);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SEO Management</h2>
        <button onClick={addNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Add SEO Data
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {seos.map((seo) => (
            <div key={seo._id} className="bg-white border rounded-xl p-4">
              {isEditing === seo._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-semibold uppercase">Page Route</label>
                      <input className="w-full border rounded p-2 mt-1" placeholder="e.g. home, about, services" value={formData.pageRoute || ''} onChange={e => setFormData({...formData, pageRoute: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold uppercase">Meta Title</label>
                      <input className="w-full border rounded p-2 mt-1" value={formData.metaTitle || ''} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Meta Description</label>
                    <textarea className="w-full border rounded p-2 mt-1 h-20" value={formData.metaDescription || ''} onChange={e => setFormData({...formData, metaDescription: e.target.value})} />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Keywords (comma separated)</label>
                    <input className="w-full border rounded p-2 mt-1" value={formData.keywords?.join(', ') || ''} onChange={e => setFormData({...formData, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)})} />
                  </div>
                  
                  <div className="col-span-2 flex justify-end gap-2 mt-2">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200" onClick={() => { setIsEditing(null); if(seo._id === 'new') fetchSEOs(); }}>Cancel</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2" onClick={() => handleSave(seo._id)}><Save size={16} /> Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">/{seo.pageRoute}</span>
                      {seo.metaTitle}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{seo.metaDescription}</p>
                    {seo.keywords && seo.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {seo.keywords.map((kw, i) => <span key={i} className="text-xs bg-slate-50 border px-2 py-0.5 rounded">{kw}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(seo)}><Edit size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(seo._id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

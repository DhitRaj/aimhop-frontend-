"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { industryAPI } from "@/lib/api";
import { Industry } from "../types";

export function IndustriesView() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Industry>>({});

  const fetchIndustries = async () => {
    setIsLoading(true);
    const res = await industryAPI.getAll();
    if (res.data) setIndustries(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleEdit = (ind: Industry) => {
    setIsEditing(ind._id);
    setFormData(ind);
  };

  const handleSave = async (id: string) => {
    if (id === 'new') {
      await industryAPI.create(formData);
    } else {
      await industryAPI.update(id, formData);
    }
    setIsEditing(null);
    fetchIndustries();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this industry?")) {
      await industryAPI.delete(id);
      fetchIndustries();
    }
  };

  const addNew = () => {
    const newInd: any = {
      _id: 'new',
      title: '',
      description: '',
      icon: '',
      order: 0,
      isActive: true
    };
    setIndustries([newInd, ...industries]);
    setIsEditing('new');
    setFormData(newInd);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Industries We Serve</h2>
        <button onClick={addNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Add Industry
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {industries.map((ind) => (
            <div key={ind._id} className="bg-white border rounded-xl p-4">
              {isEditing === ind._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Title</label>
                    <input className="w-full border rounded p-2 mt-1" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Description</label>
                    <textarea className="w-full border rounded p-2 mt-1 h-20" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-semibold uppercase">Icon Name</label>
                      <input className="w-full border rounded p-2 mt-1" placeholder="e.g. Building2" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold uppercase">Order</label>
                      <input type="number" className="w-full border rounded p-2 mt-1" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id={`active-${ind._id}`} checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    <label htmlFor={`active-${ind._id}`} className="text-sm font-medium">Visible on site</label>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200" onClick={() => { setIsEditing(null); if(ind._id === 'new') fetchIndustries(); }}>Cancel</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2" onClick={() => handleSave(ind._id)}><Save size={16} /> Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start h-full">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {ind.icon && (
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {ind.icon.substring(0, 3)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          {ind.title}
                          {!ind.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Hidden</span>}
                        </h3>
                        <p className="text-xs text-slate-400">Order: {ind.order}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{ind.description}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(ind)}><Edit size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(ind._id)}><Trash2 size={16} /></button>
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

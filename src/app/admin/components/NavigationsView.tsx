"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { navigationAPI } from "@/lib/api";
import { Navigation } from "../types";

export function NavigationsView() {
  const [navigations, setNavigations] = useState<Navigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Navigation>>({});

  const fetchNavigations = async () => {
    setIsLoading(true);
    const res = await navigationAPI.getAll();
    if (res.data) setNavigations(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNavigations();
  }, []);

  const handleEdit = (nav: Navigation) => {
    setIsEditing(nav._id);
    setFormData(nav);
  };

  const handleSave = async (id: string) => {
    if (id === 'new') {
      await navigationAPI.create(formData);
    } else {
      await navigationAPI.update(id, formData);
    }
    setIsEditing(null);
    fetchNavigations();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this navigation link?")) {
      await navigationAPI.delete(id);
      fetchNavigations();
    }
  };

  const addNew = () => {
    const newNav: any = {
      _id: 'new',
      label: '',
      url: '',
      isExternal: false,
      order: 0,
      isActive: true,
      parentId: null
    };
    setNavigations([newNav, ...navigations]);
    setIsEditing('new');
    setFormData(newNav);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Navigation Menu</h2>
        <button onClick={addNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Add Link
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {navigations.map((nav) => (
            <div key={nav._id} className="bg-white border rounded-xl p-4 flex flex-col gap-4">
              {isEditing === nav._id ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Label</label>
                    <input className="w-full border rounded p-2 mt-1" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">URL</label>
                    <input className="w-full border rounded p-2 mt-1" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Order</label>
                    <input type="number" className="w-full border rounded p-2 mt-1" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" checked={formData.isExternal || false} onChange={e => setFormData({...formData, isExternal: e.target.checked})} />
                      External Link
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      Active
                    </label>
                  </div>
                  
                  <div className="col-span-2 flex justify-end gap-2 mt-2">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200" onClick={() => { setIsEditing(null); if(nav._id === 'new') fetchNavigations(); }}>Cancel</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2" onClick={() => handleSave(nav._id)}><Save size={16} /> Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {nav.label} 
                      {!nav.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Hidden</span>}
                      {nav.isExternal && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">External</span>}
                    </h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">{nav.url}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400 font-mono">Order: {nav.order}</div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(nav)}><Edit size={16} /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(nav._id)}><Trash2 size={16} /></button>
                    </div>
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

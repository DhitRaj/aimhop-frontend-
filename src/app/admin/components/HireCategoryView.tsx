"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, PlusCircle } from "lucide-react";
import { hireCategoryAPI } from "@/lib/api";

export function HireCategoryView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchCategories = async () => {
    setIsLoading(true);
    const res = await hireCategoryAPI.getAll();
    if (res.data) setCategories(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (cat: any) => {
    setIsEditing(cat._id);
    setFormData(cat);
  };

  const handleSave = async (id: string) => {
    if (id === 'new') {
      await hireCategoryAPI.create(formData);
    } else {
      await hireCategoryAPI.update(id, formData);
    }
    setIsEditing(null);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await hireCategoryAPI.delete(id);
      fetchCategories();
    }
  };

  const addNew = () => {
    const newCat = {
      _id: 'new',
      name: '',
      value: '',
      icon: 'Shield',
      description: '',
      colorClass: 'border-slate-500 bg-slate-50',
      iconColorClass: 'text-slate-600',
      hoverClass: 'hover:border-slate-300',
      roles: [],
      order: 0,
      isActive: true
    };
    setCategories([newCat, ...categories]);
    setIsEditing('new');
    setFormData(newCat);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hire Categories</h2>
        <button onClick={addNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white dark:bg-slate-900 border rounded-xl p-6">
              {isEditing === cat._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Name</label>
                      <input className="input-field w-full" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Value (Code)</label>
                      <input className="input-field w-full" placeholder="Value (e.g. SECURITY)" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Icon</label>
                      <input className="input-field w-full" placeholder="Icon (lucide-react)" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                      <input className="input-field w-full" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Container Color Class</label>
                      <input className="input-field w-full" placeholder="Color Class" value={formData.colorClass} onChange={e => setFormData({...formData, colorClass: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Icon Color Class</label>
                      <input className="input-field w-full" placeholder="Icon Color Class" value={formData.iconColorClass} onChange={e => setFormData({...formData, iconColorClass: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Hover Animation Class</label>
                      <input className="input-field w-full" placeholder="Hover Class" value={formData.hoverClass} onChange={e => setFormData({...formData, hoverClass: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Display Order</label>
                      <input className="input-field w-full" type="number" placeholder="Order" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Roles</h3>
                    {formData.roles.map((role: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input className="input-field flex-grow" value={role} onChange={e => {
                          const newRoles = [...formData.roles];
                          newRoles[i] = e.target.value;
                          setFormData({...formData, roles: newRoles});
                        }} />
                        <button className="text-red-500" onClick={() => setFormData({...formData, roles: formData.roles.filter((_: any, index: number) => index !== i)})}>
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button className="text-sm text-emerald-600 flex items-center gap-1" onClick={() => setFormData({...formData, roles: [...formData.roles, '']})}>
                      <PlusCircle size={14} /> Add Role
                    </button>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button className="btn-secondary" onClick={() => { setIsEditing(null); if(cat._id === 'new') fetchCategories(); }}>Cancel</button>
                    <button className="btn-primary" onClick={() => handleSave(cat._id)}><Save size={16} className="mr-2" /> Save</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{cat.name} ({cat.value})</h3>
                      <p className="text-slate-500 text-sm">{cat.description}</p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-bold" onClick={() => handleEdit(cat)}>
                        <Edit size={16} /> Edit Category & Roles
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold" onClick={() => handleDelete(cat._id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Roles ({cat.roles.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.roles.map((r: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-xs rounded-full border">{r}</span>
                      ))}
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

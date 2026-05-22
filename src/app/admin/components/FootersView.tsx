"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, PlusCircle, X } from "lucide-react";
import { footerAPI } from "@/lib/api";
import { FooterSection } from "../types";

export function FootersView() {
  const [footers, setFooters] = useState<FooterSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FooterSection>>({});

  const fetchFooters = async () => {
    setIsLoading(true);
    const res = await footerAPI.getAll();
    if (res.data) setFooters(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFooters();
  }, []);

  const handleEdit = (footer: FooterSection) => {
    setIsEditing(footer._id);
    setFormData(JSON.parse(JSON.stringify(footer))); // deep copy
  };

  const handleSave = async (id: string) => {
    if (id === 'new') {
      await footerAPI.create(formData);
    } else {
      await footerAPI.update(id, formData);
    }
    setIsEditing(null);
    fetchFooters();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this footer column?")) {
      await footerAPI.delete(id);
      fetchFooters();
    }
  };

  const addNew = () => {
    const newFooter: any = {
      _id: 'new',
      columnName: '',
      order: 0,
      isActive: true,
      links: []
    };
    setFooters([newFooter, ...footers]);
    setIsEditing('new');
    setFormData(newFooter);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Footer Management</h2>
        <button onClick={addNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={16} /> Add Column
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {footers.map((footer) => (
            <div key={footer._id} className="bg-white border rounded-xl p-4 flex flex-col">
              {isEditing === footer._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase">Column Name</label>
                    <input className="w-full border rounded p-2 mt-1" value={formData.columnName || ''} onChange={e => setFormData({...formData, columnName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-semibold uppercase">Order</label>
                      <input type="number" className="w-full border rounded p-2 mt-1" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                        Visible
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs text-slate-500 font-semibold uppercase">Links</label>
                      <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-xs font-semibold" 
                        onClick={() => setFormData({...formData, links: [...(formData.links || []), { label: '', url: '', isExternal: false }]})}>
                        <PlusCircle size={14} /> Add Link
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {formData.links?.map((link, idx) => (
                        <div key={idx} className="bg-slate-50 border p-2 rounded relative">
                          <button className="absolute top-2 right-2 text-red-400 hover:text-red-600" 
                            onClick={() => {
                              const newLinks = [...(formData.links || [])];
                              newLinks.splice(idx, 1);
                              setFormData({...formData, links: newLinks});
                            }}>
                            <X size={14} />
                          </button>
                          <input placeholder="Label" className="w-full border rounded p-1 mb-1 text-sm pr-6" value={link.label} onChange={e => {
                            const newLinks = [...(formData.links || [])];
                            newLinks[idx].label = e.target.value;
                            setFormData({...formData, links: newLinks});
                          }} />
                          <input placeholder="URL" className="w-full border rounded p-1 mb-1 text-sm" value={link.url} onChange={e => {
                            const newLinks = [...(formData.links || [])];
                            newLinks[idx].url = e.target.value;
                            setFormData({...formData, links: newLinks});
                          }} />
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <input type="checkbox" checked={link.isExternal} onChange={e => {
                              const newLinks = [...(formData.links || [])];
                              newLinks[idx].isExternal = e.target.checked;
                              setFormData({...formData, links: newLinks});
                            }} /> External
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200" onClick={() => { setIsEditing(null); if(footer._id === 'new') fetchFooters(); }}>Cancel</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2" onClick={() => handleSave(footer._id)}><Save size={16} /> Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {footer.columnName}
                        {!footer.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Hidden</span>}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Order: {footer.order}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(footer)}><Edit size={16} /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(footer._id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-2">
                      {footer.links?.map((link, idx) => (
                        <li key={idx} className="text-sm flex items-center justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                          <span className="font-medium text-slate-700">{link.label}</span>
                          <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">{link.url}</span>
                        </li>
                      ))}
                      {(!footer.links || footer.links.length === 0) && (
                        <li className="text-sm text-slate-400 italic">No links added</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

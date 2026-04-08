"use client";

import { useState } from "react";
import { Download, Mail, Phone, Calendar, FileText, UserCircle, Briefcase, Trash2, Loader2 } from "lucide-react";
import { Career } from "../types";
import { careerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

export function CareersView({ careers: initialCareers }: { careers: Career[] }) {
  const [careers, setCareers] = useState<Career[]>(initialCareers);
  const [selected, setSelected] = useState<Career | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    setDeleting(id);
    const { error } = await careerAPI.delete(id);
    if (!error) {
      setCareers(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
    }
    setDeleting(null);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Applications ({careers.length})</h3>
        </div>
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {careers.map((app) => (
            <button
              key={app._id}
              onClick={() => setSelected(app)}
              className={`w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selected?._id === app._id ? "bg-sky-50 dark:bg-sky-900/10 border-l-2 border-sky-600" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{app.name}</span>
                <span className="text-[9px] font-bold text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest">{app.position}</p>
              <p className="text-[10px] text-slate-500 mt-1">{app.experience} Exp</p>
            </button>
          ))}
          {careers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">No applications</div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {selected ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md shadow-sky-600/10 shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{selected.name}</h3>
                    <p className="text-sky-600 font-bold text-[10px] uppercase tracking-widest">{selected.position} Applicant</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 {selected.resumeUrl && (
                   <a 
                     href={getMediaUrl(selected.resumeUrl)}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:shadow-lg transition-all"
                   >
                     <Download size={14} /> Resume
                   </a>
                 )}
                 <button
                   onClick={() => handleDelete(selected._id)}
                   disabled={deleting === selected._id}
                   className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 rounded-lg disabled:opacity-50"
                 >
                    {deleting === selected._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                 </button>
               </div>
            </div>

            <div className="px-8 py-8 flex-1 overflow-y-auto space-y-10">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Contact Information</h4>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 group">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                              <Mail size={14} />
                           </div>
                           {selected.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 group">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                              <Phone size={14} />
                           </div>
                           {selected.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 group">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Calendar size={14} />
                           </div>
                           Applied on {new Date(selected.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Experience & Role</h4>
                     <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-start gap-3">
                           <Briefcase size={16} className="text-sky-600 mt-1 shrink-0" />
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Experience</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{selected.experience || "Not Provided"}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <UserCircle size={16} className="text-sky-600 mt-1 shrink-0" />
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Applying For</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{selected.position || "Not Provided"}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-start gap-3 italic">
                  <FileText className="text-slate-400 mt-1 shrink-0" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Candidate information is provided above. Check the resume carefully for verification before calling.
                  </p>
               </div>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
              <a href={`tel:${selected.phone}`} className="flex-1 text-center bg-emerald-600 text-white py-3 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                Call Candidate
              </a>
              <a href={`mailto:${selected.email}`} className="flex-1 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center gap-4 bg-slate-50/30 dark:bg-slate-900/10 font-medium">
            <UserCircle size={48} className="text-slate-200" />
            <p className="font-semibold text-sm uppercase tracking-widest text-slate-400">Select an applicant to view profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

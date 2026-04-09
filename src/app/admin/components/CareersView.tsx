"use client";

import { useState } from "react";
import { 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  Search, 
  User,
  Clock,
  PhoneCall,
  Send,
  MapPin,
  CheckCircle2,
  X
} from "lucide-react";
import { Career } from "../types";
import { careerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

// Smart resume handler - opens webp as image, downloads actual PDFs
const openOrDownloadResume = async (url: string, name: string) => {
  const isWebp = url.includes('.webp') || url.includes('format=webp');
  
  if (isWebp) {
    // Old uploads were stored as webp images, open in new tab
    window.open(url, '_blank');
    return;
  }

  // For actual PDF files - force download
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `Resume_${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('Download failed', e);
    window.open(url, '_blank');
  }
};

export function CareersView({ careers: initialCareers }: { careers: Career[] }) {
  const [careers, setCareers] = useState<Career[]>(initialCareers);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    setDeleting(id);
    const { error } = await careerAPI.delete(id);
    if (!error) {
      setCareers(prev => prev.filter(c => c._id !== id));
    }
    setDeleting(null);
  };

  const filtered = careers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.position.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] text-left">
      {/* Header & Search */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
         <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Job Applications</h3>
         <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search applications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
         </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Applicant</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Position</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Experience</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Contact</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Message</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Resume</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map(app => (
              <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{app.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{app.email}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded uppercase tracking-widest">{app.position}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-800 px-2 py-1 rounded bg-white dark:bg-slate-950">{app.experience} Years</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[10px] font-bold text-slate-900 dark:text-slate-300">{app.phone || 'N/A'}</p>
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <p className="text-[10px] font-medium text-slate-500 truncate" title={app.message}>{app.message || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  {app.resumeUrl ? (
                    <button
                      onClick={() => openOrDownloadResume(
                        app.resumeUrl.startsWith('http') ? app.resumeUrl : getMediaUrl(app.resumeUrl),
                        app.name
                      )}
                      className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-[0.1em]"
                    >
                      <Download size={12} /> Download PDF
                    </button>
                  ) : <span className="text-[10px] text-slate-400 font-bold uppercase">None</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(app._id)}
                    disabled={deleting === app._id}
                    className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
                  >
                    {deleting === app._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <User size={32} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No applications found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

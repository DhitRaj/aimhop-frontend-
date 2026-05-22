"use client";

import { useState } from "react";
import { 
  Download, 
  Trash2, 
  Loader2, 
  Search, 
  User
} from "lucide-react";
import { Career } from "../types";
import { careerAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";


// Download via backend proxy — avoids Cloudinary CORS on raw file uploads
const downloadResume = (careerId: string) => {
  // Backend sets Content-Disposition: attachment, browser triggers download automatically
  const proxyUrl = careerAPI.downloadResume(careerId);
  const anchor = document.createElement('a');
  anchor.href = proxyUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export function CareersView({ careers: initialCareers }: { careers: Career[] }) {
  const [careers, setCareers] = useState<Career[]>(initialCareers);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPage = async (p: number) => {
    setLoading(true);
    const { data, total: totalCount, totalPages: pages } = await careerAPI.getAll(p, 10);
    if (data) {
      setCareers(data as Career[]);
      setTotal(totalCount || 0);
      setTotalPages(pages || 1);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    setDeleting(id);
    const { error } = await careerAPI.delete(id);
    if (!error) {
      fetchPage(page);
    }
    setDeleting(null);
  };

  const filtered = careers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.position.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] text-left">
      {/* Header & Search */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
         <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Job Applications</h3>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Total: {total}</p>
         </div>
         <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search applications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-200 transition-all text-slate-900 placeholder:text-slate-300"
            />
         </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white sticky top-0 z-10">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Applicant</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Position</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Experience</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Contact</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Message</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Resume</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(app => (
               <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{app.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{app.email}</p>
                  {(app.height || app.weight) && (
                    <p className="text-[9px] font-semibold text-slate-500 mt-0.5">
                      {app.height ? `H: ${app.height}` : ''} {app.weight ? `| W: ${app.weight}` : ''}
                    </p>
                  )}
                  <p className="text-[9px] text-slate-400 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">{app.position}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded bg-white">{app.experience} Years</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[10px] font-bold text-slate-900">{app.phone || 'N/A'}</p>
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <p className="text-[10px] font-medium text-slate-500 truncate" title={app.message}>{app.message || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  {app.resumeUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume(app._id)}
                      className="text-[10px] uppercase tracking-[0.1em]"
                      leftIcon={<Download size={12} />}
                    >
                      Download Resume
                    </Button>
                  ) : <span className="text-[10px] text-slate-400 font-bold uppercase">None</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="danger"
                    size="icon-sm"
                    onClick={() => handleDelete(app._id)}
                    isLoading={deleting === app._id}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <User size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No applications found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={page === 1 || loading}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              fetchPage(newPage);
            }}
            variant="outline"
            size="sm"
            className="text-[10px] uppercase tracking-widest font-bold"
          >
            Previous
          </Button>
          <Button
            disabled={page === totalPages || loading}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              fetchPage(newPage);
            }}
            variant="primary"
            size="sm"
            className="text-[10px] uppercase tracking-widest font-bold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  Trash2, 
  Loader2, 
  Search, 
  User,
  CheckCircle,
  XCircle,
  Eye,
  FileText
} from "lucide-react";
import { workerAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface WorkerData {
  _id: string;
  fullName: string;
  phone: string;
  category: string;
  role: string;
  city: string;
  expectedSalary: number;
  aadhaarNumber?: string;
  aadhaarDocUrl?: string;
  photoUrl?: string;
  height?: string;
  weight?: string;
  resumeUrl?: string;
  status: "PENDING" | "REVIEWING" | "VERIFIED" | "REJECTED";
  notes?: string;
  createdAt: string;
}

export function WorkersView({ workers: initialWorkers }: { workers: WorkerData[] }) {
  const [workers, setWorkers] = useState<WorkerData[]>(initialWorkers);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPage = async (p: number) => {
    setLoading(true);
    const { data, total: totalCount, totalPages: pages } = await workerAPI.getAll(p, 10);
    if (data) {
      setWorkers(data as WorkerData[]);
      setTotal(totalCount || 0);
      setTotalPages(pages || 1);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worker application?')) return;
    setDeleting(id);
    const { error } = await workerAPI.delete(id);
    if (!error) {
      fetchPage(page);
    }
    setDeleting(null);
  };

  const handleUpdateStatus = async (id: string, status: "PENDING" | "REVIEWING" | "VERIFIED" | "REJECTED") => {
    setUpdating(id);
    const { error } = await workerAPI.updateStatus(id, status);
    if (!error) {
      fetchPage(page);
    }
    setUpdating(null);
  };

  const filtered = workers.filter(w => 
    w.fullName.toLowerCase().includes(search.toLowerCase()) || 
    w.phone.includes(search) ||
    w.city.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] text-left">
      {/* Header & Search */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
         <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Worker Pool ({total})</h3>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Verification Panel</p>
         </div>
         <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, city..."
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
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white sticky top-0 z-10">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Worker Details</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Category / Role</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">City</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Salary Profile</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Documents</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(w => (
               <tr key={w._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {w.photoUrl ? (
                      <img src={w.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border text-slate-400"><User size={14} /></div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{w.fullName}</p>
                      <p className="text-[10px] font-bold text-slate-500">{w.phone}</p>
                      {(w.height || w.weight) && (
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
                          {w.height ? `H: ${w.height}` : ''} {w.weight ? `| W: ${w.weight}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{w.category}</span>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">{w.role || "General"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">{w.city}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-900">₹{w.expectedSalary || "0"}/mo</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    {w.aadhaarDocUrl ? (
                      <a href={w.aadhaarDocUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
                        <FileText size={12} /> Aadhaar
                      </a>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 uppercase">No Aadhaar</span>
                    )}
                    {w.resumeUrl && (
                      <a href={w.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-wider">
                        <FileText size={12} /> Resume
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                    w.status === "VERIFIED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    w.status === "REJECTED" ? "bg-red-50 text-red-700 border border-red-200" :
                    "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {w.status !== "VERIFIED" && (
                      <Button 
                        variant="primary" 
                        size="icon-sm" 
                        onClick={() => handleUpdateStatus(w._id, "VERIFIED")}
                        isLoading={updating === w._id}
                        title="Approve / Verify Worker"
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                    {w.status !== "REJECTED" && (
                      <Button 
                        variant="outline" 
                        size="icon-sm" 
                        onClick={() => handleUpdateStatus(w._id, "REJECTED")}
                        isLoading={updating === w._id}
                        title="Reject Worker"
                        className="text-red-500 border-red-100 hover:bg-red-50"
                      >
                        <XCircle size={14} />
                      </Button>
                    )}
                    <Button 
                      variant="danger"
                      size="icon-sm"
                      onClick={() => handleDelete(w._id)}
                      isLoading={deleting === w._id}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
               </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <User size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No workers found</p>
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

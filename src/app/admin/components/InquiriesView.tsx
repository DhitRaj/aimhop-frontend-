"use client";

import { useState } from "react";
import { 
  Trash2, 
  Loader2, 
  Search, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Building
} from "lucide-react";
import { inquiryAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface InquiryData {
  _id: string;
  category: "SECURITY" | "MANPOWER";
  roleNeeded: string;
  count: number;
  city: string;
  shiftTiming?: string;
  contactName: string;
  company?: string;
  phone: string;
  email?: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  notes?: string;
  createdAt: string;
}

export function InquiriesView({ inquiries: initialInquiries }: { inquiries: InquiryData[] }) {
  const [inquiries, setInquiries] = useState<InquiryData[]>(initialInquiries);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPage = async (p: number) => {
    setLoading(true);
    const { data, total: totalCount, totalPages: pages } = await inquiryAPI.getAll(p, 10);
    if (data) {
      setInquiries(data as InquiryData[]);
      setTotal(totalCount || 0);
      setTotalPages(pages || 1);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hire inquiry?')) return;
    setDeleting(id);
    const { error } = await inquiryAPI.delete(id);
    if (!error) {
      fetchPage(page);
    }
    setDeleting(null);
  };

  const handleUpdateStatus = async (id: string, status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED") => {
    setUpdating(id);
    const { error } = await inquiryAPI.updateStatus(id, status);
    if (!error) {
      fetchPage(page);
    }
    setUpdating(null);
  };

  const filtered = inquiries.filter(i => 
    i.contactName.toLowerCase().includes(search.toLowerCase()) || 
    i.phone.includes(search) ||
    i.roleNeeded.toLowerCase().includes(search.toLowerCase()) ||
    (i.company && i.company.toLowerCase().includes(search.toLowerCase())) ||
    i.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] text-left">
      {/* Header & Search */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
         <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hire Inquiries ({total})</h3>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Client Pipeline</p>
         </div>
         <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by contact, company, role..."
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
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Client / Company</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Role Needed</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">City</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Details</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Date</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(i => (
               <tr key={i._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{i.contactName}</p>
                  {i.company && <p className="text-[10px] font-bold text-slate-500 uppercase">{i.company}</p>}
                  <p className="text-[10px] font-bold text-emerald-600 mt-1">{i.phone}</p>
                  {i.email && <p className="text-[9px] text-slate-400">{i.email}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{i.category}</span>
                  <span className="block text-[10px] font-bold text-slate-800 uppercase">{i.roleNeeded}</span>
                  <span className="block text-[9px] text-slate-400">{i.count} Pax</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">{i.city}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="block text-[10px] text-slate-500">{i.shiftTiming || "Regular shift"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                    i.status === "CONVERTED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    i.status === "CONTACTED" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                    i.status === "CLOSED" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                    "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                  }`}>
                    {i.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] text-slate-500">{new Date(i.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {i.status === "NEW" && (
                      <Button 
                        variant="outline" 
                        size="icon-sm" 
                        onClick={() => handleUpdateStatus(i._id, "CONTACTED")}
                        isLoading={updating === i._id}
                        title="Mark Contacted"
                        className="text-blue-500 hover:bg-blue-50 border-blue-100"
                      >
                        <MessageSquare size={14} />
                      </Button>
                    )}
                    {i.status !== "CONVERTED" && (
                      <Button 
                        variant="primary" 
                        size="icon-sm" 
                        onClick={() => handleUpdateStatus(i._id, "CONVERTED")}
                        isLoading={updating === i._id}
                        title="Mark Converted / Won"
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                    <Button 
                      variant="danger"
                      size="icon-sm"
                      onClick={() => handleDelete(i._id)}
                      isLoading={deleting === i._id}
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
                  <Building size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No inquiries found</p>
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

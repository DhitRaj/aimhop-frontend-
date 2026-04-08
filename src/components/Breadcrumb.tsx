"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  title: string;
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
      <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" /> Home
      </Link>
      <ChevronRight className="w-3 h-3" />
      <span className="text-sky-600">{title}</span>
    </nav>
  );
}

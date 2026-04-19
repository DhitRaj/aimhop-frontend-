"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  title: string;
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 py-12">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
        <Home size={12} /> Home
      </Link>
      <ChevronRight size={12} className="opacity-30" />
      <span className="text-primary">{title}</span>
    </nav>
  );
}

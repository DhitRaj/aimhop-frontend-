"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  title: string;
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-[#6B7068] py-8 md:py-12">
      <Link href="/" className="hover:text-[#5CC67A] transition-colors flex items-center gap-2 font-medium">
        <Home size={14} /> Home
      </Link>
      <ChevronRight size={14} className="opacity-30" />
      <span className="text-[#1A1A18] font-semibold">{title}</span>
    </nav>
  );
}

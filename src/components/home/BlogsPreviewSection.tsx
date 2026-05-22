import SafeImage from "@/components/SafeImage";
import { getMediaUrl } from "@/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export function BlogsPreviewSection({ blogs }: { blogs: any[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container-pad relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Latest News & <br />
              <span className="gradient-text">Insights.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium">Expert security advice, industry updates, and safety guides from the AimHop team.</p>
          </div>
          <Link href="/blogs" className="btn-secondary group">
            Browse All Articles <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((post: any) => (
            <Link
              key={post._id}
              href={`/blogs/${post._id}`}
              className="group flex flex-col space-y-6"
            >
              <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border relative">
                <SafeImage
                  src={getMediaUrl(post.image)}
                  alt={post.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest border border-border shadow-lg">
                    {post.category || 'Security'}
                  </span>
                </div>
              </div>
              <div className="space-y-4 px-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium line-clamp-2 italic">
                  {post.excerpt || post.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  READ STORY <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

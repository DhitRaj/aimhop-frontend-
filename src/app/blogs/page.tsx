"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { blogAPI, settingsAPI, bannerAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { BlogSkeleton } from "@/components/Skeleton";
import { useSync } from "@/hooks/useSync";

export default function BlogsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<any>(null);

  const fetchData = async () => {
    const [br, sr, bnr] = await Promise.all([
      blogAPI.getAll(), 
      settingsAPI.get(),
      bannerAPI.getAll(true, 'Blogs')
    ]);
    if (br.data) {
      const blogsData = Array.isArray(br.data) ? br.data : (br.data as any).data;
      if (Array.isArray(blogsData)) setBlogs(blogsData);
    }
    if (sr.data) setSettings(sr.data);
    if (bnr.data && Array.isArray(bnr.data) && bnr.data.length > 0) {
      setBanner(bnr.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useSync(fetchData, 20000);


  const heroImg = getMediaUrl(banner?.image || settings?.heroImage);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pb-32">
        <PageHero
          title="Security Insights"
          subtitle="Tactical Advice, Industry Intel & Mission Updates"
          backgroundImage={heroImg}
        />

        <div className="container-pad">
          <Breadcrumb title="Intelligence Feed" />

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="group bg-card border border-border rounded-[3rem] overflow-hidden card-hover flex flex-col"
                >
                  <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                    {blog.thumbnail ? (
                      <img
                        src={getMediaUrl(blog.thumbnail)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/10">
                        <BookOpen size={64} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                        {blog.category || 'Security'}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><User size={14} className="text-primary" /> {blog.author || 'Command'}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3">
                        {blog.content?.replace(/[#*`]/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="pt-8 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-3 transition-transform inline-flex items-center gap-3">
                        Intel Details <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {blogs.length === 0 && (
                <div className="col-span-full py-32 text-center bg-muted/30 rounded-[4rem] border border-border border-dashed">
                  <p className="text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">No intelligence entries found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

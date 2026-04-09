"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { blogAPI, settingsAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

// API_BASE removed in favor of getMediaUrl utility

export default function BlogsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([blogAPI.getAll(), settingsAPI.get()]).then(([br, sr]) => {
      if (br.data) setBlogs(br.data);
      if (sr.data) setSettings(sr.data);
      setLoading(false);
    });
  }, []);

  const heroImg = getMediaUrl(settings?.heroImage);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <Navbar />

      <main className="pb-20">
        <PageHero
          title="Security Insights"
          subtitle="Latest News, Tips & Industry Updates"
          backgroundImage={heroImg}
        />

        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb title="Blogs & News" />

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    {blog.thumbnail ? (
                      <img
                        src={getMediaUrl(blog.thumbnail)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-sky-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                        {blog.category || 'Security'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-sky-600" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><User size={12} className="text-sky-600" /> {blog.author || 'Admin'}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight mb-4 group-hover:text-sky-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {blog.content?.replace(/[#*`]/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {blogs.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 font-black uppercase tracking-widest">No articles found</p>
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

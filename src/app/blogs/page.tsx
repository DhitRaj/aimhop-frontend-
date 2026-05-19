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
    <div className="bg-[#FAFAF8] dark:bg-[#0a0a0b] min-h-screen transition-colors duration-200">
      <Navbar />

      <main className="pb-32">
        <PageHero
          title="Security Insights & News"
          subtitle="Expert advice, industry updates, and safety guides from our team"
          backgroundImage={heroImg}
        />

        <div className="max-w-[1240px] mx-auto px-8 md:px-12">
          <Breadcrumb title="Blog" />

          {/* Intro */}
          <div className="mb-16 max-w-3xl">
            <div className="text-[12px] font-bold tracking-[1.2px] uppercase text-[#3daa5e] mb-3">Latest Articles</div>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-1.5px] leading-[1.12] text-[#1A1A18] dark:text-[#f8fafc] mb-4 transition-colors duration-200">
              Stay informed about security trends
            </h2>
            <p className="text-[16.5px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.7] transition-colors duration-200">
              Read our latest articles on security best practices, industry news, and safety tips.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] overflow-hidden h-[420px] animate-pulse transition-colors duration-200">
                  <div className="h-48 bg-[#F1F5F9] dark:bg-[#1e1e24]"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded w-1/2"></div>
                    <div className="h-4 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded"></div>
                    <div className="h-3 bg-[#F1F5F9] dark:bg-[#1e1e24] rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="group bg-white dark:bg-[#111113] border-[1.5px] border-[#E8E8E4] dark:border-[#1e1e24] rounded-[20px] overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_48px_rgba(92,198,122,.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#E8F8ED] to-[#FFF0E6] overflow-hidden relative">
                    {blog.thumbnail ? (
                      <img
                        src={getMediaUrl(blog.thumbnail)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={48} className="text-[#5CC67A]/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-[#5CC67A] text-white text-[11px] font-bold tracking-[0.8px] uppercase rounded-full shadow-lg">
                        {blog.category || 'Security'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-[11px] text-[#6B7068] dark:text-[#94a3b8] transition-colors duration-200">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#5CC67A]" /> 
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User size={12} className="text-[#5CC67A]" /> 
                          {blog.author || 'Admin'}
                        </span>
                      </div>
                      <h3 className="font-['Bricolage_Grotesque',sans-serif] text-[18px] font-bold text-[#1A1A18] dark:text-[#f8fafc] group-hover:text-[#5CC67A] transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-[14px] text-[#6B7068] dark:text-[#94a3b8] leading-[1.65] line-clamp-3 transition-colors duration-200">
                        {blog.excerpt || blog.content?.replace(/[#*`]/g, '').substring(0, 120)}...
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E8E8E4] dark:border-[#1e1e24] flex items-center justify-between transition-colors duration-200">
                      <span className="text-[13px] font-semibold text-[#5CC67A] group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {blogs.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center bg-white dark:bg-[#111113] rounded-[32px] border-[1.5px] border-dashed border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
                  <BookOpen size={48} className="mx-auto text-[#6B7068] dark:text-[#94a3b8]/20 mb-4 transition-colors duration-200" />
                  <p className="text-[#6B7068] dark:text-[#f8fafc] font-semibold transition-colors duration-200">No articles found</p>
                  <p className="text-[13px] text-[#6B7068] dark:text-[#94a3b8]/60 mt-2 transition-colors duration-200">Check back soon for new content</p>
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

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, User, Share2, MessageSquare, ArrowLeft, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { blogAPI } from "@/lib/api";
import { getMediaUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

// ==================== Dynamic Metadata (SEO) ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await blogAPI.getById(id);
  const blog = res.data;

  if (!blog) {
    return { title: 'Article Not Found | AimHop' };
  }

  const excerpt = blog.content.substring(0, 160).replace(/\n/g, ' ') + '...';

  return {
    title: `${blog.title} | AimHop Insights`,
    description: excerpt,
    openGraph: {
      title: blog.title,
      description: excerpt,
      images: blog.image ? [getMediaUrl(blog.image)] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await blogAPI.getById(id);
  const blog = res.data;

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#0a0a0b] px-6 text-center transition-colors duration-200">
       <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">Article Not Found</h1>
       <Link href="/blogs" className="text-[#5CC67A] dark:text-[#7de09a] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:translate-x-[-4px] transition-all">
         <ArrowLeft size={16} /> Back to Insights
       </Link>
    </div>
  );

  const imageUrl = getMediaUrl(blog.image);

  return (
    <div className="bg-[#FAFAF8] dark:bg-[#0a0a0b] min-h-screen font-sans transition-colors duration-200">
      <Navbar />
      
      <article className="pt-40 pb-32">
        <section className="relative h-[400px] md:h-[500px] mb-[-150px] z-0 overflow-hidden">
           {imageUrl && (
             <Image 
               src={imageUrl} 
               alt={blog.title}
               fill
               className="object-cover object-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
               priority
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] dark:from-[#0a0a0b] via-transparent to-transparent transition-colors duration-200" />
        </section>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <div className="bg-white dark:bg-[#111113] border border-[#E8E8E4] dark:border-[#1e1e24] rounded-[4rem] shadow-2xl p-10 md:p-20 space-y-12 transition-colors duration-200">
              <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-[#6B7068] dark:text-[#94a3b8] uppercase tracking-widest transition-colors duration-200">
                 <span className="flex items-center gap-3 px-5 py-2 bg-[#5CC67A] text-white rounded-full">{blog.category || 'Security'}</span>
                 <time dateTime={blog.createdAt} className="flex items-center gap-3">
                   <Calendar size={14} className="text-[#5CC67A]" /> {new Date(blog.createdAt).toLocaleDateString()}
                 </time>
                 <span className="flex items-center gap-3"><User size={14} className="text-[#5CC67A]" /> {blog.author || 'Command'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-4 text-[#1A1A18] dark:text-[#f8fafc] transition-colors duration-200">
                {blog.title}
              </h1>

              {imageUrl && (
                <div className="aspect-[16/9] relative rounded-[3rem] overflow-hidden shadow-2xl border border-[#E8E8E4] dark:border-[#1e1e24] transition-colors duration-200">
                   <Image 
                     src={imageUrl} 
                     alt={blog.title}
                     fill
                     className="object-cover"
                   />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none prose-lg">
                <div className="text-lg text-[#6B7068] dark:text-[#94a3b8] font-medium leading-relaxed space-y-8 whitespace-pre-wrap transition-colors duration-200">
                  {blog.content}
                </div>
              </div>

              <div className="pt-12 border-t border-[#E8E8E4] dark:border-[#1e1e24] flex flex-wrap justify-between items-center gap-8 transition-colors duration-200">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-[#F1F5F9] dark:bg-[#1e1e24] border border-[#E8E8E4] dark:border-[#1e1e24] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1A18] dark:text-[#f8fafc] hover:bg-[#5CC67A] hover:text-white transition-all">
                       <Share2 size={16} /> Share
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-[#F1F5F9] dark:bg-[#1e1e24] border border-[#E8E8E4] dark:border-[#1e1e24] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1A18] dark:text-[#f8fafc] hover:bg-[#5CC67A] hover:text-white transition-all">
                       <Bookmark size={16} /> Bookmark
                    </button>
                 </div>
                 <div className="flex items-center gap-4 px-6 py-4 bg-[#E8F8ED] dark:bg-[#1e3a28] rounded-2xl border border-[#5CC67A]/20 dark:border-[#5CC67A]/10 transition-colors duration-200">
                    <MessageSquare size={18} className="text-[#5CC67A]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5CC67A]/60 dark:text-[#5CC67A]/70">Comments Offline</span>
                 </div>
              </div>
           </div>

           <div className="mt-16 flex justify-center">
              <Link href="/blogs" className="btn-secondary group flex items-center gap-4 px-12 py-6 rounded-[2rem]">
                 <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform" /> Back to Intelligence Feed
              </Link>
           </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

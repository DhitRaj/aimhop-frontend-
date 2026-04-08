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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-6 text-center">
       <h1 className="text-4xl font-black uppercase text-slate-900 dark:text-white mb-4">Article Not Found</h1>
       <Link href="/blogs" className="text-sky-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
         <ArrowLeft size={16} /> Back to Blogs
       </Link>
    </div>
  );

  const imageUrl = getMediaUrl(blog.image);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-sans">
      <Navbar />
      
      <article className="pt-32 pb-20">
        <section className="relative h-[350px] md:h-[450px] mb-[-100px] z-0 overflow-hidden">
           {imageUrl && (
             <Image 
               src={imageUrl} 
               alt={blog.title}
               fill
               className="object-cover object-center opacity-30"
               priority
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent" />
        </section>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-14">
              <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900/30 text-sky-600 rounded-full">{blog.category || 'Security'}</span>
                 <time dateTime={blog.createdAt} className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                   <Calendar size={14} className="text-sky-600" /> {new Date(blog.createdAt).toLocaleDateString()}
                 </time>
                 <span className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6"><User size={14} className="text-sky-600" /> {blog.author || 'Admin'}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-10">
                {blog.title}
              </h1>

              {imageUrl && (
                <div className="aspect-[16/9] relative rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl">
                   <Image 
                     src={imageUrl} 
                     alt={blog.title}
                     fill
                     className="object-cover"
                   />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none prose-slate">
                <div className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium space-y-6 whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                       <Share2 size={16} /> Share Article
                    </button>
                    <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                       <Bookmark size={16} /> Save for later
                    </button>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                       <MessageSquare size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comments coming soon</span>
                 </div>
              </div>
           </div>

           <div className="mt-12 flex justify-center">
              <Link href="/blogs" className="flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                 <ArrowLeft size={18} /> Explore More Insights
              </Link>
           </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

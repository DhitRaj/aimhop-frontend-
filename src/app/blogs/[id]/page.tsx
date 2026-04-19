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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
       <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Article Not Found</h1>
       <Link href="/blogs" className="text-primary font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:translate-x-[-4px] transition-transform">
         <ArrowLeft size={16} /> Back to Insights
       </Link>
    </div>
  );

  const imageUrl = getMediaUrl(blog.image);

  return (
    <div className="bg-background min-h-screen font-sans">
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
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </section>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <div className="bg-card border border-border rounded-[4rem] shadow-2xl p-10 md:p-20 space-y-12">
              <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                 <span className="flex items-center gap-3 px-5 py-2 bg-primary text-white rounded-full">{blog.category || 'Security'}</span>
                 <time dateTime={blog.createdAt} className="flex items-center gap-3">
                   <Calendar size={14} className="text-primary" /> {new Date(blog.createdAt).toLocaleDateString()}
                 </time>
                 <span className="flex items-center gap-3"><User size={14} className="text-primary" /> {blog.author || 'Command'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                {blog.title}
              </h1>

              {imageUrl && (
                <div className="aspect-[16/9] relative rounded-[3rem] overflow-hidden shadow-2xl border border-border">
                   <Image 
                     src={imageUrl} 
                     alt={blog.title}
                     fill
                     className="object-cover"
                   />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none prose-lg">
                <div className="text-lg text-muted-foreground font-medium leading-relaxed space-y-8 whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              <div className="pt-12 border-t border-border flex flex-wrap justify-between items-center gap-8">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-white transition-all">
                       <Share2 size={16} /> Share
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-white transition-all">
                       <Bookmark size={16} /> Bookmark
                    </button>
                 </div>
                 <div className="flex items-center gap-4 px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <MessageSquare size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Comments Offline</span>
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

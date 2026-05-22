import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import {
  Shield,
  Camera,
  Users,
  Clock,
  ArrowRight,
  Globe,
  Award,
  Zap,
  Phone,
  Building2,
  Star,
  CheckCircle,
  MapPin,
  ChevronRight,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import { serviceAPI, settingsAPI, clientAPI, testimonialAPI, bannerAPI, blogAPI } from "@/lib/api";
import { ServiceSkeleton, TestimonialSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";
import { SyncHandler } from "@/components/SyncHandler";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { CctvSurveillanceSection } from "@/components/home/CctvSurveillanceSection";
import { WhyAimhopSection } from "@/components/home/WhyAimhopSection";
import { ServicesPreviewSection } from "@/components/home/ServicesPreviewSection";
import { BlogsPreviewSection } from "@/components/home/BlogsPreviewSection";
import { CtaSection } from "@/components/home/CtaSection";
import { TestimonialsPreviewSection } from "@/components/home/TestimonialsPreviewSection";



const IconMap: any = {
  Shield: <Shield className="w-8 h-8" />,
  Camera: <Camera className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
};

const getRatingColor = (r: number) => {
  if (r <= 2) return "text-orange-500";
  if (r === 3) return "text-amber-500";
  if (r === 4) return "text-lime-500";
  return "text-emerald-500";
};

async function getHomeData() {
  const [servicesRes, settingsRes, clientsRes, testimonialsRes, bannersRes, blogsRes, layoutRes] = await Promise.all([
    serviceAPI.getAll(),
    settingsAPI.get(),
    clientAPI.getAll(),
    testimonialAPI.getAll(),
    bannerAPI.getAll(true, 'Home'),
    blogAPI.getAll(),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/pages/layout/home`, { next: { tags: ['page-layout'], revalidate: 3600 } }).then(res => res.json()).catch(() => ({ data: null }))
  ]);
  return {
    services: (servicesRes.data as any[])?.slice(0, 3) || [],
    settings: settingsRes.data || null,
    clients: (clientsRes.data as any[]) || [],
    testimonials: (testimonialsRes.data as any[])?.slice(0, 2) || [],
    banners: (bannersRes.data as any[]) || [],
    blogs: (blogsRes.data as any[])?.slice(0, 3) || [],
    layout: layoutRes?.data || null
  };
}


// Add safe component mapping
const componentMap: any = {
  HeroSection,
  TrustedBySection,
  CctvSurveillanceSection,
  WhyAimhopSection,
  ServicesPreviewSection,
  TestimonialsPreviewSection,
  BlogsPreviewSection,
  CtaSection
};

export default async function HomePage() {
  const { services, settings, testimonials, banners, blogs, layout } = await getHomeData();

  const activeBanner = banners.length > 0 ? banners[0] : null;
  const heroImg = getMediaUrl(activeBanner?.image || settings?.heroImage);
  const heroSubtitle = activeBanner?.subtitle || settings?.heroSubtitle || "AimHop Security Solutions Pvt. Ltd. — India's trusted security company.";

  const features = [
    {
      icon: <Users className="w-full h-full" />,
      title: settings?.feature1Title || "Experienced Staff",
      desc: settings?.feature1Desc || "We have experienced professionals who can easily understand our clients' requirements.",
    },
    {
      icon: <BadgeCheck className="w-full h-full" />,
      title: settings?.feature2Title || "Top-Tier Quality",
      desc: settings?.feature2Desc || "Our no-compromise approach to quality ensures that our solutions are user-friendly forever.",
      highlight: true
    },
    {
      icon: <Zap className="w-full h-full" />,
      title: settings?.feature3Title || "Affordable",
      desc: settings?.feature3Desc || "We provide cost-effective solutions without compromising on the security standards.",
    },
  ];

  const defaultOrder = [
    { component: "HeroSection", isVisible: true },
    { component: "TrustedBySection", isVisible: true },
    { component: "CctvSurveillanceSection", isVisible: true },
    { component: "WhyAimhopSection", isVisible: true },
    { component: "ServicesPreviewSection", isVisible: true },
    { component: "TestimonialsPreviewSection", isVisible: true },
    { component: "BlogsPreviewSection", isVisible: true },
    { component: "CtaSection", isVisible: true },
  ];

  let sectionsToRender = defaultOrder;

  if (layout && layout.sections && layout.sections.length > 0) {
    sectionsToRender = [...layout.sections].sort((a: any, b: any) => a.order - b.order);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SyncHandler interval={15000} />
      <Navbar />

      <main className="flex-grow">
        {sectionsToRender.filter((s: any) => s.isVisible).map((section: any, index: number) => {
          const Component = componentMap[section.component];
          
          if (!Component) return null;

          // Pass required props safely based on component
          return (
            <Component 
              key={`${section.component}-${index}`} 
              settings={settings}
              heroSubtitle={section.subtitle || heroSubtitle}
              heroImg={heroImg}
              banners={banners}
              features={features}
              services={services}
              testimonials={testimonials}
              blogs={blogs}
            />
          );
        })}
      </main>

      <Footer />
    </div>
  );
}

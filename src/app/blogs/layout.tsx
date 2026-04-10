import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Insights & News",
  description: "Stay updated with the latest security tips, industry news, and safety guides from AimHop Security experts.",
  alternates: {
    canonical: "/blogs",
  },
  keywords: ["Security Blog", "Safety Tips", "Crime Prevention", "Security Industry India"],
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

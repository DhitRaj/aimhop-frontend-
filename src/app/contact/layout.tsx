import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with AimHop Security Solutions for a free site audit and personalized security quote. Available 24/7 for your protection.",
  alternates: {
    canonical: "/contact",
  },
  keywords: ["Contact AimHop", "Security Quote", "Hire Security Guards", "Security Agency Near Me"],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

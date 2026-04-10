import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about AimHop Security Solutions Pvt. Ltd., our mission, vision, and the leadership behind India's most trusted security agency.",
  alternates: {
    canonical: "/about",
  },
  keywords: ["AimHop Mission", "Security Agency Leadership", "Company Profile", "Gorakhpur Security Agency"],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

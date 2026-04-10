import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Comprehensive security services including trained guards, electronic surveillance, bouncers, and facility management services across India.",
  alternates: {
    canonical: "/services",
  },
  keywords: ["Security Services", "CCTV Installation", "Commercial Security", "Residential Security", "Event Security India"],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

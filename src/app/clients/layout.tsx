import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Trusted Clients",
  description: "See the businesses and organizations that trust AimHop Security Solutions for their safety and protection needs across India.",
  alternates: {
    canonical: "/clients",
  },
  keywords: ["AimHop Clients", "Corporate Security Clients", "Government Security Projects", "Trust Indicators"],
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

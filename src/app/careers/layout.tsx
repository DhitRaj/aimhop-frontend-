import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Our Team",
  description: "Explore career opportunities at AimHop Security Solutions. Join India's fastest-growing security agency and protect the nation.",
  alternates: {
    canonical: "/careers",
  },
  keywords: ["Security Jobs", "Guard Recruitment", "Bouncer Jobs India", "AimHop Careers"],
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

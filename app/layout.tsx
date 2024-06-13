import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban task management web app",
  description:
    "Explore the power of efficient task management with our Kanban web application. Designed as a project for Frontend Mentor, this app helps developers and teams streamline their workflows using the Kanban methodology. Built with the robust combination of Next.js, React, TypeScript and Tailwind CSS, it offers an intuitive and responsive user experience. Developed by Olatoyan George, this project is perfect for testing new ideas and sharing feedback within the developer community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}

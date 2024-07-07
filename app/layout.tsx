import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BoardProvider } from "@/app/_context/BoardContext";
import { ThemeProvider } from "./_context/ThemeContext";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s / Kanban",
    default: "Kanban task management web app",
  },
  description:
    "Explore the power of efficient task management with our Kanban web application. Designed as a project for Frontend Mentor, this app helps developers and teams streamline their workflows using the Kanban methodology. Built with the robust combination of Next.js, React, TypeScript and Tailwind CSS, it offers an intuitive and responsive user experience. Developed by Olatoyan George, this project is perfect for testing new ideas and sharing feedback within the developer community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="custom-scrollbar text-[62.5%]">
      <body
        className={`${jakarta.className} flex min-h-[100dvh] overflow-x-hidden`}
      >
        <ThemeProvider>
          <BoardProvider>
            <main className="flex w-full justify-center">
              {children}

              <Analytics />
              <SpeedInsights />
            </main>
          </BoardProvider>
        </ThemeProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { fontSize: "1.6rem", padding: "1.4rem 2.4rem" },
          }}
        />
      </body>
    </html>
  );
}

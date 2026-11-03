import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/navigation/AppShell";

export const metadata: Metadata = {
  title: "InterviewX DataHub — Universal Document Intelligence & Dataset Platform",
  description: "Enterprise dataset management, annotation studio, and privacy-governed vault for InterviewX LLM development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./career.css";

export const metadata: Metadata = {
  title: "Career Hub",
  description: "A private workspace for job applications, recruiter conversations, and company research.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserProvider from "@/providers/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SASCA - Student",
  description: "SASCA (Sistem Absensi Sekolah Cerdas)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider splash={true} strict={false} hitOnce={true}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

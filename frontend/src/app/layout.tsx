import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserProvider from "@/providers/UserProvider";
import Script from "next/script";
import PopupContainer from "@/components/PopupContainer";
import BottomModal from "@/components/BottomModal";

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
      <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BRTBYJG5KN"
        />

        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BRTBYJG5KN');
          `}
        </Script>
      <body className={inter.className}>
        <UserProvider splash={false} strict={false} hitOnce={true}>
          {children}
          <BottomModal />
          <PopupContainer />
        </UserProvider>
      </body>
    </html>
  );
}

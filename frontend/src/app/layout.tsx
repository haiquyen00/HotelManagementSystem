import type { Metadata } from "next";
import { Rubik, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto", 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "Hệ thống quản lý khách sạn với Next.js và Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${rubik.variable} ${roboto.variable} antialiased font-roboto`}
      >
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}

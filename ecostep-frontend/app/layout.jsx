import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "EcoStep — Track Your Carbon Footprint",
  description:
    "Personal carbon footprint tracker. Log activities, see your impact, and get AI-powered sustainability tips.",
};

export default function RootLayout({ children }) {
  return (
  <html lang="en" className={inter.variable}>
      <body className="bg-[#f9fafb] text-gray-900 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

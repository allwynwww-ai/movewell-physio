import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileStickyBar from "@/components/MobileStickyBar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MoveWell Physiotherapy | Expert Care in Thane, Maharashtra",
    template: "%s | MoveWell Physiotherapy",
  },
  description:
    "Expert physiotherapy in Thane, Maharashtra. Personalised treatment for back pain, sports injuries, post-surgical rehab and more. Book your appointment online today.",
  keywords: [
    "physiotherapy Thane",
    "physio Thane Maharashtra",
    "back pain treatment",
    "sports injury rehab",
    "post surgical physiotherapy",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('movewell-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileStickyBar />
      </body>
    </html>
  );
}

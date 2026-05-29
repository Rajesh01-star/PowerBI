import type { Metadata } from "next";
import { Inter, Outfit, Geist, EB_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const garamond = EB_Garamond({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Gengraphs & Graphics | Premium Power BI & Graphic Design Services",
  description: "High-end corporate Power BI templates, interactive executive dashboards, and professional graphic and UI/UX design solutions.",
};

import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full dark", "antialiased", inter.variable, geist.variable, outfit.variable, garamond.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col text-foreground font-sans overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>
          <Providers>
            <Navbar />
            <div className="flex-grow flex flex-col">{children}</div>
            <Footer />
            <Toaster richColors closeButton position="top-right" theme="dark" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

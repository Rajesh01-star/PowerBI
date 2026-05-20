import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Lumina - Premium Power BI Templates",
  description: "High-end marketplace for Power BI Templates.",
};

import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", inter.variable, geist.variable, outfit.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

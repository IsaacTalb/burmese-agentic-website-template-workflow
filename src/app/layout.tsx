import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { getBusinessSettings, getThemeSettings } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();
  return {
    title: business.name,
    description: business.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getThemeSettings();

  return (
    <ClerkProvider>
      <html lang="my" className={`${inter.variable} ${playfair.variable}`}>
        <head>
          <style>{`
            :root {
              --brand-primary: ${theme.colors.primary};
              --brand-secondary: ${theme.colors.secondary};
              --brand-accent: ${theme.colors.accent};
              --brand-bg: ${theme.colors.bg};
              --brand-text: ${theme.colors.text};
            }
          `}</style>
        </head>
        <body className="bg-brand-bg text-brand-text font-body antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

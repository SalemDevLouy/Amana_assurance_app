import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import Provider from "./providers/SessionProvider";
import Navbar from "./components/UI/Navbar";
import BackgroundEffect from "./components/UI/Backgroundeffect";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Amana - Build Your Business in Algeria",
  description: "Amana est une plateforme numérique intelligente conçue pour aider les jeunes, étudiants, et porteurs d&apos;idées en Algérie à transformer leurs idées en projets concrets et bien structurés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" className="bg-background text-foreground">
        <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased z-10 `}
        >
          <BackgroundEffect/>
          <HeroUIProvider>
            <Navbar />
            <main>
          {children}
            </main>
           </HeroUIProvider>
        </body>
        </Provider>
      </html>
  );
}

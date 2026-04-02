import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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
  description: "Amana est une plateforme numérique intelligente de gestion d&apos;assurance conçue pour les agriculteurs et automobilistes en Algérie. Gérez facilement vos garanties d&apos;assurance automobile et agricole avec des solutions adaptées à vos besoins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="bg-background text-foreground">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased z-10 `}
        >
          <Provider>
              <BackgroundEffect  />
              <Navbar />
              <main >{children}</main>
          </Provider>
        </body>
      </html>
  );
}

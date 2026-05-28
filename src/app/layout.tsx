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
  title: "Amaneka – AI-Powered Auto Insurance Platform",
  description: "Amaneka is a next-generation digital insurance platform for automobile coverage and accident claim management in Algeria. Subscribe, declare accidents, and track repairs — all from one place.",
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

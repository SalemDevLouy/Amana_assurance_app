import type { Metadata } from "next";
import Sidebar from "../components/dashboard/Sidebar";
import Wrapper from "../components/UI/Wrapper";
// import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Amana - Build Your Business in Algeria",
  description: "Amana: AI-powered platform to create Business Model Canvases and Business Plans for Algerian entrepreneurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="max-w-screen flex flex-col min-h-screen max-h-screen bg-[#06060f]">
          <div className="flex flex-col-reverse md:flex-row h-[100vh] max-w-screen">
             <Sidebar />
             <Wrapper>
              <div className="pt-14 md:pt-0">
                {children}
              </div>
             </Wrapper>
        </div>  
      </main>
  );
}

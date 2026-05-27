import type { Metadata } from "next";
import Sidebar from "../components/dashboard/Sidebar";
import Wrapper from "../components/UI/Wrapper";
// import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Amaneka Admin – Insurance Management Dashboard",
  description: "Amaneka admin panel for managing customers, insurance contracts, claims, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="max-w-screen flex flex-col min-h-screen max-h-screen bg-transparent">
          <div className="flex flex-col-reverse md:flex-row h-[100vh] max-w-screen z-20">
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

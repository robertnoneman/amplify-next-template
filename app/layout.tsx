import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./app.css";
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import CountdownToMonday from './ui/CountdownToMonday';
import dynamic from 'next/dynamic'
import { Header } from "@/app/ui/header";


// const inter = Inter({ subsets: ["latin"] });
const NoSSR = dynamic(() => import('./ui/CountdownToMonday'), { ssr: false })

export const metadata: Metadata = {
  title: "It's Rob Day",
  description: "Happy Rob Day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* <Header /> */}
        {children}
      {/* <footer className="">
        <div className="bg-[#bb4444]">
            <NoSSR />
        </div>
      </footer> */}

      </body>
    </html>
  );
}

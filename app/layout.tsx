import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./app.css";
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import CountdownToMonday from './ui/CountdownToMonday';

// const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>{children}</body>
      <footer className="">
        <div className="bg-[#bb4444]">
            <CountdownToMonday />
        </div>
      </footer>
    </html>
  );
}

import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import Nav from "./components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadyPOS",
  description: "POS by Ready Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex">
        <Nav />
        <div className="flex w-full">
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

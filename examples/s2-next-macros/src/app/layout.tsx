import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Spectrum's Spectrum 2 Next Example App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Buscador de abrigados em Canoas",
  description: "Encontre pessoas abrigadas em Canoas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = `bg-gray-200 ${roboto.className}`;

  return (
    <html lang="en">
      <body className={className}>{children}</body>
    </html>
  );
}

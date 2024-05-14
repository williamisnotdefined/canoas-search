import cls from "classnames";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Image from "next/image";
import React from "react";

import AllProviders from "@/components/AllProviders";
import MenuMobile from "@/components/MenuMobile";
import SideMenu from "@/components/SideMenu";

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
  const className = cls("", {
    [roboto.className]: true,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={className}>
        <AllProviders>
          <MenuMobile />
          <SideMenu />
          <div className="sm:pl-28 px-8 max-w-[1000px] m-auto">
            <h1 className="mt-6 mb-6 flex items-center gap-4 text-center text-3xl font-semibold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              <Image
                alt="tosalvocanoas"
                src="/logo.png"
                width={100}
                height={100}
                className="rounded-full"
              />
              Buscador de Abrigados em Canoas
            </h1>
            {children}
          </div>
        </AllProviders>
      </body>
    </html>
  );
}

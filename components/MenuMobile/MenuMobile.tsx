"use client";

import { PanelLeft, Home, HelpCircle, HelpingHandIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Instagram } from "@/components/Icons";
import ToSalvoAnchor from "@/components/ToSalvoAnchor";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const MenuMobile: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("josyaninail@hotmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 sm:hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Image
                alt="tosalvocanoas"
                src="/logo.png"
                width={100}
                height={100}
                className="rounded-full"
              />
              <Link
                href="/"
                className="transition-colors flex items-center gap-4 px-2.5 text-foreground text-sm hover:text-primary"
              >
                <Home className="h-5 w-5" />
                Página inicial
                <span className="sr-only">Página inicial</span>
              </Link>
              <a
                href="https://www.instagram.com/tosalvocanoas/"
                target="_blank"
                className="transition-colors flex items-center gap-4 px-2.5 text-foreground text-sm hover:text-primary"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110" />
                @tosalvocanoas
                <span className="sr-only">@tosalvocanoas</span>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer transition-colors flex items-center gap-4 px-2.5 text-foreground text-sm hover:text-primary">
                    <HelpingHandIcon className="h-5 w-5" />
                    Contribua com uma doação
                    <span className="sr-only">Contribua com uma doação</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm" side="bottom">
                  <p className="">
                    Colabore doando para a <ToSalvoAnchor /> através do pix:
                    <span className="ml-1 font-semibold">
                      josyaninail@hotmail.com
                    </span>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    onClick={handleCopy}
                  >
                    {copied ? "Copiado!" : "Copiar chave pix"}
                  </Button>
                </PopoverContent>
              </Popover>
              <a
                href="https://www.instagram.com/encontrados.canoas/"
                target="_blank"
                className="transition-colors flex items-center gap-4 px-2.5 text-foreground text-sm hover:text-primary"
              >
                <HelpCircle className="h-5 w-5 group-hover:scale-110" />
                Suporte ao site, dúvidas, sugestões, etc.
                <span className="sr-only">
                  Instagram de suporte ao site, dúvidas, sugestões
                </span>
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4 m-auto">
          <Image
            alt="tosalvocanoas"
            src="/logo.png"
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className="text-lg font-medium flex-1 grow-1 text-center">
            Tô Salvo Canoas
          </p>
        </div>
      </header>
    </div>
  );
};

export default MenuMobile;

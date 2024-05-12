"use client";

import { Home, HelpCircle, HelpingHandIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Instagram } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import ToSalvoAnchor from "@/components/ToSalvoAnchor";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SideMenu: React.FC = () => {
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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Home className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Página inicial</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://www.instagram.com/tosalvocanoas/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              target="_blank"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">@tosalvocanoas</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">@tosalvocanoas</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
              <HelpingHandIcon className="h-5 w-5" />
              <span className="sr-only">Contribua com uma doação</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm" side="right">
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
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-2 px-2 sm:py-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Instagram de suporte</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm" side="right">
            Para obter suporte ou tirar dúvidas sobre este site, entre em
            contato pelo Instagram{" "}
            <a
              className="underline"
              target="_blank"
              href="https://instagram.com/encontrados.canoas"
            >
              @encontrados.canoas
            </a>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
      </nav>
    </aside>
  );
};

export default SideMenu;

"use client";

import React from "react";

import { ThemeProvider } from "@/components/AllProviders/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AllProvidersProps {
  children: React.ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TooltipProvider>
  );
};

export default AllProviders;

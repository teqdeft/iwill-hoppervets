"use client";

import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import Image from "next/image";

export function RetailHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary-100">
      <div className="container-main flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
        <div className="flex items-center min-w-0 gap-2 sm:gap-4">
          <div className="flex items-center">
            <Image
              src="/images/IWTIW_Banner_logo.png"
              alt="iWILL 'til I'm Well — Medical & Mental Healthcare"
              height={44}
              width={139}
              className="h-8 sm:h-10 lg:h-11 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center ml-1 sm:ml-4 border-l border-primary-200 pl-2 sm:pl-4">
            <span className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1.5 sm:px-3 sm:py-2">
              <Image
                src="/images/hoppervets-logo.png"
                alt="HopperVets — Veterinary Relief Service"
                height={40}
                width={150}
                className="h-6 sm:h-8 lg:h-9 w-auto object-contain"
              />
            </span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-2 shrink-0">
          <a href="#features" className="text-sm font-medium text-primary hover:text-primary-800 transition-colors">
            What's Included
          </a>
          <a href="#pricing" className="text-sm font-medium text-primary hover:text-primary-800 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-sm font-medium text-primary hover:text-primary-800 transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button variant="accent" className="w-auto px-3 sm:px-4" onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}>
            <Tag className="w-4 h-4" aria-hidden="true" />
            Claim Rate
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Locale } from "@/i18n";
import { Dict } from "@/constans/types";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  locale: Locale;
  dict: Dict;
}

const MobileMenu = ({ dict, locale }: MobileMenuProps) => {
  const pathname = usePathname();

  const router = useRouter();

  const navItems = [
    { label: dict.nav.home, href: "" },
    { label: dict.nav.videos, href: "videos" },
    { label: dict.nav.archive, href: "archive" },
    { label: dict.nav.tags, href: "tags" },
    { label: dict.nav.about, href: "about" },
  ];

  const buildHref = (path: string) => `/${locale}${path ? `/${path}` : ""}`;

  const isActive = (itemHref: string) => {
    const full = buildHref(itemHref);
    if (!pathname) return false;
    if (full === `/${locale}`) return pathname === full;
    return pathname.startsWith(full);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="px-4">
        <SheetHeader>
          <SheetTitle>Logo</SheetTitle>
        </SheetHeader>

        {navItems.map((item, idx) => {
          const href = buildHref(item.href);
          const active = isActive(item.href);

          return (
            <Link
              href={href}
              key={item.href || idx}
              className={[
                "rounded-xl px-3 py-1.5 font-medium transition-colors",
                active ? "bg-mycolor2 text-mycolor1" : "text-mycolor2 ",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

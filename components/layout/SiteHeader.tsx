"use client";

import { Locale } from "@/i18n";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileMenu from "./MobileMenu";
import { Dict } from "@/constans/types";
import { useAuth } from "../providers/auth-context-provider";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dict;
}
const SiteHeader = ({ locale, dict }: SiteHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // const isAuthenticated = !!user && !!user.id; // useAuth already provides this

  const navItems = [
    { label: dict.nav.home, href: "" },
    { label: dict.nav.videos, href: "videos" },
    { label: dict.nav.archive, href: "archive" },
    { label: dict.nav.tags, href: "tags" },
    { label: dict.nav.about, href: "about" },
    // Removed Dashboard/Login from nav items to move to action area
  ];
  const buildHref = (path: string) => `/${locale}${path ? `/${path}` : ""}`;

  const isActive = (itemHref: string) => {
    const full = buildHref(itemHref);
    if (!pathname) return false;
    if (full === `/${locale}`) return pathname === full;
    return pathname.startsWith(full);
  };

  const switchLocalePath = (targetLocale: Locale) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/");
    if (segments.length > 1) segments[1] = targetLocale;
    return segments.join("/") || `/${targetLocale}`;
  };

  const handleLocaleChange = (value: string) => {
    const target = value as Locale;
    router.push(switchLocalePath(target));
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
      sticky top-0 z-50 
      backdrop-blur-xl border-b transition-all duration-300
      ${scrolled
          ? "bg-background/80 border-border/50 shadow-lg py-3"
          : "bg-background/40 border-transparent py-5"
        }
    `}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div>
          <Link href={buildHref("")} className="text-xl font-bold tracking-tighter hover:text-primary transition-all flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xs shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              KM
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {dict.site.title}
            </span>
          </Link>
        </div>

        <nav className="lg:flex hidden items-center gap-1">
          {navItems.map((item, idx) => {
            const href = buildHref(item.href);
            const active = isActive(item.href);

            return (
              <Link
                href={href}
                key={item.href || idx}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 p-1 bg-muted/50 rounded-full border border-border/50">
            <ThemeSwitcher />
            <div className="w-px h-4 bg-border/50" />
            <ModeToggle />
          </div>

          <Select defaultValue={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[70px] h-9 rounded-full border-border/50 bg-background/50 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="tr">TR</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="h-8 w-px bg-border/50 hidden md:block" />

          {user ? (
            <UserProfileDropdown />
          ) : (
            <Button
              size="sm"
              className="gap-2 hidden md:flex rounded-full px-5"
              asChild
            >
              <Link href={buildHref("login")}>
                <LogIn className="w-4 h-4" />
                {dict.nav?.login || "Giriş Yap"}
              </Link>
            </Button>
          )}

          <div className="flex lg:hidden">
            <MobileMenu dict={dict} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

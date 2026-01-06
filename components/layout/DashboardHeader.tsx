"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-context-provider";
import { Menu, X, BookOpen, LayoutDashboard, Settings, Layers, GraduationCap, Video, FileText } from "lucide-react";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useParams, usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale || "tr";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Kategoriler", icon: Layers },
    { href: "/admin/subjects", label: "Kazanımlar", icon: GraduationCap },
    { href: "/admin/lessons", label: "Dersler", icon: Video },
    { href: "/admin/materials", label: "Materyaller", icon: FileText },
    { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  ];

  const buildHref = (path: string) => `/${locale}${path}`;
  const isActive = (href: string) => pathname?.includes(href);

  return (
    <header
      className={`
      sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-xl
      ${
        scrolled
          ? "bg-background/80 border-border/50 py-3 shadow-lg"
          : "bg-background/40 border-transparent py-5"
      }
    `}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            KM
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-black tracking-tighter block leading-none">KOVANCILAR</span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Yönetim</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const href = buildHref(link.href);
            const active = isActive(link.href);
            return (
              <Link
                href={href}
                key={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                  active 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 p-1 bg-muted/50 rounded-full border border-border/50">
            <ThemeSwitcher />
            <div className="w-px h-4 bg-border/50" />
            <ModeToggle />
          </div>

          <div className="h-8 w-px bg-border/50 hidden md:block" />

          <UserProfileDropdown />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[calc(100%+1px)] p-4 bg-background border-b shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={buildHref(link.href)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl font-bold transition-all",
                  isActive(link.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}


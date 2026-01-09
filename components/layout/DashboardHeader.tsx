"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-context-provider";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Layers,
  GraduationCap,
  Video,
  FileText,
  Target,
  BookOpen,
} from "lucide-react";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useParams, usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  const menuGroups = [
    {
      label: "Kurs Ayarları",
      icon: GraduationCap,
      items: [
        { href: "/admin/categories", label: "Kategoriler", icon: Layers },
        { href: "/admin/subjects", label: "Konular", icon: GraduationCap },
        { href: "/admin/learning-objectives", label: "Kazanımlar", icon: Target },
        { href: "/admin/lessons", label: "Dersler", icon: Video },
        { href: "/admin/materials", label: "Materyaller", icon: FileText },
      ],
    },
    {
      label: "Soru Havuzu Ayarları",
      icon: BookOpen,
      items: [
        { href: "/admin/questions", label: "Soru Bankası", icon: BookOpen },
        { href: "/admin/tests", label: "Testler", icon: Layers },
      ],
    },
    {
      label: "Sistem Ayarları",
      icon: Settings,
      items: [
        { href: "/admin/users", label: "Kullanıcı Ayarları", icon: GraduationCap }, // or Users icon if available
        { href: "/admin/settings", label: "Ayarlar", icon: Settings },
      ],
    },
  ];

  const buildHref = (path: string) => `/${locale}${path}`;
  const isActive = (href: string) => pathname?.includes(href);
  const isGroupActive = (items: typeof menuGroups[0]["items"]) =>
    items.some((item) => isActive(item.href));

  return (
    <header
      className={`
      sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-xl
      ${scrolled
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
            <span className="text-lg font-black tracking-tighter block leading-none">
              KOVANCILAR
            </span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
              Yönetim
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-2">
          {/* Dashboard Link */}
          <Link
            href={buildHref("/admin/dashboard")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
              isActive("/admin/dashboard")
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Dropdown Menus */}
          {menuGroups.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                    isGroupActive(group.items)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <group.icon className="w-4 h-4" />
                  {group.label}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-2xl border-border/50 shadow-xl"
              >
                <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-muted-foreground px-3">
                  {group.label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.items.map((item) => (
                  <Link key={item.href} href={buildHref(item.href)}>
                    <DropdownMenuItem
                      className={cn(
                        "cursor-pointer rounded-xl mx-1 my-0.5 font-semibold",
                        isActive(item.href) && "bg-primary/10 text-primary"
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
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
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[calc(100%+1px)] p-4 bg-background border-b shadow-2xl animate-in slide-in-from-top-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {/* Dashboard */}
            <Link
              href={buildHref("/admin/dashboard")}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl font-bold transition-all",
                isActive("/admin/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            {/* Collapsible Groups */}
            {menuGroups.map((group) => (
              <Collapsible key={group.label}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-2xl font-bold hover:bg-muted transition-all">
                  <div className="flex items-center gap-3">
                    <group.icon className="w-5 h-5" />
                    {group.label}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 pt-2 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={buildHref(item.href)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl font-semibold transition-all",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

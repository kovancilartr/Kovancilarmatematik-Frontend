"use client";

import { Dict } from "@/constans/types";
import { Locale } from "@/i18n";
import { Facebook, Github, LucideIcon, Rss } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SiteFooterProps {
  locale: Locale;
  dict: Dict;
  //   recentPosts: {
  //     id: string;
  //     title: string;
  //     slug: string;
  //     dateLabel: string;
  //     coverUrl?: string | null;
  //   }[];
}

const socialIcons: { icon: LucideIcon; href: string; label: string }[] = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Rss, href: "#", label: "RSS" },
];

const SiteFooter = ({ dict, locale }: SiteFooterProps) => {
  const pathname = usePathname();
  const buildHref = (path: string) =>
    path === "admin" ? "/admin" : `/${locale}${path ? `/${path}` : ""}`;

  const pagesLinks = [
    { label: dict.footer.pages.about, href: "about" },
    { label: dict.footer.pages.contact, href: "contact" },
    { label: dict.footer.pages.admin, href: "admin" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-card text-card-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Link href={buildHref("")} className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm">KM</div>
              {dict.site.title}
            </Link>
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              {dict.site.description}
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2" />

          <div className="grid grid-cols-2 gap-8 lg:col-span-6">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                Hızlı Erişim
              </h3>
              <ul className="space-y-4">
                {[{ label: dict.nav.home, href: "" }, { label: dict.nav.videos, href: "videos" }, { label: dict.nav.archive, href: "archive" }].map((item, idx) => (
                  <li key={idx}>
                    <Link href={buildHref(item.href)} className="text-muted-foreground hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                {dict.footer.pagesTitle}
              </h3>
              <ul className="space-y-4">
                {pagesLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link href={buildHref(item.href)} className="text-muted-foreground hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>
            {year} © <span className="font-bold text-foreground">{dict.site.title}</span>.{" "}
            {dict.footer.copyrightPrefix}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-primary">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-primary">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default SiteFooter;

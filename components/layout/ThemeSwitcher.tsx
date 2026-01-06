"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    name: "Varsayılan",
    id: "default",
    colors: ["#fbbf24", "#0f172a", "#ef4444"],
  },
  {
    name: "Gece Yarısı",
    id: "midnight",
    colors: ["#a855f7", "#312e81", "#22d3ee"],
  },
  { name: "Orman", id: "forest", colors: ["#166534", "#14532d", "#eab308"] },
  { name: "Gül", id: "rose", colors: ["#e11d48", "#1e293b", "#fda4af"] },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app-theme") || "default";
    }
    return "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (currentTheme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", currentTheme);
    }
    localStorage.setItem("app-theme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Tema Değiştir</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center justify-between"
          >
            <span>{theme.name}</span>
            <div className="flex gap-1">
              {theme.colors.map((c, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

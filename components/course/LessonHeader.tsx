// components/course/LessonHeader.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  ChevronRight,
  Home,
  Layout,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lesson } from "@/lib/api";

interface LessonHeaderProps {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

export function LessonHeader({
  courseId,
  courseTitle,
  lessonTitle,
  isSidebarOpen,
  onToggleSidebar,
  previousLesson,
  nextLesson,
}: LessonHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-20 items-center justify-between gap-4 bg-background/80 px-4 md:px-8 shadow-sm backdrop-blur-xl transition-all duration-300 border-b border-border/50",
        isSidebarOpen ? "lg:ml-80" : ""
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="h-8 w-px bg-border/50 hidden md:block" />

        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/courses/${courseId}`}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors font-bold text-muted-foreground hover:text-foreground"
          >
            <Layout className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{courseTitle}</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block" />
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 leading-none">
            <span className="text-[10px] md:hidden text-muted-foreground uppercase font-black tracking-widest mb-1">
              Şu an izleniyor
            </span>
            <span className="font-black text-foreground text-sm md:text-base tracking-tight">
              {lessonTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="items-center gap-2 pr-2 border-r border-border/50 hidden sm:flex">
          {previousLesson && (
            <Link
              href={`/courses/${courseId}/lessons/${previousLesson.id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "rounded-full h-10 px-4 font-bold"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/courses/${courseId}/lessons/${nextLesson.id}`}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-full h-10 px-6 font-bold shadow-lg shadow-primary/20"
              )}
            >
              Sıradaki
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "rounded-full h-10 w-10"
          )}
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

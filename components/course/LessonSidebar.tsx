// components/course/LessonSidebar.tsx
"use client";

import Link from "next/link";
import { X, PlayCircle, CheckCircle2, ListFilter, GraduationCap } from "lucide-react";
import { CourseData } from "@/hooks/api/use-course-data";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface LessonSidebarProps {
  course: CourseData;
  currentLessonId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonSidebar({
  course,
  currentLessonId,
  isOpen,
  onClose,
}: LessonSidebarProps) {
  const defaultAccordionValue = `item-${course.subjects.findIndex((subject) =>
    subject.lessons.some((lesson) => lesson.id === currentLessonId)
  )}`;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-card border-r z-50 transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b bg-muted/30">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5 px-3 py-0.5 font-bold">
                Eğitim İçeriği
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-black tracking-tight leading-tight mb-2 group flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="truncate">{course.name}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
              <ListFilter className="w-3 h-3" />
              <span>{course.subjects.length} Bölüm • 12+ Saat</span>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <Accordion
              type="single"
              collapsible
              defaultValue={defaultAccordionValue}
              className="w-full space-y-3"
            >
              {course.subjects.map((subject, index) => (
                <AccordionItem 
                  value={`item-${index}`} 
                  key={subject.id} 
                  className="border border-border/50 rounded-2xl overflow-hidden bg-background/50 data-[state=open]:bg-card data-[state=open]:border-primary/20 transition-all duration-300"
                >
                  <AccordionTrigger className="text-md font-bold hover:no-underline px-4 py-4 group">
                      <div className="flex items-center gap-3 w-full text-left">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors shrink-0">
                              {index + 1}
                          </div>
                          <span className="text-sm truncate font-black group-hover:text-primary transition-colors">
                              {subject.name}
                          </span>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-3">
                    <ul className="space-y-1">
                      {subject.lessons.map((lesson, lIdx) => {
                        const isCurrent = lesson.id === currentLessonId;
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/courses/${course.id}/lessons/${lesson.id}`}
                              className={cn(
                                "flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm transition-all group/item relative",
                                isCurrent
                                  ? "bg-primary/10 text-primary font-black shadow-inner"
                                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                              )}
                            >
                                {isCurrent ? (
                                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                                ) : null}
                                <div className={cn(
                                  "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors",
                                  isCurrent ? "bg-primary text-primary-foreground" : "bg-muted group-hover/item:bg-background"
                                )}>
                                  {isCurrent ? <PlayCircle className="h-3.5 w-3.5" /> : <span className="text-[10px]">{lIdx + 1}</span>}
                                </div>
                                <span className="truncate flex-1">{lesson.name}</span>
                                <CheckCircle2 className={cn(
                                  "h-4 w-4 shrink-0 transition-opacity",
                                  isCurrent ? "opacity-100" : "opacity-20 group-hover/item:opacity-50"
                                )} />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-muted/20">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">İlerlemen</span>
                 <span className="text-xs font-black text-primary">45%</span>
               </div>
               <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[45%] rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


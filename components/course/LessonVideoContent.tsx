// components/course/LessonVideoContent.tsx
"use client";

import { Lesson } from "@/lib/api";
import { LessonVideoPlayer } from "./LessonVideoPlayer";
import { Badge } from "../ui/badge";
import { Clock, Download, FileText, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LessonVideoContentProps {
  lesson: Lesson;
}

export function LessonVideoContent({ lesson }: LessonVideoContentProps) {
  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-6 md:py-10 mx-auto">
      {/* Video Section - Controlled Max Width for better UX */}
      <div className="w-full max-w-5xl mx-auto mb-8 md:mb-12">
        <div className="relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl border border-border/40 bg-black transition-all duration-500">
          <LessonVideoPlayer videoUrl={lesson.videoUrl} />
        </div>
      </div>

      {/* Content Section - Aligned with Video width */}
      <div className="w-full mx-auto justify-center max-w-7xl">
        <div className="">
          {" "}
          {/* Narrower text area for readability */}
          <div className="space-y-6">
            <div className="space-y-4 flex flex-col items-center">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none font-black rounded-full px-4 text-[10px] uppercase tracking-wider"
                >
                  Matematik & Geometri
                </Badge>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  <span>15 Dakika</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {lesson.name}
              </h1>
            </div>

            <Tabs defaultValue="overview" className="w-full pt-6">
              <TabsList className="w-full justify-center bg-transparent border-b border-border/50 rounded-none h-auto p-0 gap-8">
                <TabsTrigger
                  value="overview"
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-0 data-[state=active]:text-primary rounded-none font-bold text-sm px-0 pb-4 transition-all focus-visible:ring-0"
                >
                  Genel Bakış
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-0 data-[state=active]:text-primary rounded-none font-bold text-sm px-0 pb-4 transition-all focus-visible:ring-0"
                >
                  Kaynaklar
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="bg-transparent border-b-2 border-transparent data-[state=active]:border-0 data-[state=active]:text-primary rounded-none font-bold text-sm px-0 pb-4 transition-all focus-visible:ring-0"
                >
                  Notlarım
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="pt-10 space-y-8 focus-visible:outline-none"
              >
                <div className="flex gap-6 p-8 rounded-[2rem] bg-muted/20 border border-border/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Info className="w-7 h-7" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <h3 className="text-xl font-bold tracking-tight">
                      Ders Hakkında
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      Bu derste{" "}
                      <span className="text-foreground font-black">
                        {lesson.name}
                      </span>{" "}
                      konusunun temel mantığını, pratik çözüm yollarını ve sınav
                      taktiklerini öğreneceğiz.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2rem] border border-border/40 bg-card/30">
                    <h4 className="font-black text-xs mb-6 uppercase tracking-widest text-primary/70">
                      Kazanımlar
                    </h4>
                    <ul className="space-y-4">
                      {[
                        "Konunun mantığını kavrama",
                        "Yeni nesil soru çözümü",
                        "Zaman kazandıran teknikler",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm font-medium text-foreground/80"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 rounded-[2rem] border border-border/40 bg-card/30">
                    <h4 className="font-black text-xs mb-6 uppercase tracking-widest text-primary/70">
                      Hazırlık
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Dersten tam verim almak için yanınızda kağıt kalem
                      bulundurun ve önemli yerleri not alın. PDF dokümanlarını
                      indirmeyi unutmayın.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="resources"
                className="pt-10 focus-visible:outline-none"
              >
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Konu Anlatım PDF", size: "2.4 MB" },
                    { name: "Soru Bankası Ek Çözümler", size: "1.8 MB" },
                    { name: "Haftalık Çalışma Planı", size: "3.1 MB" },
                  ].map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-base font-bold tracking-tight">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                            {file.size} • PDF
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 rounded-full hover:bg-primary/10 hover:text-primary border border-border/40 transition-all"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="notes"
                className="pt-10 focus-visible:outline-none"
              >
                <div className="p-20 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40">
                  <p className="text-muted-foreground font-bold mb-8 max-w-xs mx-auto">
                    Henüz bu ders için bir not kaydetmemişsin.
                  </p>
                  <Button
                    variant="default"
                    className="rounded-full font-black px-12 h-14 shadow-xl shadow-primary/20 text-base"
                  >
                    Not Ekle
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

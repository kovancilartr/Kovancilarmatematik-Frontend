// app/[locale]/(public)/courses/[categoryId]/page.tsx
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCourseData } from "@/hooks/api/use-course-data";
import {
  AlertCircle,
  PlayCircle,
  Lock,
  BookOpen,
  Clock,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Star,
  Users,
  Video,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GlobalLoading from "@/components/layout/GlobalLoading";
import Image from "next/image";

export default function CourseOverviewPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: course, isLoading, isError, error } = useCourseData(categoryId);

  const { firstLesson, totalSubjects, totalLessons } = useMemo(() => {
    if (!course) {
      return { firstLesson: null, totalSubjects: 0, totalLessons: 0 };
    }
    const firstLesson = course.subjects?.[0]?.lessons?.[0];
    const totalSubjects = course.subjects?.length || 0;
    const totalLessons =
      course.subjects?.reduce(
        (acc, subject) => acc + subject.lessons.length,
        0
      ) || 0;
    return { firstLesson, totalSubjects, totalLessons };
  }, [course]);

  if (isLoading) return <GlobalLoading />;

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Kurs yüklenemedi</h2>
        <p className="text-muted-foreground max-w-xs">{error.message}</p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-8 rounded-full px-8"
          )}
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-muted/30 pt-12 pb-24 lg:pt-20 lg:pb-32 border-b">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-8">
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold"
                >
                  Matematik & Geometri
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-1 rounded-full border-primary/20 text-foreground/70 flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-primary text-primary" /> 4.9
                  (1.2k Yorum)
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                  {course.name}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Temelden zirveye, sınav odaklı ve yeni nesil soru
                  teknikleriyle harmanlanmış kapsamlı eğitim seti. Bu kursla{" "}
                  {course.name} artık senin için bir sorun olmaktan çıkacak.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      {totalSubjects} Bölüm
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Konu Başlığı
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      {totalLessons} Video
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ders İçeriği
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">3.4k+</div>
                    <div className="text-xs text-muted-foreground">
                      Öğrenci Kayıtlı
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Preview Card (Sticky/Floating) */}
            <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24">
              <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 group">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`https://placehold.co/600x400/0f172a/f8fafc?text=${encodeURIComponent(
                      course.name
                    )}`}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">
                      Ücretsiz
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      ₺1.200
                    </span>
                  </div>

                  {firstLesson ? (
                    <Link
                      href={`/courses/${categoryId}/lessons/${firstLesson.id}`}
                      className="block"
                    >
                      <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 group">
                        Eğitime Şimdi Başla
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full h-14 rounded-2xl text-lg font-bold"
                    >
                      Yakında Yayında
                    </Button>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-green-500" /> Ömür
                      Boyu Erişim
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Clock className="w-5 h-5 text-blue-500" /> Mobil & TV
                      Erişimi
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Trophy className="w-5 h-5 text-yellow-500" /> Başarı
                      Sertifikası
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 mt-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black tracking-tight">
              Eğitim Müfredatı
            </h2>
            <div className="h-px bg-border grow" />
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            {course.subjects.map((subject, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={subject.id}
                className="border border-border/60 rounded-[2rem] bg-card overflow-hidden transition-all duration-300 data-[state=open]:shadow-xl data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-lg font-bold px-8 py-7 hover:no-underline group">
                  <div className="flex items-center gap-6 w-full text-left">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xl font-black text-muted-foreground group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="group-hover:text-primary transition-colors">
                        {subject.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-1">
                        {subject.lessons.length} Ders •{" "}
                        {index === 0 ? "Giriş" : "İleri Seviye"}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="bg-muted/30 rounded-[1.5rem] p-4">
                    <ul className="space-y-2">
                      {subject.lessons.length > 0 ? (
                        subject.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id}>
                            <Link
                              href={`/courses/${categoryId}/lessons/${lesson.id}`}
                              className="group flex items-center justify-between p-4 rounded-xl hover:bg-background transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:text-primary border border-transparent group-hover:border-primary/20 transition-all">
                                  {lessonIndex + 1}
                                </div>
                                <span className="font-semibold group-hover:text-primary transition-colors">
                                  {lesson.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground">
                                  15:00
                                </span>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                  <PlayCircle className="w-5 h-5" />
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="flex flex-col items-center py-12 text-muted-foreground italic">
                          <Lock className="h-10 w-10 mb-4 opacity-20" />
                          <span>Bu bölüme ait ders henüz eklenmedi.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

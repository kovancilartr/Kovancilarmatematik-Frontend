// app/[locale]/(public)/courses/[categoryId]/lessons/[lessonId]/page.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourseData } from "@/hooks/api/use-course-data";
import { LessonSidebar } from "@/components/course/LessonSidebar";
import { LessonHeader } from "@/components/course/LessonHeader";
import { LessonVideoContent } from "@/components/course/LessonVideoContent";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GlobalLoading from "@/components/layout/GlobalLoading";

export default function LessonPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { categoryId, lessonId } = useParams<{
    categoryId: string;
    lessonId: string;
  }>();

  // Fetch all data for the course
  const { data: course, isLoading, isError, error } = useCourseData(categoryId);

  // Memoize navigation and lesson data to prevent re-calculations on every render
  const { currentLesson, nextLesson, previousLesson, allLessons } =
    useMemo(() => {
      if (!course) {
        return {
          currentLesson: null,
          nextLesson: null,
          previousLesson: null,
          allLessons: [],
        };
      }

      const allLessons = course.subjects.flatMap((subject) => subject.lessons);
      const currentLessonIndex = allLessons.findIndex(
        (lesson) => lesson.id === lessonId
      );

      if (currentLessonIndex === -1) {
        return {
          currentLesson: null,
          nextLesson: null,
          previousLesson: null,
          allLessons: [],
        };
      }

      const currentLesson = allLessons[currentLessonIndex];
      const nextLesson =
        currentLessonIndex < allLessons.length - 1
          ? allLessons[currentLessonIndex + 1]
          : null;
      const previousLesson =
        currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

      return { currentLesson, nextLesson, previousLesson, allLessons };
    }, [course, lessonId]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Handle loading state
  if (isLoading) {
    return <GlobalLoading />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <AlertCircle className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ders Yüklenemedi</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button asChild>
            <Link href={`/courses/${categoryId}`}>Kursa Geri Dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle case where course or lesson is not found after loading
  if (!course || !currentLesson) {
    // This could happen if the lessonId is invalid. Redirect to the course page.
    // Using a timeout to prevent potential loops if the course page also has issues
    setTimeout(() => router.push(`/courses/${categoryId}`), 0);
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Ders bulunamadı, yönlendiriliyorsunuz...</p>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LessonSidebar
        course={course}
        currentLessonId={lessonId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <LessonHeader
        courseId={categoryId}
        courseTitle={course.name}
        lessonTitle={currentLesson.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />

      <main
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:ml-80" : ""
        )}
      >
        <LessonVideoContent lesson={currentLesson} />
      </main>
    </div>
  );
}

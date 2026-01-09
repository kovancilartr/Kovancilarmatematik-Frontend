// hooks/api/use-course-data.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient, Category, Subject, Lesson } from '@/lib/api';

// This interface combines the data into a single, structured object
export interface CourseData extends Category {
  subjects: Array<Subject & { lessons: Lesson[] }>;
}

const fetchCourseData = async (categoryId: string): Promise<CourseData> => {
  // 1. Fetch the main category details
  const categoryPromise = apiClient.getCategoryById(categoryId);

  // 2. Fetch the subjects for that category
  const subjectsPromise = apiClient.getSubjectsByCategoryId(categoryId);

  const [categoryResponse, subjectsResponse] = await Promise.all([
    categoryPromise,
    subjectsPromise,
  ]);

  if (!categoryResponse.success || !categoryResponse.data) {
    const error = new Error(categoryResponse.error?.message || 'Failed to fetch course details.');
    // Attach status for QueryProvider
    if (categoryResponse.error?.code === 'FORBIDDEN') {
      (error as any).status = 403;
    }
    if (categoryResponse.error?.code === 'NOT_FOUND') {
      (error as any).status = 404;
    }
    throw error;
  }

  if (!subjectsResponse.success || !subjectsResponse.data) {
    throw new Error(subjectsResponse.error?.message || 'Failed to fetch course subjects.');
  }

  const subjects = subjectsResponse.data;

  // 3. Fetch lessons for all subjects in parallel
  const lessonPromises = subjects.map(subject =>
    apiClient.getLessonsBySubjectId(subject.id)
  );

  const lessonResponses = await Promise.all(lessonPromises);

  // 4. Stitch the data together
  const subjectsWithLessons = subjects.map((subject, index) => {
    const lessonsResponse = lessonResponses[index];
    return {
      ...subject,
      lessons: lessonsResponse.success ? (lessonsResponse.data || []) : [],
    };
  });

  return {
    ...categoryResponse.data,
    subjects: subjectsWithLessons,
  };
};

export const useCourseData = (categoryId: string) => {
  return useQuery<CourseData, Error>({
    queryKey: ['courseData', categoryId],
    queryFn: () => fetchCourseData(categoryId),
    enabled: !!categoryId, // Only run query if categoryId is provided
  });
};

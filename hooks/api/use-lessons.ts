// hooks/api/use-lessons.ts
"use client";

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient, Lesson } from '@/lib/api';

// --- Queries ---

export const useGetAllLessons = () => {
  return useQuery<Lesson[], Error>({
    queryKey: ['lessons'],
    queryFn: async () => {
      const response = await apiClient.getAllLessons();
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch lessons.');
      }
      return response.data;
    },
  });
};

export const useGetLessonById = (id: string) => {
  return useQuery<Lesson, Error>({
    queryKey: ['lessons', id],
    queryFn: async () => {
      const response = await apiClient.getLessonById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || `Failed to fetch lesson with id ${id}.`);
      }
      return response.data;
    },
    enabled: !!id,
  });
};

// --- Mutations ---

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<Lesson, Error, { name: string; videoUrl: string; subjectId: string }>({
    mutationFn: async (newLessonData) => {
      const response = await apiClient.createLesson(newLessonData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create lesson.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] }); // Invalidate subjects as well
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<Lesson, Error, { id: string; data: Partial<Lesson> }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.updateLesson(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update lesson.');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: async (lessonId) => {
      const response = await apiClient.deleteLesson(lessonId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete lesson.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

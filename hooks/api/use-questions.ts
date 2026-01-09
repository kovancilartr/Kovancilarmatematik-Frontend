// hooks/api/use-questions.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, Question } from "@/lib/api";

// --- Queries ---

export const useGetAllQuestions = () => {
  return useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await apiClient.getAllQuestions();
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to fetch questions.");
      }
      return response.data;
    },
  });
};

export const useGetQuestionById = (id: string) => {
  return useQuery<Question, Error>({
    queryKey: ["questions", id],
    queryFn: async () => {
      const response = await apiClient.getQuestionById(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || `Failed to fetch question with id ${id}.`
        );
      }
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetQuestionsByLearningObjectiveId = (
  learningObjectiveId: string
) => {
  return useQuery<Question[], Error>({
    queryKey: ["questions", "learningObjective", learningObjectiveId],
    queryFn: async () => {
      const response = await apiClient.getQuestionsByLearningObjectiveId(
        learningObjectiveId
      );
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message ||
          `Failed to fetch questions for learning objective ${learningObjectiveId}.`
        );
      }
      return response.data;
    },
    enabled: !!learningObjectiveId,
  });
};

// --- Mutations ---

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Question,
    Error,
    {
      imageUrl: string;
      options: object;
      correctAnswer: string;
      difficulty: number;
      learningObjectiveId: string;
    }
  >({
    mutationFn: async (newQuestionData) => {
      const response = await apiClient.createQuestion(newQuestionData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to create question.");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({
        queryKey: ["learningObjectives", data.learningObjectiveId],
      });
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Question,
    Error,
    { id: string; data: Partial<Omit<Question, "id">> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.updateQuestion(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to update question.");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["learningObjectives", data.learningObjectiveId],
      });
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (questionId) => {
      const response = await apiClient.deleteQuestion(questionId);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to delete question.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] }); // Admin questions sayfası için
    },
  });
};

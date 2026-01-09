// hooks/api/use-learning-objectives.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, LearningObjective } from "@/lib/api";

// --- Queries ---

export const useGetAllLearningObjectives = () => {
  return useQuery<LearningObjective[], Error>({
    queryKey: ["learningObjectives"],
    queryFn: async () => {
      const response = await apiClient.getAllLearningObjectives();
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to fetch learning objectives."
        );
      }
      return response.data;
    },
  });
};

export const useGetLearningObjectiveById = (id: string) => {
  return useQuery<LearningObjective, Error>({
    queryKey: ["learningObjectives", id],
    queryFn: async () => {
      const response = await apiClient.getLearningObjectiveById(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message ||
            `Failed to fetch learning objective with id ${id}.`
        );
      }
      return response.data;
    },
    enabled: !!id,
  });
};

// --- Mutations ---

export const useCreateLearningObjective = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LearningObjective,
    Error,
    { name: string; order: number; subjectId: string }
  >({
    mutationFn: async (newObjectiveData) => {
      const response = await apiClient.createLearningObjective(newObjectiveData);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to create learning objective."
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useUpdateLearningObjective = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LearningObjective,
    Error,
    { id: string; data: Partial<LearningObjective> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.updateLearningObjective(id, data);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to update learning objective."
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
      queryClient.invalidateQueries({
        queryKey: ["learningObjectives", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useDeleteLearningObjective = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (objectiveId) => {
      const response = await apiClient.deleteLearningObjective(objectiveId);
      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to delete learning objective."
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learningObjectives"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

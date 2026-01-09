// hooks/api/use-tests.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, Test } from "@/lib/api";

// --- Queries ---

export const useGetAllTests = () => {
  return useQuery<Test[], Error>({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await apiClient.getAllTests();
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to fetch tests.");
      }
      return response.data;
    },
  });
};

export const useGetTestById = (id: string) => {
  return useQuery<Test, Error>({
    queryKey: ["tests", id],
    queryFn: async () => {
      const response = await apiClient.getTestById(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || `Failed to fetch test with id ${id}.`
        );
      }
      return response.data;
    },
    enabled: !!id,
  });
};

// --- Mutations ---

export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Test,
    Error,
    {
      name: string;
      description?: string;
      questionIds: { questionId: string; order: number }[];
    }
  >({
    mutationFn: async (newTestData) => {
      const response = await apiClient.createTest(newTestData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to create test.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Test,
    Error,
    {
      id: string;
      data: Partial<{
        name: string;
        description?: string;
        questionIds: { questionId: string; order: number }[];
      }>;
    }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.updateTest(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Failed to update test.");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["tests", variables.id] });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (testId) => {
      const response = await apiClient.deleteTest(testId);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to delete test.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

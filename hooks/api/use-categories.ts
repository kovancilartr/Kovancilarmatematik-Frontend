// hooks/api/use-categories.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/lib/api";

// --- Queries ---

/**
 * Fetch all categories
 */
const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await apiClient.getAllCategories();
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || "Failed to fetch categories.");
  }
  return response.data;
};

export const useGetAllCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
};

/**
 * Fetch a single category by its ID
 */
const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await apiClient.getCategoryById(id);
  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message || `Failed to fetch category with id ${id}.`
    );
  }
  return response.data;
};

export const useGetCategoryById = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ["categories", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

// --- Mutations ---

/**
 * Create a new category
 */
const createCategory = async (newCategoryData: CreateCategoryPayload): Promise<Category> => {
  const response = await apiClient.createCategory(newCategoryData);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || "Failed to create category.");
  }
  return response.data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

/**
 * Update an existing category
 */
const updateCategory = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateCategoryPayload;
}): Promise<Category> => {
  const response = await apiClient.updateCategory(id, data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || "Failed to update category.");
  }
  return response.data;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: string; data: UpdateCategoryPayload }>({
    mutationFn: updateCategory,
    onSuccess: (data, variables) => {
      // Invalidate the list of all categories and the specific category query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
    },
  });
};

/**
 * Delete a category
 */
const deleteCategory = async (categoryId: string) => {
  const response = await apiClient.deleteCategory(categoryId);
  if (!response.success) {
    throw new Error(response.error?.message || "Failed to delete category.");
  }
  return response.data;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

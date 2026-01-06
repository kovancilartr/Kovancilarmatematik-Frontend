// hooks/api/use-subjects.ts
"use client";

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient, Subject, ApiResponse } from '@/lib/api'; // Assuming Subject and ApiResponse are exported from lib/api

/**
 * Mutation function for creating a new subject.
 * @param newSubjectData The data for the new subject.
 */
const createSubject = async (newSubjectData: { name: string; order: number; categoryId: string }): Promise<Subject> => {
  const response = await apiClient.createSubject(newSubjectData);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to create subject.');
  }
  return response.data;
};

/**
 * Custom hook to create a new subject.
 * Encapsulates the useMutation logic for subject creation.
 */
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      // Invalidate subjects queries to refetch lists after a new subject is created
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      // Optionally invalidate categories if category data also includes subjects and needs to be updated
      queryClient.invalidateQueries({ queryKey: ['categories'] }); 
    },
  });
};

/**
 * Query function for fetching all subjects.
 */
const fetchAllSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.getAllSubjects();
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch subjects.');
  }
  return response.data;
};

/**
 * Custom hook to fetch all subjects.
 */
export const useGetAllSubjects = () => {
  return useQuery<Subject[], Error>({
    queryKey: ['subjects'],
    queryFn: fetchAllSubjects,
  });
};

/**
 * Query function for fetching subjects by category ID.
 */
const fetchSubjectsByCategoryId = async (categoryId: string): Promise<Subject[]> => {
  const response = await apiClient.getSubjectsByCategoryId(categoryId);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || `Failed to fetch subjects for category ${categoryId}.`);
  }
  return response.data;
};

/**
 * Custom hook to fetch subjects by category ID.
 */
export const useGetSubjectsByCategoryId = (categoryId: string) => {
  return useQuery<Subject[], Error>({
    queryKey: ['subjects', { categoryId }],
    queryFn: () => fetchSubjectsByCategoryId(categoryId),
    enabled: !!categoryId, // Only run the query if categoryId is provided
  });
};

/**
 * Query function for fetching a single subject by ID.
 */
const fetchSubjectById = async (id: string): Promise<Subject> => {
  const response = await apiClient.getSubjectById(id);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || `Failed to fetch subject with ID ${id}.`);
  }
  return response.data;
};

/**
 * Custom hook to fetch a single subject by ID.
 */
export const useGetSubjectById = (id: string) => {
  return useQuery<Subject, Error>({
    queryKey: ['subjects', id],
    queryFn: () => fetchSubjectById(id),
    enabled: !!id, // Only run the query if ID is provided
  });
};


/**
 * Mutation function for updating an existing subject.
 * @param updatedSubjectData An object containing the subject ID and the data to update.
 */
const updateSubject = async (updatedSubjectData: { id: string; data: Partial<Subject> }): Promise<Subject> => {
  const response = await apiClient.updateSubject(updatedSubjectData.id, updatedSubjectData.data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update subject.');
  }
  return response.data;
};

/**
 * Custom hook to update an existing subject.
 * Encapsulates the useMutation logic for subject update.
 */
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubject,
    onSuccess: (data, variables) => {
      // Invalidate specific subject query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['subjects', variables.id] });
      // Invalidate all subjects queries if lists should reflect changes
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

/**
 * Mutation function for deleting a subject.
 * @param subjectId The ID of the subject to delete.
 */
const deleteSubject = async (subjectId: string): Promise<null> => {
  const response = await apiClient.deleteSubject(subjectId);
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to delete subject.');
  }
  return response.data;
};

/**
 * Custom hook to delete a subject.
 */
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

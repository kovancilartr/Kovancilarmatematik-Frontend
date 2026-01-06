// hooks/api/use-materials.ts
"use client";

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient, Material } from '@/lib/api';

// --- Queries ---

export const useGetAllMaterials = () => {
  return useQuery<Material[], Error>({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await apiClient.getAllMaterials();
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch materials.');
      }
      return response.data;
    },
  });
};

export const useGetMaterialById = (id: string) => {
  return useQuery<Material, Error>({
    queryKey: ['materials', id],
    queryFn: async () => {
      const response = await apiClient.getMaterialById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || `Failed to fetch material with id ${id}.`);
      }
      return response.data;
    },
    enabled: !!id,
  });
};

// --- Mutations ---

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation<Material, Error, { name: string; url: string; lessonId: string }>({
    mutationFn: async (newMaterialData) => {
      const response = await apiClient.createMaterial(newMaterialData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create material.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] }); 
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation<Material, Error, { id: string; data: Partial<Material> }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.updateMaterial(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update material.');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: async (materialId) => {
      const response = await apiClient.deleteMaterial(materialId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete material.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

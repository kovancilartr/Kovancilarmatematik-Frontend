import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api, User, CreateUserPayload, UpdateUserPayload } from "@/lib/api";
import { toast } from "sonner";

export type UserData = User;
export type { CreateUserPayload, UpdateUserPayload };


// Get All Users
export const useGetAllUsers = (role?: string) => {
    return useQuery({
        queryKey: ["users", role],
        queryFn: async () => {
            const response = await api.getUsers(role);
            if (!response.success) throw new Error(response.error?.message || "Kullanıcılar getirilemedi");
            return response.data || [];
        },
    });
};

// Create User
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUserPayload) => {
            const response = await api.createUser(payload);
            if (!response.success) throw new Error(response.error?.message || "Kullanıcı oluşturulamadı");
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Kullanıcı başarıyla oluşturuldu");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Kullanıcı oluşturulurken bir hata oluştu");
        },
    });
};

// Update User
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateUserPayload }) => {
            const response = await api.updateUser(id, payload);
            if (!response.success) throw new Error(response.error?.message || "Kullanıcı güncellenemedi");
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Kullanıcı başarıyla güncellendi");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Kullanıcı güncellenirken bir hata oluştu");
        },
    });
};

// Delete User
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.deleteUser(id);
            if (!response.success) throw new Error(response.error?.message || "Kullanıcı silinemedi");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Kullanıcı başarıyla silindi");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Kullanıcı silinirken bir hata oluştu");
        },
    });
};

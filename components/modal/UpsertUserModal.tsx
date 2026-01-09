"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "../forms/UserForm";
import { UserData, useCreateUser, useUpdateUser } from "@/hooks/api/use-users";

interface UpsertUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: UserData | null; // If provided, edit mode
}

export const UpsertUserModal: React.FC<UpsertUserModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const isEditing = !!user;
    const isPending = createUser.isPending || updateUser.isPending;

    const handleSubmit = (values: any) => {
        if (isEditing && user) {
            updateUser.mutate(
                { id: user.id, payload: values },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        } else {
            createUser.mutate(values, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Kullanıcı bilgilerini aşağıdan güncelleyebilirsiniz."
                            : "Sisteme yeni bir kullanıcı eklemek için bilgileri doldurun."}
                    </DialogDescription>
                </DialogHeader>
                <UserForm
                    initialData={user}
                    mode={isEditing ? "edit" : "create"}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

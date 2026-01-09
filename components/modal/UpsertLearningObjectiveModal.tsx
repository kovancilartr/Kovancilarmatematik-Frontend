// components/modal/UpsertLearningObjectiveModal.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    useCreateLearningObjective,
    useUpdateLearningObjective,
} from "@/hooks/api/use-learning-objectives";
import LearningObjectiveForm from "@/components/forms/LearningObjectiveForm";
import type { LearningObjectiveFormValues } from "@/lib/validations";
import { LearningObjective } from "@/lib/api";

interface UpsertLearningObjectiveModalProps {
    children: React.ReactNode;
    learningObjective?: LearningObjective;
}

export function UpsertLearningObjectiveModal({
    children,
    learningObjective,
}: UpsertLearningObjectiveModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isEditMode = !!learningObjective;

    const { mutate: createLearningObjective, isPending: isCreating } =
        useCreateLearningObjective();
    const { mutate: updateLearningObjective, isPending: isUpdating } =
        useUpdateLearningObjective();

    const isPending = isCreating || isUpdating;

    const handleSubmit = (values: LearningObjectiveFormValues) => {
        if (isEditMode && learningObjective) {
            // Update existing learning objective
            updateLearningObjective(
                { id: learningObjective.id, data: values },
                {
                    onSuccess: () => {
                        toast.success("Kazanım başarıyla güncellendi!");
                        setIsOpen(false);
                    },
                    onError: (error) => {
                        toast.error(`Güncelleme başarısız: ${error.message}`);
                    },
                }
            );
        } else {
            // Create new learning objective
            createLearningObjective(values, {
                onSuccess: () => {
                    toast.success("Kazanım başarıyla oluşturuldu!");
                    setIsOpen(false);
                },
                onError: (error) => {
                    toast.error(`Oluşturma başarısız: ${error.message}`);
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">
                        {isEditMode ? "Kazanımı Düzenle" : "Yeni Kazanım Oluştur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Mevcut kazanımın bilgilerini güncelleyin."
                            : "Yeni bir kazanım oluşturun ve ilgili konuya bağlayın."}
                    </DialogDescription>
                </DialogHeader>
                <LearningObjectiveForm
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    initialData={learningObjective}
                    onCancel={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

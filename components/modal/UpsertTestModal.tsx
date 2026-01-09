// components/modal/UpsertTestModal.tsx
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
import { useCreateTest, useUpdateTest } from "@/hooks/api/use-tests";
import TestForm from "@/components/forms/TestForm";
import type { TestFormValues } from "@/lib/validations";
import { Test } from "@/lib/api";

interface UpsertTestModalProps {
  children: React.ReactNode; // The trigger element, e.g., a button
  test?: Test; // Pass the test object for editing
}

export function UpsertTestModal({ children, test }: UpsertTestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!test;

  const { mutate: createTest, isPending: isCreating } = useCreateTest();
  const { mutate: updateTest, isPending: isUpdating } = useUpdateTest();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: TestFormValues) => {
    // The API expects questionIds as an array of objects with questionId and order
    const apiData = {
      name: values.name,
      description: values.description,
      questions: values.questionIds.map((item, index) => ({
        questionId: item.questionId,
        order: index + 1, // Ensure order is sequential based on current array index
      })),
    };

    if (isEditMode && test) {
      // Update existing test
      updateTest(
        { id: test.id, data: apiData },
        {
          onSuccess: () => {
            toast.success("Test başarıyla güncellendi!");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      // Create new test
      createTest(apiData, {
        onSuccess: () => {
          toast.success("Test başarıyla oluşturuldu!");
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Testi Düzenle" : "Yeni Test Oluştur"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mevcut testin bilgilerini güncelleyin."
              : "Yeni bir test oluşturun ve soruları seçin."}
          </DialogDescription>
        </DialogHeader>
        <TestForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={test}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

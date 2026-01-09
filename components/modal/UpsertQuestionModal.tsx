// components/modal/UpsertQuestionModal.tsx
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
import { useCreateQuestion, useUpdateQuestion } from "@/hooks/api/use-questions";
import QuestionForm from "@/components/forms/QuestionForm";
import type { QuestionFormValues } from "@/lib/validations";
import { Question } from "@/lib/api";

interface UpsertQuestionModalProps {
  children: React.ReactNode; // The trigger element, e.g., a button
  question?: Question; // Pass the question object for editing
}

export function UpsertQuestionModal({ children, question }: UpsertQuestionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!question;

  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: QuestionFormValues) => {
    // Combine options A-E into a single object for the API
    const options = {
      a: values.optionA,
      b: values.optionB,
      c: values.optionC,
      d: values.optionD,
      e: values.optionE,
    };

    const apiData = {
      imageUrl: values.imageUrl,
      learningObjectiveId: values.learningObjectiveId,
      difficulty: values.difficulty,
      correctAnswer: values.correctAnswer,
      options: options,
    };


    if (isEditMode && question) {
      // Update existing question
      updateQuestion(
        { id: question.id, data: apiData },
        {
          onSuccess: () => {
            toast.success("Soru başarıyla güncellendi!");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      // Create new question
      createQuestion(apiData, {
        onSuccess: () => {
          toast.success("Soru başarıyla oluşturuldu!");
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error(`Oluşturma başarısız: ${error.message}`);
        },
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset form when closing modal
    if (!open && question) {
      // Small delay to let animation finish
      setTimeout(() => {
        // This will help next time modal opens
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mevcut sorunun bilgilerini güncelleyin."
              : "Yeni bir soru oluşturun ve detaylarını girin."}
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          key={question?.id || 'new-form'}
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={question}
          onCancel={() => setIsOpen(false)}
          isOpen={isOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

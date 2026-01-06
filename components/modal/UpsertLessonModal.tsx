// components/layout/modal/UpsertLessonModal.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateLesson, useUpdateLesson } from '@/hooks/api/use-lessons';
import { LessonForm, LessonFormValues } from '@/components/forms/LessonForm';
import { Lesson } from '@/lib/api';

interface UpsertLessonModalProps {
  children: React.ReactNode; 
  lesson?: Lesson; 
}

export function UpsertLessonModal({ children, lesson }: UpsertLessonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!lesson;

  const { mutate: createLesson, isPending: isCreating } = useCreateLesson();
  const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: LessonFormValues) => {
    if (isEditMode) {
      updateLesson(
        { id: lesson.id, data: values },
        {
          onSuccess: () => {
            toast.success('Ders başarıyla güncellendi!');
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      createLesson(values, {
        onSuccess: () => {
          toast.success('Ders başarıyla oluşturuldu!');
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Mevcut dersin bilgilerini güncelleyin.'
              : 'Yeni bir ders oluşturun.'}
          </DialogDescription>
        </DialogHeader>
        <LessonForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={lesson}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

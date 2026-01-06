// components/layout/modal/UpsertSubjectModal.tsx
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
import { useCreateSubject, useUpdateSubject } from '@/hooks/api/use-subjects';
import { SubjectForm, SubjectFormValues } from '@/components/forms/SubjectForm';
import { Subject } from '@/lib/api';

interface UpsertSubjectModalProps {
  children: React.ReactNode; // The trigger element, e.g., a button
  subject?: Subject; // Pass the subject object for editing
}

export function UpsertSubjectModal({ children, subject }: UpsertSubjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!subject;

  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: SubjectFormValues) => {
    if (isEditMode) {
      // Update existing subject
      updateSubject(
        { id: subject.id, data: values },
        {
          onSuccess: () => {
            toast.success('Kazanım başarıyla güncellendi!');
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      // Create new subject
      createSubject(values, {
        onSuccess: () => {
          toast.success('Kazanım başarıyla oluşturuldu!');
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
          <DialogTitle>{isEditMode ? 'Kazanımı Düzenle' : 'Yeni Kazanım Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Mevcut kazanımın bilgilerini güncelleyin.'
              : 'Yeni bir ders kazanımı oluşturun.'}
          </DialogDescription>
        </DialogHeader>
        <SubjectForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={subject}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
